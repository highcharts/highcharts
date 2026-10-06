/* *
 *
 *  Grid Pro table editing controller
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Grid from '../../Core/Grid';
import type Column from '../../Core/Table/Column';
import type DataTable from '../../../Data/DataTable';
import type HeaderCell from '../../Core/Table/Header/HeaderCell';
import type {
    CellContextMenuContext
} from '../../Core/Table/CellContextMenu/CellContextMenuBuiltInActions';
import type {
    Column as DataTableColumn,
    RowObject as DataTableRowObject
} from '../../../Data/DataTable';
import type {
    DataTableProvider,
    RowId
} from '../../Core/Data/DataProvider';
import type { DataTableValue } from '../../../Data/DataTableOptions';
import type {
    GroupedHeaderOptions,
    IndividualColumnOptions
} from '../../Core/Options';

import Globals from '../../Core/Globals.js';
import GridUtils from '../../Core/GridUtils.js';
import {
    hasDataTableProvider
} from '../../Core/Data/DataProvider.js';

const { makeHTMLElement, setHTMLContent } = GridUtils;

/**
 * Class name of the button offered when the table has no columns or no rows.
 */
export const emptyStateButtonClassName =
    Globals.classNamePrefix + 'empty-state-button';

/**
 * Class name marking a name that cannot be used. Shared with cell editing, so
 * that a rejected header reads the same as a rejected cell.
 */
export const renamingErrorClassName =
    Globals.classNamePrefix + 'edited-cell-error';

/* *
 *
 *  Declarations
 *
 * */

interface DataProviderWithRowIndexMapping extends DataTableProvider {
    getOriginalRowIndexFromLocal(
        localRowIndex: number
    ): Promise<number | undefined>;
    getLocalRowIndexFromOriginal(
        originalRowIndex: number
    ): Promise<number | undefined>;
}

/**
 * What an open header input writes when submitted.
 */
export type RenamingTarget = ('name'|'id');

/**
 * Options for structural table editing.
 */
export interface TableEditingOptions {
    /**
     * Whether built-in structural table editing UI is enabled.
     *
     * When enabled, Grid Pro adds built-in context menu actions for adding and
     * deleting rows and columns.
     *
     * @default false
     */
    enabled?: boolean;

    /**
     * Options for the header context menu action that renames a column.
     */
    columnRenaming?: ColumnRenamingOptions;

    /**
     * Options for the header context menu action that changes a column id.
     */
    columnIdEditing?: ColumnIdEditingOptions;
}

/**
 * Options for the *Rename column* header context menu action, which sets
 * [`columns[].header.format`](https://api.highcharts.com/grid/columns.header.format).
 * Only the displayed name changes, so the data keeps its column ids and
 * nothing configured against them can break.
 */
export interface ColumnRenamingOptions {
    /**
     * Whether a column can be renamed. Needs `tableEditing.enabled` as well.
     *
     * @default true
     */
    enabled?: boolean;
}

/**
 * Options for the *Change column id* header context menu action, which
 * renames the column in the data.
 *
 * Everything Grid holds the old id in moves along with it: the column
 * options, the `header` layout, `data.idColumn` and the current sorting. A
 * column Grid cannot move safely offers the action greyed out. The displayed
 * name is left alone, since renaming is its own action.
 */
export interface ColumnIdEditingOptions {
    /**
     * Whether a column id can be changed. Needs `tableEditing.enabled` as
     * well.
     *
     * @default false
     */
    enabled?: boolean;
}

/* *
 *
 *  Class
 *
 * */

/**
 * Handles structural row and column editing for Grid Pro.
 */
class TableEditingController {

    /* *
     *
     *  Properties
     *
     * */

    private readonly grid: Grid;

    /**
     * Header cell whose label is currently being edited.
     */
    private renamedCell?: HeaderCell;

    /**
     * The open header input, if any.
     */
    private renameInput?: HTMLInputElement;

    /**
     * What the open header input writes.
     */
    private renamingTarget: RenamingTarget = 'name';

