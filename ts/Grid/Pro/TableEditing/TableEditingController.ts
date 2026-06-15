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

import {
    hasDataTableProvider
} from '../../Core/Data/DataProvider.js';

/* *
 *
 *  Declarations
 *
 * */

interface DataProviderWithRowIndexMapping extends DataTableProvider {
    getOriginalRowIndexFromLocal(
        localRowIndex: number
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
        const rowIndex = await this.getOriginalRowIndex(context.rowId);

        if (!table || rowIndex === void 0) {
            return;
        }

        table.deleteRows(rowIndex, 1, { fromGrid: true });
        await this.updateRowsFromTable(table);
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

        table.deleteColumns([sourceColumnId], { fromGrid: true });
        await this.updateColumnsFromTable(table);
    }

    private async addRow(
        context: CellContextMenuContext,
        offset: 0 | 1
    ): Promise<void> {
        const table = this.getDataTable();
        const rowIndex = await this.getOriginalRowIndex(context.rowId);

        if (!table || rowIndex === void 0) {
            return;
        }

        this.insertRow(table, this.getEmptyRow(table), rowIndex + offset);
        await this.updateRowsFromTable(table);
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

        table.deleteColumns(void 0, { fromGrid: true });
        table.setColumns(nextColumns, void 0, { fromGrid: true });
        await this.updateColumnsFromTable(table);
    }

    private insertRow(
        table: DataTable,
        row: DataTableRowObject,
        rowIndex: number
    ): void {
        const columnIds = table.getColumnIds();
        const columns = table.getColumns(void 0, true);
        const nextColumns: Record<string, Array<DataTableValue>> = {};

        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            const columnId = columnIds[i];
            const column = Array.from(columns[columnId]);

            column.splice(rowIndex, 0, row[columnId] ?? null);
            nextColumns[columnId] = column;
        }

        table.deleteColumns(void 0, { fromGrid: true });
        table.setColumns(nextColumns, void 0, { fromGrid: true });
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

    private async getOriginalRowIndex(
        rowId: RowId | undefined
    ): Promise<number | undefined> {
        const provider = this.grid.dataProvider;

        if (!provider || rowId === void 0) {
            return;
        }

        const rowIndex = await provider.getRowIndex(rowId);
        if (rowIndex === void 0) {
            return;
        }

        return hasRowIndexMapping(provider) ?
            await provider.getOriginalRowIndexFromLocal(rowIndex) :
            rowIndex;
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

        return idColumn ? {
            [idColumn]: this.getNewRowId(table, idColumn)
        } : {};
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
    return !!(
        provider &&
        typeof (
            provider as {
                getOriginalRowIndexFromLocal?: unknown;
            }
        ).getOriginalRowIndexFromLocal === 'function'
    );
}

/* *
 *
 *  Default Export
 *
 * */

export default TableEditingController;
