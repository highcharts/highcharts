/* *
 *
 *  Local Data Provider class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type {
    DataProviderOptions,
    ProviderPinningViewState,
    ProviderQueryScope,
    RowId
} from './DataProvider';
import type QueryingController from '../Querying/QueryingController';
import type DataTableOptions from '../../../Data/DataTableOptions';
import type { ColumnDataType } from '../Table/Column';
import type {
    RowObject as RowObjectType,
    CellType as DataTableCellType
} from '../../../Data/DataTable';

import { DataProvider } from './DataProvider.js';
import DataTable from '../../../Data/DataTable.js';
import ChainModifier from '../../../Data/Modifiers/ChainModifier.js';
import DataProviderRegistry from './DataProviderRegistry.js';
import U from '../../../Core/Utilities.js';

const { defined } = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Local data provider for the Grid.
 *
 * Uses a DataTable instances to serve data to the grid, applying query
 * modifiers and persisting edits locally.
 */
export class LocalDataProvider extends DataProvider {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The provider options.
     */
    public readonly options!: LocalDataProviderOptions;

    /**
     * The original table. Mutations (e.g. setValue) are applied here.
     */
    private dataTable?: DataTable;

    /**
     * The presentation table after applying query modifiers.
     */
    private presentationTable?: DataTable;

    /**
     * The row count before pagination is applied.
     */
    private prePaginationRowCount?: number;

    /**
     * Scoped row snapshots keyed by query scope.
     */
    private scopedViews: Partial<Record<ProviderQueryScope, ScopedRowsView>> =
        {};

    /**
     * The active view for rendering.
     */
    private activeView: ScopedRowsView = {
        rowIds: [],
        rowObjects: [],
        rowIdToIndex: new Map()
    };

    /**
     * Optional pinning state applied after query.
     */
    private pinningViewState?: ProviderPinningViewState;

    /**
     * Maps row ID to original row index in raw scope.
     */
    private rowIdToOriginalIndex: Map<RowId, number> = new Map();

