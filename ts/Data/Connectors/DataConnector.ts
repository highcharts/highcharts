/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../DataEvent';
import type JSON from '../../Core/JSON';
import type ConnectorType from './ConnectorType';

import DataConverter from '../Converters/DataConverter.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
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
 *
 * @private
 */
abstract class DataConnector implements DataEvent.Emitter {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Registry as a record object with connector names and their class.
     */
    private static readonly registry = {} as Record<string, ConnectorType>;

    /**
     * Regular expression to extract the connector type (group 1) from the
     * stringified class constructor.
     */
    private static readonly typeRegExp = (
        /^function\s+(\w*?)(?:DataConnector)?\s*\(/
    );

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Adds a connector class to the registry. The connector has to provide the
     * `DataConnector.options` property and the `DataConnector.load` method to
     * modify the table.
     *
     * @param {DataConnector} dataConnector
     * Connector class (aka class constructor) to register.
     *
     * @return {boolean}
     * Returns true, if the registration was successful. False is returned, if
     * their is already a connector registered with this class name.
     */
    public static addConnector(dataConnector: ConnectorType): boolean {
        const type = DataConnector.getType(dataConnector),
            registry = DataConnector.registry;

        if (
            typeof type === 'undefined' ||
            registry[type]
        ) {
            return false;
        }

        registry[type] = dataConnector;

        return true;
    }

    /**
     * Returns all registered DataConnector types.
     *
     * @return {Array<string>}
     * All registered connector types.
     */
    public static getAllConnectorTypes(): Array<string> {
        return Object.keys(DataConnector.registry);
    }

    /**
     * Returns a copy of the dataConnector registry as record object with
     * DataConnector type and their class.
     *
     * @return {Highcharts.Dictionary<DataConnectorRegistryType>}
     * Copy of the dataConnector registry.
     */
    public static getAllConnectors(): Record<string, ConnectorType> {
        return merge(DataConnector.registry);
    }

    /**
     * Extracts the type from a given DataConnector class.
     *
     * @param {DataConnector} connector
     * DataConnector class to extract the type from.
     *
     * @return {string}
     * DataConnector type, if the extraction was successful, otherwise an empty
     * string.
     */
    private static getType(
        connector: (NewableFunction|ConnectorType)
    ): string {
        return (
            connector.toString().match(DataConnector.typeRegExp) ||
            ['', '']
        )[1];
    }

    /**
     * Returns a DataConnector class (aka class constructor) of the given name.
     *
     * @param {string} type
     * Registered class type.
     *
     * @return {DataConnectorRegistryType|undefined}
     * Class, if the class name was found, otherwise `undefined`.
     */
    public static getConnector(type: string): (ConnectorType|undefined) {
        return DataConnector.registry[type];
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructor for the connector class.
     *
     * @param {DataTable} table
     * Optional table to use in the connector.
     *
     * @param {DataConnector.Metadata} metadata
     * Optional metadata to use in the connector.
     */
    public constructor(
        table: DataTable = new DataTable(),
        metadata: DataConnector.Metadata = { columns: {} }
    ) {
        this.table = table;
        this.metadata = metadata;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * The DataConverter responsible for handling conversion of provided data to
     * a DataConnector.
     */
    public abstract readonly converter: DataConverter;

    /**
     * Metadata to describe the connector and the content of columns.
     */
    public metadata: DataConnector.Metadata;

    /**
     * Poll timer ID, if active.
     */
    public polling?: number;

    /**
     * Table managed by this DataConnector instance.
     */
    public table: DataTable;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Method for adding metadata for a single column.
     *
     * @param {string} name
     * The name of the column to be described.
     *
     * @param {DataConnector.MetaColumn} columnMeta
     * The metadata to apply to the column.
     */
    public describeColumn(
        name: string,
        columnMeta: DataConnector.MetaColumn
    ): void {
        const connector = this,
            columns = connector.metadata.columns;

        columns[name] = merge(columns[name] || {}, columnMeta);
    }

    /**
     * Method for applying columns meta information to the whole DataConnector.
     *
     * @param {Highcharts.Dictionary<DataConnector.MetaColumn>} columns
     * Pairs of column names and MetaColumn objects.
     */
    public describeColumns(
        columns: Record<string, DataConnector.MetaColumn>
    ): void {
        const connector = this,
            columnNames = Object.keys(columns);

        let columnName: (string|undefined);

        while (typeof (columnName = columnNames.pop()) === 'string') {
            connector.describeColumn(columnName, columns[columnName]);
        }
    }

    /**
     * Emits an event on the connector to all registered callbacks of this
     * event.
     *
     * @param {DataConnector.Event} [e]
     * Event object containing additional event information.
     */
    public emit<E extends DataEvent>(e: E): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Returns the order of columns.
     *
     * @param {boolean} [usePresentationState]
     * Whether to use the column order of the presentation state of the table.
     *
     * @return {Array<string>|undefined}
     * Order of columns.
     */
    public getColumnOrder(
        usePresentationState?: boolean
    ): (Array<string>|undefined) {
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
     * Retrieves the columns of the the dataTable,
     * applies column order from meta.
     *
     * @param {boolean} [usePresentationOrder]
     * Whether to use the column order of the presentation state of the table.
     *
     * @return {Highcharts.DataTableColumnCollection}
     * An object with the properties `columnNames` and `columnValues`
     */
    public getSortedColumns(
        usePresentationOrder?: boolean
    ): DataTable.ColumnCollection {
        return this.table.getColumns(
            this.getColumnOrder(usePresentationOrder)
        );
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
        fireEvent(this, 'afterLoad', { table: this.table });
        return Promise.resolve(this);
    }

    /**
     * Registers a callback for a specific connector event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.Callback} callback
     * Function to register for the connector callback.
     *
     * @return {Function}
     * Function to unregister callback from the connector event.
     */
    public on<E extends DataEvent>(
        type: E['type'],
        callback: DataEvent.Callback<this, E>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * The default save method, which fires the `afterSave` event.
     *
     * @return {Promise<DataConnector>}
     * The saved connector.
     *
     * @emits DataConnector#afterSave
     * @emits DataConnector#saveError
     */
    public save(): Promise<this> {
        fireEvent(this, 'saveError', { table: this.table });
        return Promise.reject(new Error('Not implemented'));
    }

    /**
     * Sets the index and order of columns.
     *
     * @param {Array<string>} columnNames
     * Order of columns.
     */
    public setColumnOrder(columnNames: Array<string>): void {
        const connector = this;

        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            connector.describeColumn(columnNames[i], { index: i });
        }
    }

    /**
     * Starts polling new data after the specific timespan in milliseconds.
     *
     * @param {number} refreshTime
     * Refresh time in milliseconds between polls.
     */
    public startPolling(
        refreshTime: number = 1000
    ): void {
        const connector = this;

        window.clearTimeout(connector.polling);

        connector.polling = window.setTimeout((): Promise<void> => connector
            .load()['catch'](
                (error): void => connector.emit<DataConnector.ErrorEvent>({
                    type: 'loadError',
                    error,
                    table: connector.table
                })
            )
            .then((): void => {
                if (connector.polling) {
                    connector.startPolling(refreshTime);
                }
            })
        , refreshTime);
    }

    /**
     * Stops polling data.
     */
    public stopPolling(): void {
        const connector = this;

        window.clearTimeout(connector.polling);

        delete connector.polling;
    }

    /**
     * Retrieves metadata from a single column.
     *
     * @param {string} name
     * The identifier for the column that should be described
     *
     * @return {DataConnector.MetaColumn|undefined}
     * Returns a MetaColumn object if found.
     */
    public whatIs(name: string): (DataConnector.MetaColumn | undefined) {
        return this.metadata.columns[name];
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
     * The event object that is provided on errors within DataConnector.
     */
    export interface ErrorEvent extends Event {
        type: ('loadError');
        error: (string|Error);
    }

    /**
     * The default event object for a DataConnector.
     */
    export interface Event extends DataEvent {
        readonly table: DataTable;
    }

    /**
     * The event object that is provided on load events within DataConnector.
     */
    export interface LoadEvent extends Event {
        type: ('load'|'afterLoad');
    }

    /**
     * Metadata entry containing the name of the column and a metadata object.
     */
    export interface MetaColumn extends JSON.Object {
        dataType?: string;
        // validator: Function;
        defaultValue?: JSON.Primitive;
        index?: number;
        title?: string;
    }

    /**
     * Metadata
     */
    export interface Metadata extends JSON.Object {
        columns: Record<string, MetaColumn>;
    }

}

/* *
 *
 *  Registry
 *
 * */

declare module './ConnectorType' {
    interface ConnectorTypeRegistry {
        // '': typeof DataConnector;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default DataConnector;
