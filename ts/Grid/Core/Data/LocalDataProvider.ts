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

import type { DataProviderOptions } from './DataProvider';
import type QueryingController from '../Querying/QueryingController';
import type DataTableOptions from '../../../Data/DataTableOptions';

import { DataProvider } from './DataProvider.js';
import DataTable from '../../../Data/DataTable.js';
import ChainModifier from '../../../Data/Modifiers/ChainModifier.js';
import { registerDataProvider } from './DataProviderRegistry';


export class LocalDataProvider extends DataProvider {

    public readonly options!: LocalDataProviderOptions;
    private dataTable?: DataTable;
    private presentationTable?: DataTable;
    private prePaginationRowCount?: number;
    private dataTableEventDestructors: Function[] = [];

    constructor(
        queryingController: QueryingController,
        options: LocalDataProviderOptions
    ) {
        super(queryingController, options);
        this.initDataTable();
    }

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

    public override getRowId(rowIndex: number): Promise<number | undefined> {
        return Promise.resolve(
            this.presentationTable?.getOriginalRowIndex(rowIndex)
        );
    }

    public override getRowIndex(rowId: number): Promise<number | undefined> {
        return Promise.resolve(
            this.presentationTable?.getLocalRowIndex(rowId)
        );
    }

    public override getRowObject(
        rowIndex: number
    ): Promise<DataTable.RowObject | undefined> {
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
    ): Promise<DataTable.CellType> {
        // Debugging:
        // return new Promise((resolve): void => {
        //     setTimeout((): void => {
        //         resolve(
        //             this.presentationTable?.getCell(columnId, rowIndex)
        //         );
        //     }, Math.random() * 1000);
        // });

        return Promise.resolve(
            this.presentationTable?.getCell(columnId, rowIndex)
        );
    }

    public override setValue(
        value: DataTable.CellType,
        columnId: string,
        rowId: number
    ): Promise<void> {
        // TODO: Implement setValue
        // eslint-disable-next-line no-console
        this.dataTable?.setCell(columnId, rowId, value);
        return Promise.resolve();
    }

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

    public getDataTable(presentation: boolean = false): DataTable | undefined {
        return presentation ? this.presentationTable : this.dataTable;
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

registerDataProvider('local', LocalDataProvider);