    /**
     * Whether the name currently in the header input was refused.
     */
    private renamingRejected = false;

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(grid: Grid) {
        this.grid = grid;
    }

    /* *
     *
     *  Methods
     *
     * */

    /**
     * Returns whether table editing UI is explicitly enabled.
     */
    public isEnabled(): boolean {
        return this.grid.options?.tableEditing?.enabled === true;
    }

    /**
     * Returns whether row actions can be used for the current context.
     *
     * @param context
     * Context menu runtime context.
     */
    public canEditRows(context: CellContextMenuContext): boolean {
        return (
            this.isEnabled() &&
            context.rowId !== void 0 &&
            !!this.getDataTable()
        );
    }

    /**
     * Returns whether column actions can be used for the current context.
     *
     * @param context
     * Context menu runtime context.
     */
    public canEditColumns(context: CellContextMenuContext): boolean {
        return (
            this.isEnabled() &&
            !!context.sourceColumnId &&
            context.columnId === context.sourceColumnId &&
            !context.grid.columnPolicy.isColumnUnbound(context.columnId) &&
            !!this.getDataTable()
        );
    }

    /**
     * Returns whether a column can be deleted.
     *
     * @param context
     * Context menu runtime context.
     */
    public canDeleteColumn(context: CellContextMenuContext): boolean {
        const table = this.getDataTable();
        const sourceColumnId = context.sourceColumnId;

        return (
            this.canEditColumns(context) &&
            !!table &&
            !!sourceColumnId &&
            table.getColumnIds().length > 1 &&
            !this.isIdColumn(sourceColumnId)
        );
    }

    /**
     * Returns what an empty table is missing. Context menu actions cannot
     * cover either case, since they need a body cell to open on.
     */
    public getEmptyState(): 'columns' | 'rows' | undefined {
        const table = this.isEnabled() ? this.getDataTable() : void 0;

        if (!table) {
            return;
        }

        if (table.getColumnIds().length < 1) {
            return 'columns';
        }

        if (table.getRowCount() < 1) {
            return 'rows';
        }
    }

    /**
     * Adds the first column to an empty table.
     */
    public async addFirstColumn(): Promise<void> {
        const table = this.getDataTable();

        if (!table) {
            return;
        }

        table.setColumns({
            [this.getNewColumnId(table)]: this.getEmptyColumn(table)
        }, void 0, { fromGrid: true });
        await this.updateColumnsFromTable(table);
    }

    /**
     * Adds the first row to a table that has columns but no rows.
     */
    public async addFirstRow(): Promise<void> {
        const table = this.getDataTable();

        if (!table) {
            return;
        }

        table.setRows([this.getEmptyRow(table)], 0, true, { fromGrid: true });
        await this.updateRowsFromTable(table);
    }

    /**
     * Adds an empty row above the context row.
     *
     * @param context
     * Context menu runtime context.
     */
    public async addRowAbove(
        context: CellContextMenuContext
    ): Promise<void> {
        await this.addRow(context, 0);
    }

    /**
     * Adds an empty row below the context row.
     *
     * @param context
     * Context menu runtime context.
     */
    public async addRowBelow(
        context: CellContextMenuContext
    ): Promise<void> {
        await this.addRow(context, 1);
    }

    /**
     * Deletes the context row.
     *
     * @param context
     * Context menu runtime context.
     */
    public async deleteRow(
        context: CellContextMenuContext
    ): Promise<void> {
        const table = this.getDataTable();
        const rowIndexes = await this.getRowIndexes(context.rowId);

        if (!table || !rowIndexes) {
            return;
        }

        table.deleteRows(rowIndexes.original, 1, { fromGrid: true });
        await this.updateRowsFromTable(table);

        // The row that moved up into the deleted one's place.
        this.focusResult(rowIndexes.local, context.columnId);
    }

    /**
     * Adds an empty column before the context column.
     *
     * @param context
     * Context menu runtime context.
     */
    public async addColumnBefore(
        context: CellContextMenuContext
    ): Promise<void> {
        await this.addColumn(context, 0);
    }

