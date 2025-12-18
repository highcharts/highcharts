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
import Grid from '../Grid';


export class LocalDataProvider extends DataProvider {

    protected readonly options!: LocalDataProviderOptions;
    private dataTable?: DataTable;
    private presentationTable?: DataTable;
    private rowCount?: number;
    private dataTableEventDestructors: Function[] = [];

    constructor(
        queryingController: QueryingController,
        options: LocalDataProviderOptions,
        grid?: Grid // Backward compatibility, remove in the future
    ) {
        super(queryingController, options, grid);

        // Backward compatibility snippet, remove in the future
        if (grid?.options?.dataTable && !options.dataTable) {
            options.dataTable = grid.options.dataTable;
        }
        // End of backward compatibility snippet

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

    public override getRowCount(): Promise<number> {
        return Promise.resolve(this.rowCount ?? 0);
    }

    public override getRenderedRowCount(): Promise<number> {
        return Promise.resolve(this.presentationTable?.getRowCount() ?? 0);
    }

    public override getValue(
        columnId: string,
        rowIndex: number
    ): Promise<DataTable.CellType> {
        return Promise.resolve(
            this.presentationTable?.getCell(columnId, rowIndex) ?? null
        );
    }

    public override setValue(
        value: DataTable.CellType,
        columnId: string,
        rowIndex: number
    ): Promise<void> {
        // TODO: Implement setValue
        // eslint-disable-next-line no-console
        console.log('setValue', value, columnId, rowIndex);
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

        this.rowCount = interTable.rowCount;

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

        // TODO: Implement destroy
    }
}

export interface LocalDataProviderOptions extends DataProviderOptions {
    type: 'local';
    dataTable: DataTable | DataTableOptions;
}

declare module './DataProviderType' {
    interface DataProviderTypeRegistry {
        local: typeof LocalDataProvider;
    }
}

registerDataProvider('local', LocalDataProvider);
