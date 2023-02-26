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
import type StoreType from './StoreType';

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
 * Abstract class providing an interface for managing a DataStore.
 *
 * @private
 */
abstract class DataStore implements DataEvent.Emitter {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Registry as a record object with store names and their class.
     */
    private static readonly registry = {} as Record<string, StoreType>;

    /**
     * Regular expression to extract the store type (group 1) from the
     * stringified class constructor.
     */
    private static readonly typeRegExp = (
        /^function\s+(\w*?)(?:DataStore)?\s*\(/u
    );

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Adds a store class to the registry. The store has to provide the
     * `DataStore.options` property and the `DataStore.load` method to
     * modify the table.
     *
     * @param {DataStore} dataStore
     * Store class (aka class constructor) to register.
     *
     * @return {boolean}
     * Returns true, if the registration was successful. False is returned, if
     * their is already a store registered with this class name.
     */
    public static addStore(dataStore: StoreType): boolean {
        const type = DataStore.getType(dataStore),
            registry = DataStore.registry;

        if (
            typeof type === 'undefined' ||
            registry[type]
        ) {
            return false;
        }

        registry[type] = dataStore;

        return true;
    }

    /**
     * Returns all registered DataStore types.
     *
     * @return {Array<string>}
     * All registered store types.
     */
    public static getAllStoreTypes(): Array<string> {
        return Object.keys(DataStore.registry);
    }

    /**
     * Returns a copy of the dataStore registry as record object with
     * DataStore type and their class.
     *
     * @return {Highcharts.Dictionary<DataStoreRegistryType>}
     * Copy of the dataStore registry.
     */
    public static getAllStores(): Record<string, StoreType> {
        return merge(DataStore.registry);
    }

    /**
     * Extracts the type from a given DataStore class.
     *
     * @param {DataStore} dataStore
     * DataStore class to extract the type from.
     *
     * @return {string}
     * DataStore type, if the extraction was successful, otherwise an empty
     * string.
     */
    private static getType(dataStore: (NewableFunction|StoreType)): string {
        return (
            dataStore.toString().match(DataStore.typeRegExp) ||
            ['', '']
        )[1];
    }

    /**
     * Returns a dataStore class (aka class constructor) of the given dataStore
     * name.
     *
     * @param {string} type
     * Registered class type.
     *
     * @return {DataStoreRegistryType|undefined}
     * Class, if the class name was found, otherwise `undefined`.
     */
    public static getStore(type: string): (StoreType|undefined) {
        return DataStore.registry[type];
    }

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructor for the store class.
     *
     * @param {DataTable} table
     * Optional table to use in the store.
     *
     * @param {DataStore.Metadata} metadata
     * Optional metadata to use in the store.
     */
    public constructor(
        table: DataTable = new DataTable(),
        metadata: DataStore.Metadata = { columns: {} }
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
     * a DataStore.
     */
    public abstract readonly converter: DataConverter;

    /**
     * Metadata to describe the store and the content of columns.
     */
    public metadata: DataStore.Metadata;

    /**
     * Poll timer ID, if active.
     */
    public polling?: number;

    /**
     * Table managed by this DataStore instance.
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
     * @param {DataStore.MetaColumn} columnMeta
     * The metadata to apply to the column.
     */
    public describeColumn(
        name: string,
        columnMeta: DataStore.MetaColumn
    ): void {
        const store = this,
            columns = store.metadata.columns;

        columns[name] = merge(columns[name] || {}, columnMeta);
    }

    /**
     * Method for applying columns meta information to the whole datastore.
     *
     * @param {Highcharts.Dictionary<DataStore.MetaColumn>} columns
     * Pairs of column names and MetaColumn objects.
     */
    public describeColumns(
        columns: Record<string, DataStore.MetaColumn>
    ): void {
        const store = this,
            columnNames = Object.keys(columns);

        let columnName: (string|undefined);

        while (typeof (columnName = columnNames.pop()) === 'string') {
            store.describeColumn(columnName, columns[columnName]);
        }
    }

    /**
     * Emits an event on the store to all registered callbacks of this event.
     *
     * @param {DataStore.Event} [e]
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
        const store = this,
            columns = store.metadata.columns,
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
     * @return {Promise<DataStore>}
     * The loaded store.
     *
     * @emits DataStore#afterLoad
     */
    public load(): Promise<this> {
        fireEvent(this, 'afterLoad', { table: this.table });
        return Promise.resolve(this);
    }

    /**
     * Registers a callback for a specific store event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.Callback} callback
     * Function to register for the store callback.
     *
     * @return {Function}
     * Function to unregister callback from the store event.
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
     * @return {Promise<DataStore>}
     * The saved store.
     *
     * @emits DataStore#afterSave
     * @emits DataStore#saveError
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
        const store = this;

        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            store.describeColumn(columnNames[i], { index: i });
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
        const store = this;

        window.clearTimeout(store.polling);

        store.polling = window.setTimeout((): Promise<void> => store
            .load()['catch'](
                (error): void => store.emit<DataStore.ErrorEvent>({
                    type: 'loadError',
                    error,
                    table: store.table
                })
            )
            .then((): void => {
                if (store.polling) {
                    store.startPolling(refreshTime);
                }
            })
        , refreshTime);
    }

    /**
     * Stops polling data.
     */
    public stopPolling(): void {
        const store = this;

        window.clearTimeout(store.polling);

        delete store.polling;
    }

    /**
     * Retrieves metadata from a single column.
     *
     * @param {string} name
     * The identifier for the column that should be described
     *
     * @return {DataStore.MetaColumn|undefined}
     * Returns a MetaColumn object if found.
     */
    public whatIs(name: string): (DataStore.MetaColumn | undefined) {
        return this.metadata.columns[name];
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace DataStore {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * The event object that is provided on errors within DataStore
     */
    export interface ErrorEvent extends Event {
        type: ('loadError');
        error: (string|Error);
    }

    /**
     * The default event object for a datastore
     */
    export interface Event extends DataEvent {
        readonly table: DataTable;
    }

    /**
     * The event object that is provided on load events within DataStore
     */
    export interface LoadEvent extends Event {
        type: ('load'|'afterLoad');
    }

    /**
     * Metadata entry containing the name of the column
     * and a metadata object
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

declare module './StoreType' {
    interface StoreTypeRegistry {
        // '': typeof DataStore;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default DataStore;