    /**
     * Adds an empty column after the context column.
     *
     * @param context
     * Context menu runtime context.
     */
    public async addColumnAfter(
        context: CellContextMenuContext
    ): Promise<void> {
        await this.addColumn(context, 1);
    }

    /**
     * Deletes the context column.
     *
     * @param context
     * Context menu runtime context.
     */
    public async deleteColumn(
        context: CellContextMenuContext
    ): Promise<void> {
        const table = this.getDataTable();
        const sourceColumnId = context.sourceColumnId;

        if (!table || !sourceColumnId || !this.canDeleteColumn(context)) {
            return;
        }

        const columnIds = table.getColumnIds();
        const deletedIndex = columnIds.indexOf(sourceColumnId);
        const rowIndexes = await this.getRowIndexes(context.rowId);

        table.deleteColumns([sourceColumnId], { fromGrid: true });
        await this.updateColumnsFromTable(table);

        // The column that took the deleted one's place, or its predecessor.
        this.focusResult(
            rowIndexes?.local || 0,
            columnIds[deletedIndex + 1] || columnIds[deletedIndex - 1]
        );
    }

    /**
     * Returns whether the *Rename column* action belongs in the menu of a
     * column.
     *
     * @param column
     * Column behind the header cell. Undefined for grouped headers, which
     * are described by the `header` option instead of by a column.
     */
    public canRenameColumn(column?: Column): column is Column {
        return (
            !!column &&
            this.isEnabled() &&
            this.grid.options?.tableEditing?.columnRenaming?.enabled !==
                false &&
            // A formatter would overwrite whatever the user types.
            !column.options.header?.formatter
        );
    }

    /**
     * Returns whether the *Change column id* action belongs in the menu of a
     * column. Unlike renaming, it is off unless asked for.
     *
     * @param column
     * Column behind the header cell. Undefined for grouped headers, which
     * are described by the `header` option instead of by a column.
     */
    public canEditColumnId(column?: Column): column is Column {
        return (
            !!column &&
            this.isEnabled() &&
            this.grid.options?.tableEditing?.columnIdEditing?.enabled === true
        );
    }

    /**
     * Returns what keeps a column id from being changed, or undefined when
     * nothing does. Renaming has no blockers, since it touches nothing
     * outside the column's own options.
     *
     * @param column
     * Column whose id would change.
     *
     * @return
     * The option holding the column id that the change cannot move.
     */
    public getColumnIdBlocker(column: Column): string | undefined {
        const { grid } = this;
        const options = grid.options;

        // Renaming the source id of a column that reads from somewhere else
        // would silently repoint it.
        if (grid.columnPolicy.getColumnSourceId(column.id) !== column.id) {
            return 'columns.dataId';
        }

        // Features that store a column id of their own. The rename moves the
        // ones it owns; anything listed here it refuses rather than breaks.
        const foreignReferences: Array<[string, unknown]> = [
            ['treeView.treeColumn', (options as {
                treeView?: { treeColumn?: string };
            })?.treeView?.treeColumn],
            ['data.treeView.parentIdColumn', (options?.data as {
                treeView?: { parentIdColumn?: string, pathColumn?: string };
            })?.treeView?.parentIdColumn],
            ['data.treeView.pathColumn', (options?.data as {
                treeView?: { pathColumn?: string };
            })?.treeView?.pathColumn]
        ];

        for (const [optionPath, referencedId] of foreignReferences) {
            if (referencedId === column.id) {
                return optionPath;
            }
        }

        const aggregated = (options as {
            summaryColumns?: { aggregatedColumns?: string[] };
        })?.summaryColumns?.aggregatedColumns;

        if (aggregated?.includes(column.id)) {
            return 'summaryColumns.aggregatedColumns';
        }
    }

