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
import type DataTableOptions from '../../../Data/DataTableOptions';
import type { ColumnDataType } from '../Table/Column';
import type {
    RowObject as RowObjectType,
    CellType as DataTableCellType
} from '../../../Data/DataTable';
import type { DataEvent } from '../../../Data/DataEvent';
import type DataConnectorType from '../../../Data/Connectors/DataConnectorType';
import type {
    DataConnectorTypeOptions
} from '../../../Data/Connectors/DataConnectorType';

import { DataProvider } from './DataProvider.js';
import DataTable from '../../../Data/DataTable.js';
import ChainModifier from '../../../Data/Modifiers/ChainModifier.js';
import DataConnector from '../../../Data/Connectors/DataConnector.js';
import DataProviderRegistry from './DataProviderRegistry.js';
import U from '../../../Core/Utilities.js';

const {
    uniqueKey
} = U;


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

    public static readonly tableChangeEventNames = [
        'afterDeleteColumns',
        'afterDeleteRows',
        'afterSetCell',
        'afterSetColumns',
        'afterSetRows'
    ] as const;

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
     * The connector instance used to populate the table.
     */
    private connector?: DataConnectorType;

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

    /**
     * Unbind callbacks for connector events.
     */
    private connectorEventDestructors: Function[] = [];


    /* *
     *
     *  Methods
     *
     * */

    public override async init(): Promise<void> {
        if (this.dataTable) {
            return;
        }

        await this.initDataTable();
    }

    private async initDataTable(): Promise<void> {
        this.querying.shouldBeUpdated = true;
        this.clearDataTableEvents();
        this.clearConnector();

        if (this.options.connector) {
            await this.initConnector(this.options.connector);
            return;
        }

        const tableOptions = this.options.dataTable;

        // If the table is passed as a reference, it should be used instead of
        // creating a new one.
        const dataTable = tableOptions && 'clone' in tableOptions ?
            tableOptions : new DataTable(tableOptions || {});

        this.setDataTable(dataTable);
    }

    private setDataTable(table: DataTable): void {
        this.dataTable = table;
        this.presentationTable = table.getModified();
        this.prePaginationRowCount = this.presentationTable?.rowCount ?? 0;

        for (const eventName of LocalDataProvider.tableChangeEventNames) {
            const fn = table.on(eventName, (e: DataEvent): void => {
                void this.handleTableChange(e);
            });
            this.dataTableEventDestructors.push(fn);
        }
    }

    private async handleTableChange(e: DataEvent): Promise<void> {
        this.querying.shouldBeUpdated = true;

        const grid = this.querying.grid;
        if (!grid?.viewport) {
            return;
        }

        if (e.type === 'afterSetCell' && e.detail?.fromGrid) {
            return;
        }

        if (this.options.updateOnChange) {
            await grid.viewport.updateRows();
        }

        // TODO: Handle this when Polling emits proper events.
        // grid.dirtyFlags.add((
        //     eventName === 'afterDeleteColumns' ||
        //     eventName === 'afterSetColumns'
        // ) ? 'grid' : 'rows');

        // await grid.redraw();
    }

    private clearDataTableEvents(): void {
        this.dataTableEventDestructors.forEach((fn): void => fn());
        this.dataTableEventDestructors.length = 0;
    }

    private clearConnector(): void {
        this.connectorEventDestructors.forEach((fn): void => fn());
        this.connectorEventDestructors.length = 0;
        this.connector?.stopPolling();
        this.connector = void 0;
    }

    private async initConnector(
        connectorInput: GridDataConnectorTypeOptions | DataConnectorType
    ): Promise<void> {
        let connector: DataConnectorType;

        if (LocalDataProvider.isConnectorInstance(connectorInput)) {
            connector = connectorInput;
        } else {
            const ConnectorClass =
                DataConnector.types[connectorInput.type] as
                Class<DataConnectorType> | undefined;

            if (!ConnectorClass) {
                throw new Error(
                    `Connector type not found. (${connectorInput.type})`
                );
            }

            if (!connectorInput.id) {
                connectorInput.id = 'connector-' + uniqueKey();
            }

            connector = new ConnectorClass(connectorInput);
        }

        this.connector = connector;

        this.connectorEventDestructors.push(
            connector.on('afterLoad', (): void => {
                this.querying.shouldBeUpdated = true;
            })
        );

        this.setDataTable(connector.getTable());

        if (
            'enablePolling' in connector.options &&
            connector.options.enablePolling &&
            !connector.polling &&
            'dataRefreshRate' in connector.options
        ) {
            connector.startPolling(
                Math.max(connector.options.dataRefreshRate || 0, 1) * 1000
            );
        }

        if (!connector.loaded) {
            try {
                await connector.load();
            } catch {
                return;
            }
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
        this.dataTable?.setCell(columnId, rowId, value, { fromGrid: true });
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
        this.clearDataTableEvents();
        this.clearConnector();
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
     * Checks if the object is an instance of DataConnector.
     *
     * @param connector
     * The object to check.
     *
     * @returns `true` if the object is an instance of DataConnector, `false`
     * otherwise.
     */
    private static isConnectorInstance(
        connector: GridDataConnectorTypeOptions | DataConnectorType
    ): connector is DataConnectorType {
        return 'getTable' in connector;
    }
}

export type GridDataConnectorTypeOptions =
    Omit<DataConnectorTypeOptions, 'id'> & { id?: string };

export interface LocalDataProviderOptions extends DataProviderOptions {
    providerType?: 'local';

    /**
     * The data table used by the provider.
     */
    dataTable?: DataTable | DataTableOptions;

    /**
     * Connector instance or options used to populate the data table.
     */
    connector?: GridDataConnectorTypeOptions | DataConnectorType;

    /**
     * Automatically update the grid when the data table changes. It is disabled
     * by default unles the pagination is enabled.
     *
     * Use this option if you want the polling to update the grid when the data
     * table changes.
     *
     * @default false
     */
    updateOnChange?: boolean;
}

declare module './DataProviderType' {
    interface DataProviderTypeRegistry {
        local: typeof LocalDataProvider;
    }
}

DataProviderRegistry.registerDataProvider('local', LocalDataProvider);
