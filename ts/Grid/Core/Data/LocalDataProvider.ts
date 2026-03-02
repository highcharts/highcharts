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
import type { MakeOptional } from '../../../Shared/Types';

import { DataProvider } from './DataProvider.js';
import DataTable from '../../../Data/DataTable.js';
import ChainModifier from '../../../Data/Modifiers/ChainModifier.js';
import DataConnector from '../../../Data/Connectors/DataConnector.js';
import DataProviderRegistry from './DataProviderRegistry.js';
import U from '../../../Core/Utilities.js';

const {
    defined,
    isNumber,
    isString,
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

    /**
     * Map of row IDs (from `idColumn`) to original data table row indexes.
     * Set only when `options.idColumn` is configured.
     */
    private originalRowIndexesMap?: Map<RowId, number>;


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

        const idColId = this.options.idColumn;
        if (idColId) {
            const idColumn = table.getColumn(idColId, true);
            if (!idColumn) {
                throw new Error(`Column "${idColId}" not found in table.`);
            }

            const map = new Map<RowId, number>();
            for (let i = 0, len = idColumn.length; i < len; ++i) {
                const value = idColumn[i];
                if (!isString(value) && !isNumber(value)) {
                    throw new Error(
                        'idColumn must contain only string or number values.'
                    );
                }
                map.set(value, i);
            }
            if (map.size !== idColumn.length) {
                throw new Error('idColumn must contain unique values.');
            }
            this.originalRowIndexesMap = map;
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

    /**
     * Returns the row ID for a given local row index. If not found, returns
     * `undefined`.
     *
     * If the `data.idColumn` option is set, the row ID is the value of the
     * row in the column with the given ID. Otherwise, the row ID is the
     * original row index.
     *
     * @param rowIndex
     * The local (presentation table) row index to get the row ID for.
     */
    public override async getRowId(rowIndex: number): Promise<RowId | undefined> {
        const originalRowIndex =
            await this.getOriginalRowIndexFromLocal(rowIndex);
        if (!defined(originalRowIndex) || !this.dataTable) {
            return Promise.resolve(void 0);
        }

        const idColId = this.options.idColumn;
        if (!idColId) {
            return Promise.resolve(originalRowIndex);
        }

        const rawId = this.dataTable.getCell(idColId, originalRowIndex);
        if (isString(rawId) || isNumber(rawId)) {
            return Promise.resolve(rawId);
        }
    }

    /**
     * Returns the local (presentation table) row index for a given row ID. If
     * not found, returns `undefined`.
     *
     * @param rowId
     * The row ID to get the row index for. If the `data.idColumn` option is
     * set, the row ID is the value of the row in the column with the given ID.
     * Otherwise, the row ID is the original row index.
     */
    public override getRowIndex(rowId: RowId): Promise<number | undefined> {
        if (!this.originalRowIndexesMap && isNumber(rowId)) {
            return this.getLocalRowIndexFromOriginal(rowId);
        }

        const originalRowIndex = this.originalRowIndexesMap?.get(rowId);
        if (!defined(originalRowIndex)) {
            return Promise.resolve(void 0);
        }
        return this.getLocalRowIndexFromOriginal(originalRowIndex);
    }

    /**
     * Returns the original row index for a given local row index.
     *
     * @param localRowIndex
     * The local row index to get the original row index for.
     */
    public getOriginalRowIndexFromLocal(
        localRowIndex: number
    ): Promise<number | undefined> {
        return Promise.resolve(
            this.presentationTable?.getOriginalRowIndex(localRowIndex)
        );
    }

    /**
     * Returns the local (presentation table) row index for a given original
     * data table row index.
     *
     * @param originalRowIndex
     * The original data table row index to get the presentation table row index
     * for.
     */
    public getLocalRowIndexFromOriginal(
        originalRowIndex: number
    ): Promise<number | undefined> {
        return Promise.resolve(
            this.presentationTable?.getLocalRowIndex(originalRowIndex)
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
        const localRowIndex = await this.getRowIndex(rowId);
        if (!defined(localRowIndex)) {
            // eslint-disable-next-line no-console
            console.error('[setValue] Wrong row ID:', rowId);
            return;
        }
        const rowIndex = await this.getOriginalRowIndexFromLocal(localRowIndex);
        if (!defined(rowIndex)) {
            // eslint-disable-next-line no-console
            console.error('[setValue] Wrong local row index:', localRowIndex);
            return;
        }

        this.dataTable?.setCell(columnId, rowIndex, value, { fromGrid: true });
        return;
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
    MakeOptional<DataConnectorTypeOptions, 'id'>;

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

    /**
     * The column ID that contains the stable, unique row IDs. If not
     * provided, the original row index is used as the row ID.
     */
    idColumn?: string;
}

declare module './DataProviderType' {
    interface DataProviderTypeRegistry {
        local: typeof LocalDataProvider;
    }
}

DataProviderRegistry.registerDataProvider('local', LocalDataProvider);
