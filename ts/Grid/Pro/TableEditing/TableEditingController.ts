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
import type DataTable from '../../../Data/DataTable';
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
import type { IndividualColumnOptions } from '../../Core/Options';

import Globals from '../../Core/Globals.js';
import {
    hasDataTableProvider
} from '../../Core/Data/DataProvider.js';

/**
 * Class name of the button offered when the table has no columns or no rows.
 */
export const emptyStateButtonClassName =
    Globals.classNamePrefix + 'empty-state-button';

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

    private async updateColumnsFromTable(table: DataTable): Promise<void> {
        const { grid } = this;
        const columns = table.getColumns(void 0, false, true) as Record<
            string,
            Array<DataTableValue>
        >;
        const columnOptions = this.getColumnOptions(table.getColumnIds());

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
        columnIds: string[]
    ): IndividualColumnOptions[] {
        const { grid } = this;
        const sourceColumnIds = new Set(columnIds);
        const includedColumnIds = new Set(columnIds);
        const options = columnIds.map((columnId): IndividualColumnOptions => ({
            ...(grid.columnPolicy.getIndividualColumnOptions(columnId) || {}),
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