    /**
     * Opens a text input over the header, seeded with whatever the chosen
     * target currently holds.
     *
     * @param cell
     * Header cell to edit.
     *
     * @param target
     * `name` edits the displayed name, `id` the column id in the data.
     */
    public startRenamingColumn(
        cell: HeaderCell,
        target: RenamingTarget = 'name'
    ): void {
        const column = cell.column;
        const allowed = target === 'id' ?
            this.canEditColumnId(column) && !this.getColumnIdBlocker(column) :
            this.canRenameColumn(column);

        if (!allowed || !column) {
            return;
        }

        this.stopRenamingColumn(true);
        this.renamingTarget = target;

        // The same overlay cell editing uses, so that an edited header reads
        // like an edited cell: it covers the label and the toolbar icons, and
        // brings its own frame.
        const container = makeHTMLElement('div', {
            className: Globals.getClassName('cellEditingContainer')
        }, cell.htmlElement);
        const input = makeHTMLElement<HTMLInputElement>('input', {
            className: Globals.getClassName('input')
        }, container);

        const lang = this.grid.options?.lang?.tableEditing;

        input.type = 'text';
        input.value = this.getRenamingSeed(cell);
        input.setAttribute(
            'aria-label',
            (target === 'id' ? lang?.changeColumnId : lang?.renameColumn) || ''
        );

        cell.htmlElement.classList.add(Globals.getClassName('editedCell'));
        this.renamedCell = cell;
        this.renameInput = input;
        this.renamingRejected = false;
        input.focus();
        input.select();

        input.addEventListener('blur', (): void => {
            // A rejected name must not survive the user clicking away.
            this.stopRenamingColumn(!this.renamingRejected);
        });
        input.addEventListener('input', (): void => {
            this.renamingRejected = false;
            input.removeAttribute('aria-invalid');
            container.classList.remove(renamingErrorClassName);
        });
        input.addEventListener('keydown', (e): void => {
            if (e.key !== 'Enter' && e.key !== 'Escape') {
                return;
            }

            // The header cell handles both keys itself, so keep them here.
            e.preventDefault();
            e.stopPropagation();
            this.stopRenamingColumn(e.key === 'Enter');

            // The input stays open when the typed id is taken, so leave the
            // focus in it for the correction.
            if (!this.renamedCell) {
                cell.htmlElement.focus();
            }
        });
    }

    /**
     * Closes the header input, optionally writing the typed name. An empty or
     * unchanged name is always discarded. A taken column id keeps the input
     * open instead, marked as rejected.
     *
     * @param submit
     * Whether to save the typed name.
     */
    public stopRenamingColumn(submit: boolean): void {
        const cell = this.renamedCell;
        const input = this.renameInput;
        const column = cell?.column;

        if (!cell || !column || !input) {
            return;
        }

        const name = input.value.trim();

        if (submit && name && name !== this.getRenamingSeed(cell)) {
            if (this.renamingTarget === 'id') {
                if (!this.isFreeColumnId(name)) {
                    this.renamingRejected = true;
                    input.setAttribute('aria-invalid', 'true');
                    input.parentElement?.classList.add(renamingErrorClassName);
                    input.focus();
                    return;
                }

                this.closeRenamingInput();
                void this.renameColumnId(column, name);
                return;
            }

            column.setOptions({ header: { format: name } });
            cell.value = column.format(name);

            // The cell labels itself with the column id, which renaming does
            // not touch, so it would keep announcing the old name.
            cell.htmlElement.setAttribute('aria-label', cell.value);

            if (cell.headerContent) {
                setHTMLContent(cell.headerContent, cell.value);
            }
        }

        this.closeRenamingInput();
    }

    /**
     * Removes the editing overlay and the marker it put on the header cell.
     */
    private closeRenamingInput(): void {
        const cell = this.renamedCell;
        const input = this.renameInput;

        // Cleared before the DOM is touched: removing a focused input fires
        // blur, which would otherwise re-enter and commit what was just
        // discarded.
        delete this.renamedCell;
        delete this.renameInput;

        input?.parentElement?.remove();
        cell?.htmlElement.classList.remove(Globals.getClassName('editedCell'));
    }

