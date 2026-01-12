/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Dawid Dragula
 *  - Kamil Kubik
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { DataConnectorTypes } from './DataConnectorType';
import type {
    DataConnectorOptions,
    MetaColumn,
    Metadata
} from './DataConnectorOptions';
import type DataEvent from '../DataEvent';
import type DataConverterType from '../Converters/DataConverterType';

import DataConverter from '../Converters/DataConverter.js';
import DataModifier from '../Modifiers/DataModifier.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
import { DeepPartial } from '../../Shared/Types';
const {
    addEvent,
    fireEvent,
    merge,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Abstract class providing an interface for managing a DataConnector.
 */
abstract class DataConnector implements DataEvent.Emitter<DataConnector.Event> {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The DataConverter responsible for handling conversion of provided data to
     * a DataConnector.
     */
    public converter?: DataConverter;

    /**
     * Metadata to describe the connector and the content of columns.
     */
    public readonly metadata: Metadata;

    /**
     * Tables managed by this DataConnector instance.
     */
    public readonly dataTables: Record<string, DataTable> = {};

    /**
     * The options of the connector.
     */
    public readonly options: DataConnectorOptions;

    /**
     * ID of the polling timeout.
     */
    private _polling?: number;

    /**
     * Whether the connector is currently polling for new data.
     */
    public get polling(): boolean {
        return !!this._polling;
    }

    /**
     * The polling controller used to abort the request when data polling stops.
     * It gets assigned when data polling starts.
     */
    public pollingController?: AbortController;

    /**
     * Helper flag for detecting whether the data connector is loaded.
     * @internal
     */
    public loaded: boolean = false;

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructor for the connector class.
     *
     * @param {DataConnectorOptions} [options]
     * Options to use in the connector.
     */
    public constructor(options: DataConnectorOptions) {
        this.metadata = options.metadata || { columns: {} };
        this.options = options;

        // Create a data table for each defined in the dataTables user options.
        const dataTables = options?.dataTables;
        let dataTableIndex = 0;

        if (options.options) {
            // eslint-disable-next-line no-console
            console.error('The `DataConnectorOptions.options` property was removed in Dashboards v4.0.0. Check how to upgrade your connector to use the new options structure here: https://api.highcharts.com/dashboards/#interfaces/Data_DataTableOptions.DataTableOptions');
        }

        if (dataTables && dataTables?.length > 0) {
            for (let i = 0, iEnd = dataTables.length; i < iEnd; ++i) {
                const dataTable = dataTables[i];
                const key = dataTable?.key;
                this.dataTables[key ?? dataTableIndex] =
                    new DataTable(dataTable);

                if (!key) {
                    dataTableIndex++;
                }
            }
        } else {
            // If user options dataTables is not defined, generate a default
            // table.
            this.dataTables[0] = new DataTable({
                id: options.id // Required by DataTableCore
            });
        }
    }

    /* *
     *
     *  Methods
     *
     * */

    /**
     * Returns a single data table instance based on the provided key.
     * Otherwise, returns the first data table.
     *
     * @param {string} [key]
     * The data table key.
     *
     * @return {DataTable}
     * The data table instance.
     */
    public getTable(key?: string): DataTable {
        if (key) {
            return this.dataTables[key];
        }
        return Object.values(this.dataTables)[0];
    }

    /**
     * Method for adding metadata for a single column.
     *
     * @param {string} name
     * The name of the column to be described.
     *
     * @param {DataConnector.MetaColumn} columnMeta
     * The metadata to apply to the column.
     */
    public describeColumn(name: string, columnMeta: MetaColumn): void {
        const connector = this;
        const columns = connector.metadata.columns;

        columns[name] = merge(columns[name] || {}, columnMeta);
    }

    /**
     * Method for applying columns meta information to the whole DataConnector.
     *
     * @param {Highcharts.Dictionary<DataConnector.MetaColumn>} columns
     * Pairs of column names and MetaColumn objects.
     */
    public describeColumns(columns: Record<string, MetaColumn>): void {
        const connector = this;
        const columnIds = Object.keys(columns);

        let columnId: (string | undefined);

        while (typeof (columnId = columnIds.pop()) === 'string') {
            connector.describeColumn(columnId, columns[columnId]);
        }
    }

    /**
     * Returns the order of columns.
     *
     * @return {string[] | undefined}
     * Order of columns.
     */
    public getColumnOrder(): (string[] | undefined) {
        const connector = this,
            columns = connector.metadata.columns,
            names = Object.keys(columns || {});

        if (names.length) {
            return names.sort((a, b): number => (
                pick(columns[a].index, 0) - pick(columns[b].index, 0)
            ));
        }
    }

    /**
     * Retrieves the columns of the dataTable,
     * applies column order from meta.
     *
     * @return {Highcharts.DataTableColumnCollection}
     * An object with the properties `columnIds` and `columnValues`
     */
    public getSortedColumns(): DataTable.ColumnCollection {
        return this.getTable().getColumns(this.getColumnOrder());
    }

    /**
     * Sets the index and order of columns.
     *
     * @param {Array<string>} columnIds
     * Order of columns.
     */
    public setColumnOrder(columnIds: Array<string>): void {
        const connector = this;

        for (let i = 0, iEnd = columnIds.length; i < iEnd; ++i) {
            connector.describeColumn(columnIds[i], { index: i });
        }
    }

    /**
     * Updates the connector with new options.
     *
     * @param newOptions
     * The new options to be applied to the connector.
     *
     * @param reload
     * Whether to reload the connector after applying the new options.
     */
    public async update(
        newOptions: DeepPartial<typeof this.options>,
        reload: boolean = true
    ): Promise<void> {
        this.emit({ type: 'beforeUpdate' });
        merge(true, this.options, newOptions);
        const { options } = this;

        if ('enablePolling' in newOptions || 'dataRefreshRate' in newOptions) {
            if ('enablePolling' in options && options.enablePolling) {
                this.stopPolling();
                this.startPolling(
                    (
                        'dataRefreshRate' in options &&
                        typeof options.dataRefreshRate === 'number'
                    ) ? Math.max(options.dataRefreshRate, 1) * 1000 : 1000
                );
            } else {
                this.stopPolling();
            }
        }

        if (reload) {
            await this.load();
        }
        this.emit({ type: 'afterUpdate' });
    }

    /**
     * The default load method, which fires the `afterLoad` event
     *
     * @return {Promise<DataConnector>}
     * The loaded connector.
     *
     * @emits DataConnector#afterLoad
     */
    public load(): Promise<this> {
        this.emit({ type: 'afterLoad' });
        return Promise.resolve(this);
    }

    /**
     * Applies the data modifiers to the data tables according to the
     * connector data tables options.
     */
    public async applyTableModifiers(): Promise<this> {
        const tableOptionsArray = this.options?.dataTables;

        for (const [key, table] of Object.entries(this.dataTables)) {
            // Take data modifier options from the corresponsing data table
            // options, otherwise take the data modifier options from the
            // connector options.
            const dataModifierOptions = tableOptionsArray?.find(
                (dataTable): boolean => dataTable.key === key
            )?.dataModifier ?? this.options?.dataModifier;

            const ModifierClass = (
                dataModifierOptions &&
                DataModifier.types[dataModifierOptions.type]
            );

            await table.setModifier(
                ModifierClass ?
                    new ModifierClass(dataModifierOptions as AnyRecord) :
                    void 0
            );
        }

        return this;
    }

    /**
     * Starts polling new data after the specific time span in milliseconds.
     *
     * @param {number} refreshTime
     * Refresh time in milliseconds between polls.
     */
    public startPolling(
        refreshTime: number = 1000
    ): void {
        const connector = this;

        // Assign a new abort controller.
        this.pollingController = new AbortController();

        // Clear the polling timeout.
        window.clearTimeout(connector._polling);

        connector._polling = window.setTimeout(
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            (): Promise<void> => connector
                .load()['catch'](
                    (error): void => connector.emit({
                        type: 'loadError',
                        error
                    })
                )
                .then((): void => {
                    if (connector._polling) {
                        connector.startPolling(refreshTime);
                    }
                })
            , refreshTime
        );
    }

    /**
     * Stops polling data. Shouldn't be performed if polling is already stopped.
     */
    public stopPolling(): void {
        const connector = this;
        if (!connector.polling) {
            return;
        }

        // Abort the existing request.
        connector?.pollingController?.abort();

        // Clear the polling timeout.
        window.clearTimeout(connector._polling);
        delete connector._polling;
    }

    /**
     * Emits an event on the connector to all registered callbacks of this
     * event.
     *
     * @param {DataConnector.Event} e
     * Event object containing additional event information.
     */
    public emit(e: DataConnector.Event): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Registers a callback for a specific connector event.
     *
     * @param type
     * Event type.
     *
     * @param callback
     * Function to register for the connector callback.
     *
     * @return {Function}
     * Function to unregister callback from the connector event.
     */
    public on<T extends DataConnector.Event['type']>(
        type: T,
        callback: DataEvent.Callback<this, Extract<DataConnector.Event, {
            type: T
        }>>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Iterates over the dataTables and initiates the corresponding converters.
     * Updates the dataTables and assigns the first converter.
     *
     * @param {T}[data]
     * Data specific to the corresponding converter.
     *
     * @param {DataConnector.CreateConverterFunction}[createConverter]
     * Creates a specific converter combining the dataTable options.
     *
     * @param {DataConnector.ParseDataFunction<T>}[parseData]
     * Runs the converter parse method with the specific data type.
     */
    public initConverters<T>(
        data: T,
        createConverter: DataConnector.CreateConverterFunction,
        parseData: DataConnector.ParseDataFunction<T>
    ): void {
        let index = 0;
        for (const [key, table] of Object.entries(this.dataTables)) {
            // Create a proper converter and parse its data.
            const converter = createConverter(key);
            const columns = parseData(converter, data);

            // Update the dataTable.
            table.deleteColumns();
            table.setColumns(columns);

            // Assign the first converter.
            if (index === 0) {
                this.converter = converter;
            }
            index++;
        }
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace DataConnector {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * The event type that is provided on events within DataConnector.
     */
    export interface Event extends DataEvent {
        readonly type: (
            'loadError' | 'load' | 'afterLoad' | 'beforeUpdate' | 'afterUpdate'
        );
        readonly error?: string | Error;
    }

    /**
     * Creates a specific converter combining the dataTable options.
     */
    export interface CreateConverterFunction {
        (key: string): DataConverterType
    }

    /**
     * Runs the converter parse method with the specific data type.
     */
    export interface ParseDataFunction<T> {
        (converter: DataConverterType, data: T): DataTable.ColumnCollection
    }

    /* *
     *
     *  Constants
     *
     * */

    /**
     * Registry as a record object with connector names and their class.
     */
    export const types = {} as DataConnectorTypes;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Adds a connector class to the registry. The connector has to provide the
     * `DataConnector.options` property and the `DataConnector.load` method to
     * modify the table.
     *
     * @private
     *
     * @param {string} key
     * Registry key of the connector class.
     *
     * @param {DataConnectorType} DataConnectorClass
     * Connector class (aka class constructor) to register.
     *
     * @return {boolean}
     * Returns true, if the registration was successful. False is returned, if
     * their is already a connector registered with this key.
     */
    export function registerType<T extends keyof DataConnectorTypes>(
        key: T,
        DataConnectorClass: DataConnectorTypes[T]
    ): boolean {
        return (
            !!key &&
            !types[key] &&
            !!(types[key] = DataConnectorClass)
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DataConnector;