    /**
     * Unbind callbacks for DataTable events.
     */
    private dataTableEventDestructors: Function[] = [];

    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        queryingController: QueryingController,
        options: LocalDataProviderOptions
    ) {
        super(queryingController, options);
        this.initDataTable();
    }

    /* *
     *
     *  Methods
     *
     * */

    private initDataTable(): void {
        this.querying.shouldBeUpdated = true;

        // Unregister all events attached to the previous data table.
        this.dataTableEventDestructors.forEach((fn): void => fn());
        const tableOptions = this.options.dataTable;

        // If the table is passed as a reference, it should be used instead of
        // creating a new one.
        if ((tableOptions as DataTable)?.clone) {
            this.dataTable = tableOptions as DataTable;
        } else {
            this.dataTable = new DataTable(tableOptions as DataTableOptions);
        }

        this.presentationTable = this.dataTable?.getModified();
        this.prePaginationRowCount = this.presentationTable?.rowCount ?? 0;

        for (const eventName of [
            'afterDeleteColumns',
            'afterDeleteRows',
            'afterSetCell',
            'afterSetColumns',
            'afterSetRows'
        ] as const) {
            const fn = this.dataTable.on(eventName, (): void => {
                this.querying.shouldBeUpdated = true;
            });
            this.dataTableEventDestructors.push(fn);
        }
    }

    public override getColumnIds(): Promise<string[]> {
        return Promise.resolve(this.presentationTable?.getColumnIds() ?? []);
    }

    public override getRowId(rowIndex: number): Promise<RowId | undefined> {
        return Promise.resolve(this.activeView.rowIds[rowIndex]);
    }

    public override getRowIndex(rowId: RowId): Promise<number | undefined> {
        return Promise.resolve(this.activeView.rowIdToIndex.get(rowId));
    }

    public override getRowObject(
        rowIndex: number
    ): Promise<RowObjectType | undefined> {
        return Promise.resolve(this.activeView.rowObjects[rowIndex]);
    }

    public override getPrePaginationRowCount(): Promise<number> {
        return Promise.resolve(this.prePaginationRowCount ?? 0);
    }

    public override getRowCount(): Promise<number> {
        return Promise.resolve(this.activeView.rowIds.length);
    }

    public override getValue(
        columnId: string,
        rowIndex: number
    ): Promise<DataTableCellType> {
        return Promise.resolve(
            this.activeView.rowObjects[rowIndex]?.[columnId] as
                DataTableCellType
        );
    }

    public override async setValue(
        value: DataTableCellType,
        columnId: string,
        rowId: RowId
    ): Promise<void> {
        const originalIndex = (
            typeof rowId === 'number' ?
                rowId :
                this.rowIdToOriginalIndex.get(rowId)
        );
        if (!defined(originalIndex)) {
            throw new Error('LocalDataProvider: unable to resolve rowId.');
        }

        this.dataTable?.setCell(columnId, originalIndex, value);
        return Promise.resolve();
    }

    /**
     * Applies querying modifiers and updates the presentation table.
     */
    public override async applyQuery(): Promise<void> {
        const controller = this.querying;
        const originalDataTable = this.dataTable;
        if (!originalDataTable) {
            return;
        }

        const rawTable = originalDataTable.getModified();

        const groupedModifiers = controller.getGroupedModifiers();
        let groupedTable: DataTable;

        if (groupedModifiers.length > 0) {
            const chainModifier = new ChainModifier({}, ...groupedModifiers);
            const dataTableCopy = originalDataTable.clone();
            await chainModifier.modify(dataTableCopy.getModified());
            groupedTable = dataTableCopy.getModified();
        } else {
            groupedTable = rawTable;
        }

        let sortingOnlyTable: DataTable = groupedTable;
        if (controller.sorting.modifier) {
            const sortingOnlyCopy = originalDataTable.clone();
            await controller.sorting.modifier.modify(
                sortingOnlyCopy.getModified()
            );
            sortingOnlyTable = sortingOnlyCopy.getModified();
        }

        this.prePaginationRowCount = groupedTable.rowCount;

        let activeTable = groupedTable;
        const paginationModifier =
            controller.pagination.createModifier(groupedTable.rowCount);
        if (paginationModifier) {
            activeTable = groupedTable.clone();
            await paginationModifier.modify(activeTable);
            activeTable = activeTable.getModified();
        }

        this.scopedViews.raw = this.createScopedView(rawTable);
        this.scopedViews.grouped = this.createScopedView(groupedTable);
        this.scopedViews.sortingOnly = this.createScopedView(sortingOnlyTable);
        this.scopedViews.active = this.createScopedView(activeTable);

        this.rowIdToOriginalIndex = this.createRowIdToOriginalIndexMap(
            rawTable
        );

        this.presentationTable = activeTable;
        await this.setPinningView(this.pinningViewState);
    }

    public override getScopedRowCount(
        scope: ProviderQueryScope = 'active'
    ): Promise<number> {
        return Promise.resolve(
            (this.scopedViews[scope] || this.activeView).rowIds.length
        );
    }

    public override getScopedRowId(
        rowIndex: number,
        scope: ProviderQueryScope = 'active'
    ): Promise<RowId | undefined> {
        return Promise.resolve(
            (this.scopedViews[scope] || this.activeView).rowIds[rowIndex]
        );
    }

    public override getScopedRowIndex(
        rowId: RowId,
        scope: ProviderQueryScope = 'active'
    ): Promise<number | undefined> {
        return Promise.resolve(
            (this.scopedViews[scope] || this.activeView).rowIdToIndex.get(rowId)
        );
    }

    public override getScopedRowObject(
        rowIndex: number,
        scope: ProviderQueryScope = 'active'
    ): Promise<RowObjectType | undefined> {
        return Promise.resolve(
            (this.scopedViews[scope] || this.activeView).rowObjects[rowIndex]
        );
    }

    public override getScopedRowsByIds(
        rowIds: RowId[],
        scope: ProviderQueryScope = 'active'
    ): Promise<Map<RowId, RowObjectType>> {
        const scopedView = this.scopedViews[scope] || this.activeView;
        const rows = new Map<RowId, RowObjectType>();
        for (const rowId of rowIds) {
            const index = scopedView.rowIdToIndex.get(rowId);
            if (index === void 0) {
                continue;
            }
            const row = scopedView.rowObjects[index];
            if (row) {
                rows.set(rowId, row);
            }
        }
        return Promise.resolve(rows);
    }

    public override setPinningView(
        state?: ProviderPinningViewState
    ): Promise<void> {
        this.pinningViewState = state;

        if (!state) {
            this.activeView = this.scopedViews.active || {
                rowIds: [],
                rowObjects: [],
                rowIdToIndex: new Map()
            };
            return Promise.resolve();
        }

        const groupedRows = this.scopedViews.grouped || this.activeView;
        const rawRows = this.scopedViews.raw || this.activeView;
        const finalRowIds = state.activeRowIds;
        const groupedMap = groupedRows.rowIdToIndex;
        const rawMap = rawRows.rowIdToIndex;
        const rowObjects: RowObjectType[] = [];

        for (const rowId of finalRowIds) {
            const groupedIndex = groupedMap.get(rowId);
            if (groupedIndex !== void 0) {
                rowObjects.push(groupedRows.rowObjects[groupedIndex] || {});
                continue;
            }

            const rawIndex = rawMap.get(rowId);
            rowObjects.push(
                rawIndex !== void 0 ?
                    rawRows.rowObjects[rawIndex] || {} :
                    {}
            );
        }

        this.activeView = {
            rowIds: finalRowIds.slice(),
            rowObjects,
            rowIdToIndex: createRowIdIndexMap(finalRowIds)
        };

        return Promise.resolve();
    }

    private createScopedView(table: DataTable): ScopedRowsView {
        const rowIds: RowId[] = [];
        const rowObjects: RowObjectType[] = [];

        for (let i = 0, iEnd = table.getRowCount(); i < iEnd; ++i) {
            rowIds.push(this.getRowIdFromTable(table, i));
            rowObjects.push(table.getRowObject(i) || {});
        }

        return {
            rowIds,
            rowObjects,
            rowIdToIndex: createRowIdIndexMap(rowIds)
        };
    }

    private createRowIdToOriginalIndexMap(table: DataTable): Map<RowId, number> {
        const map = new Map<RowId, number>();
        for (let i = 0, iEnd = table.getRowCount(); i < iEnd; ++i) {
            map.set(this.getRowIdFromTable(table, i), i);
        }
        return map;
    }

    private getRowIdFromTable(
        table: DataTable,
        rowIndex: number
    ): RowId {
        const row = table.getRowObject(rowIndex);
        const rowIdColumn = this.querying.grid.options
            ?.rendering?.rows?.rowIdColumn;

        if (row && rowIdColumn && table.hasColumns([rowIdColumn])) {
            const value = row[rowIdColumn];
            if (typeof value === 'string' || typeof value === 'number') {
                return value;
            }
        }

        const originalIndex = table.getOriginalRowIndex(rowIndex);
        if (typeof originalIndex === 'number') {
            return originalIndex;
        }

        return rowIndex;
    }

    public override destroy(): void {
        this.dataTableEventDestructors.forEach((fn): void => fn());
        this.dataTableEventDestructors.length = 0;
        this.scopedViews = {};
        this.activeView = {
            rowIds: [],
            rowObjects: [],
            rowIdToIndex: new Map()
        };
        this.rowIdToOriginalIndex.clear();
        this.pinningViewState = void 0;
    }

    public override getColumnDataType(
        columnId: string
    ): Promise<ColumnDataType> {
        const column = this.dataTable?.getColumn(columnId);
        if (!column) {
            return Promise.resolve('string');
        }

        if (!Array.isArray(column)) {
            // Typed array
            return Promise.resolve('number');
        }

        return Promise.resolve(DataProvider.assumeColumnDataType(
            column.slice(0, 30),
            columnId
        ));
    }

    /**
     * Returns the current data table. When `presentation` is `true`, returns
     * the presentation table (after modifiers).
     *
     * @param presentation
     * Whether to return the presentation table (after modifiers).
     *
     * @return
     * The data table.
     */
    public getDataTable(presentation: boolean = false): DataTable | undefined {
        return presentation ? this.presentationTable : this.dataTable;
    }

    /**
     * Sets the current presentation table.
     *
     * @param table
     * The table to use as current presentation table.
     */
    public setPresentationTable(table?: DataTable): void {
        this.presentationTable = table;
    }
}

interface ScopedRowsView {
    rowIds: RowId[];
    rowObjects: RowObjectType[];
    rowIdToIndex: Map<RowId, number>;
}

/**
 * Create fast lookup map for row IDs.
 *
 * @param rowIds
 * Row IDs to index.
 */
function createRowIdIndexMap(rowIds: RowId[]): Map<RowId, number> {
    const map = new Map<RowId, number>();
    for (let i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
        map.set(rowIds[i], i);
    }
    return map;
}

export interface LocalDataProviderOptions extends DataProviderOptions {
    providerType: 'local';
    dataTable: DataTable | DataTableOptions;
}

declare module './DataProviderType' {
    interface DataProviderTypeRegistry {
        local: typeof LocalDataProvider;
    }
}

DataProviderRegistry.registerDataProvider('local', LocalDataProvider);
