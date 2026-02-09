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

import type { DataProviderOptions, RowId } from './DataProvider';
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
        return Promise.resolve(
            this.presentationTable?.getOriginalRowIndex(rowIndex)
        );
    }

    public override getRowIndex(rowId: RowId): Promise<number | undefined> {
        if (typeof rowId !== 'number') {
            return Promise.resolve(void 0);
        }
        return Promise.resolve(
            this.presentationTable?.getLocalRowIndex(rowId)
        );
    }

    public override getRowObject(
        rowIndex: number
    ): Promise<RowObjectType | undefined> {
        return Promise.resolve(this.presentationTable?.getRowObject(rowIndex));
    }

    public override getPrePaginationRowCount(): Promise<number> {
        return Promise.resolve(this.prePaginationRowCount ?? 0);
    }

    public override getRowCount(): Promise<number> {
        return Promise.resolve(this.presentationTable?.getRowCount() ?? 0);
    }

    public override getValue(
        columnId: string,
        rowIndex: number
    ): Promise<DataTableCellType> {
        return Promise.resolve(
            this.presentationTable?.getCell(columnId, rowIndex)
        );
    }

    public override async setValue(
        value: DataTableCellType,
        columnId: string,
        rowId: RowId
    ): Promise<void> {
        if (typeof rowId !== 'number') {
            throw new Error('LocalDataProvider supports only numeric row ids.');
        }
        this.dataTable?.setCell(columnId, rowId, value);
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

        const groupedModifiers = controller.getGroupedModifiers();
        let interTable: DataTable;

        // Grouped modifiers
        if (groupedModifiers.length > 0) {
            const chainModifier = new ChainModifier({}, ...groupedModifiers);
            const dataTableCopy = originalDataTable.clone();
            await chainModifier.modify(dataTableCopy.getModified());
            interTable = dataTableCopy.getModified();
        } else {
            interTable = originalDataTable.getModified();
        }

        this.prePaginationRowCount = interTable.rowCount;

        // Pagination modifier
        const paginationModifier =
            controller.pagination.createModifier(interTable.rowCount);
        if (paginationModifier) {
            interTable = interTable.clone();
            await paginationModifier.modify(interTable);
            interTable = interTable.getModified();
        }

        this.presentationTable = interTable;
    }

    public override destroy(): void {
        this.dataTableEventDestructors.forEach((fn): void => fn());
        this.dataTableEventDestructors.length = 0;
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