    /**
     * Returns the name the input starts from, which is also the name an
     * unchanged submit compares against.
     *
     * @param cell
     * Header cell being renamed.
     */
    private getRenamingSeed(cell: HeaderCell): string {
        // The id action edits the id, so a displayed name coming from a
        // format would be a misleading thing to put in the input.
        return this.renamingTarget === 'id' ?
            (cell.column?.id || '') :
            cell.value;
    }

    private isFreeColumnId(columnId: string): boolean {
        return (
            !this.getDataTable()?.getColumnIds().includes(columnId) &&
            !this.grid.columnPolicy.getColumnIds().includes(columnId)
        );
    }

    /**
     * Renames a column in the data, moving along everything Grid holds the
     * old id in.
     *
     * @param column
     * Column to rename.
     *
     * @param newId
     * The new column id, already checked to be free.
     */
    private async renameColumnId(
        column: Column,
        newId: string
    ): Promise<void> {
        const table = this.getDataTable();

        if (!table) {
            return;
        }

        const oldId = column.id;
        const columnIds = table.getColumnIds();
        const columns = table.getColumns(void 0, true);
        const nextColumns: Record<string, DataTableColumn> = {};

        // Rebuilt rather than reassigned, since the key order is the column
        // order.
        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            const columnId = columnIds[i];
            nextColumns[columnId === oldId ? newId : columnId] =
                columns[columnId];
        }

        table.deleteColumns(void 0, { fromGrid: true });
        table.setColumns(nextColumns, void 0, { fromGrid: true });

        this.repointColumnId(oldId, newId);
        await this.updateColumnsFromTable(table, { [newId]: oldId });

        this.grid.viewport?.getColumn(newId)?.header?.htmlElement.focus();
    }

    /**
     * Moves the references Grid keeps to a column id over to the new one.
     * What it cannot move is refused up front by `getColumnRenamingBlocker`.
     *
     * @param oldId
     * The id being replaced.
     *
     * @param newId
     * The id replacing it.
     */
    private repointColumnId(oldId: string, newId: string): void {
        const { grid } = this;

        for (const options of [grid.options, grid.userOptions]) {
            repointHeaderColumnId(options?.header, oldId, newId);

            const data = options?.data as { idColumn?: string } | undefined;

            if (data?.idColumn === oldId) {
                data.idColumn = newId;
            }
        }

        // Sorting is deliberately left alone. It reloads from the column
        // options, which the rename carries over, and repointing the state
        // here would make that reload see no change and keep a modifier
        // pointing at the old column.
    }

    private async addRow(
        context: CellContextMenuContext,
        offset: 0 | 1
    ): Promise<void> {
        const table = this.getDataTable();
        const rowIndexes = await this.getRowIndexes(context.rowId);

        if (!table || !rowIndexes) {
            return;
        }

        const insertIndex = rowIndexes.original + offset;

        table.setRows(
            [this.getEmptyRow(table)],
            insertIndex,
            true,
            { fromGrid: true }
        );
        await this.updateRowsFromTable(table);

        // Sorting and filtering decide where the row ends up, or whether it
        // shows at all, so ask the provider instead of counting on the offset.
        const provider = this.grid.dataProvider;

        this.focusResult(
            hasRowIndexMapping(provider) ?
                await provider.getLocalRowIndexFromOriginal(insertIndex) :
                insertIndex,
            context.columnId
        );
    }

    private async addColumn(
        context: CellContextMenuContext,
        offset: 0 | 1
    ): Promise<void> {
        const table = this.getDataTable();
        const sourceColumnId = context.sourceColumnId;

        if (!table || !sourceColumnId || !this.canEditColumns(context)) {
            return;
        }

        const nextColumnId = this.getNewColumnId(table);
        const columnIds = table.getColumnIds();
        const targetIndex = columnIds.indexOf(sourceColumnId);

        if (targetIndex === -1) {
            return;
        }

        const insertIndex = targetIndex + offset;
        const columns = table.getColumns(void 0, true);
        const nextColumns: Record<string, DataTableColumn> = {};

        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            if (i === insertIndex) {
                nextColumns[nextColumnId] = this.getEmptyColumn(table);
            }
            nextColumns[columnIds[i]] = columns[columnIds[i]];
        }

        if (insertIndex === columnIds.length) {
            nextColumns[nextColumnId] = this.getEmptyColumn(table);
        }

        const rowIndexes = await this.getRowIndexes(context.rowId);

        table.deleteColumns(void 0, { fromGrid: true });
        table.setColumns(nextColumns, void 0, { fromGrid: true });
        await this.updateColumnsFromTable(table);
        this.focusResult(rowIndexes?.local || 0, nextColumnId);
    }

    private getDataTable(): DataTable | undefined {
        const provider = this.grid.dataProvider;
        const dataOptions = this.grid.options?.data as {
            connector?: unknown;
        } | undefined;

        if (dataOptions?.connector) {
            return;
        }

        return hasDataTableProvider(provider) ?
            provider.getDataTable() :
            void 0;
    }

    /**
     * Resolves a row both as the viewport lists it and as it sits in the
     * source table. Sorting and filtering make the two differ.
     *
     * @param rowId
     * Id of the row to resolve.
     */
    private async getRowIndexes(
        rowId: RowId | undefined
    ): Promise<{ local: number, original: number } | undefined> {
        const provider = this.grid.dataProvider;

        if (!provider || rowId === void 0) {
            return;
        }

        const local = await provider.getRowIndex(rowId);

        if (local === void 0) {
            return;
        }

        const original = hasRowIndexMapping(provider) ?
            await provider.getOriginalRowIndexFromLocal(local) :
            local;

        return original === void 0 ? void 0 : { local, original };
    }

    /**
     * Moves the focus to the cell the edit produced. Without it the redraw
     * drops the focus to the document and nothing shows what changed.
     *
     * @param rowIndex
     * Presentation index of the row to focus, clamped to the last row.
     * Undefined when a filter hides the row, and then nothing is focused.
     *
     * @param columnId
     * Column to focus, or the first one when it no longer exists.
     */
    private focusResult(rowIndex: number | undefined, columnId?: string): void {
        const viewport = this.grid.viewport;

        if (!viewport) {
            return;
        }

        const lastRowIndex = viewport.rowsVirtualizer.rowCount - 1;

        if (lastRowIndex < 0) {
            this.grid.contentWrapper?.querySelector<HTMLElement>(
                '.' + emptyStateButtonClassName
            )?.focus();
            return;
        }

        if (rowIndex === void 0) {
            return;
        }

        viewport.focusCellByRowIndex(
            Math.min(rowIndex, lastRowIndex),
            Math.max(viewport.columns.findIndex(
                (column): boolean => column.id === columnId
            ), 0)
        );
    }

    private getNewColumnId(table: DataTable): string {
        const columnIds = new Set(table.getColumnIds());
        const prefix = 'column';
        let index = columnIds.size + 1;
        let columnId = prefix + index;

        while (columnIds.has(columnId)) {
            columnId = prefix + (++index);
        }

        return columnId;
    }

    private getEmptyColumn(table: DataTable): DataTableColumn {
        return new Array(table.getRowCount()).fill(null);
    }

    private getEmptyRow(table: DataTable): DataTableRowObject {
        const idColumn = this.getIdColumn();
        const row: DataTableRowObject = {};
        const columnIds = table.getColumnIds();

        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            row[columnIds[i]] = null;
        }

        if (idColumn) {
            row[idColumn] = this.getNewRowId(table, idColumn);
        }

        return row;
    }

    private getNewRowId(
        table: DataTable,
        idColumn: string
    ): string {
        const ids = new Set(table.getColumn(idColumn, true));
        const prefix = 'row';
        let index = table.getRowCount() + 1;
        let rowId = prefix + index;

        while (ids.has(rowId)) {
            rowId = prefix + (++index);
        }

        return rowId;
    }

    private async updateColumnsFromTable(
        table: DataTable,
        renamedFrom?: Record<string, string>
    ): Promise<void> {
        const { grid } = this;
        const columns = table.getColumns(void 0, false, true) as Record<
            string,
            Array<DataTableValue>
        >;
        const columnOptions = this.getColumnOptions(
            table.getColumnIds(),
            renamedFrom
        );

        grid.update({
            data: {
                dataTable: table,
                columns
            }
        }, false);
        grid.userOptions.columns = [];
        grid.columnPolicy.clearColumnOptions();
        grid.setColumnOptions(columnOptions, true, true);
        if (grid.options) {
            grid.options.columns = grid.userOptions.columns;
        }
        await this.redrawGrid();
    }

    private async updateRowsFromTable(table: DataTable): Promise<void> {
        this.grid.update({
            data: {
                dataTable: table
            }
        }, false);
        await this.redrawGrid();
    }

    private async redrawGrid(): Promise<void> {
        this.grid.dirtyFlags.add('grid');
        await this.grid.redraw();
    }

    private getColumnOptions(
        columnIds: string[],
        renamedFrom?: Record<string, string>
    ): IndividualColumnOptions[] {
        const { grid } = this;
        const sourceColumnIds = new Set(columnIds);
        const includedColumnIds = new Set(columnIds);
        const options = columnIds.map((columnId): IndividualColumnOptions => ({
            // A renamed column keeps its own options, the displayed name
            // among them: renaming is a separate action from this one.
            ...(grid.columnPolicy.getIndividualColumnOptions(
                renamedFrom?.[columnId] ?? columnId
            ) || {}),
            id: columnId
        }));

        for (const columnOptions of grid.userOptions.columns || []) {
            const columnId = columnOptions.id;
            const sourceColumnId = grid.columnPolicy.getColumnSourceId(
                columnId
            );

            if (
                includedColumnIds.has(columnId) ||
                (
                    sourceColumnId &&
                    !sourceColumnIds.has(sourceColumnId)
                )
            ) {
                continue;
            }

            options.push(columnOptions);
            includedColumnIds.add(columnId);
        }

        return options;
    }

    private isIdColumn(sourceColumnId: string): boolean {
        return this.getIdColumn() === sourceColumnId;
    }

    private getIdColumn(): string | undefined {
        return (this.grid.options?.data as { idColumn?: string } | undefined)
            ?.idColumn;
    }
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Repoints a column id inside a `header` option tree, in place.
 *
 * @param header
 * Header option tree, or a branch of one.
 *
 * @param oldId
 * The id being replaced.
 *
 * @param newId
 * The id replacing it.
 */
function repointHeaderColumnId(
    header: Array<GroupedHeaderOptions|string> | undefined,
    oldId: string,
    newId: string
): void {
    if (!header) {
        return;
    }

    for (let i = 0, iEnd = header.length; i < iEnd; ++i) {
        const entry = header[i];

        if (typeof entry === 'string') {
            if (entry === oldId) {
                header[i] = newId;
            }
            continue;
        }

        if (entry.columnId === oldId) {
            entry.columnId = newId;
        }

        repointHeaderColumnId(entry.columns, oldId, newId);
    }
}

/**
 * Returns whether a provider can map presentation rows to source rows.
 *
 * @param provider
 * Data provider instance to test.
 */
function hasRowIndexMapping(
    provider: unknown
): provider is DataProviderWithRowIndexMapping {
    const candidate = provider as {
        getOriginalRowIndexFromLocal?: unknown;
        getLocalRowIndexFromOriginal?: unknown;
    } | undefined;

    return !!(
        candidate &&
        typeof candidate.getOriginalRowIndexFromLocal === 'function' &&
        typeof candidate.getLocalRowIndexFromOriginal === 'function'
    );
}

/* *
 *
 *  Default Export
 *
 * */

export default TableEditingController;
