/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';
import type DataJSON from '../DataJSON';
import type StoreType from './StoreType';

import DataParser from '../Parsers/DataParser.js';
import DataTableRow from '../DataTableRow.js';
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
 * Abstract class providing an interface for managing a DataStore
 */
abstract class DataStore<TEventObject extends DataStore.EventObject>
implements DataEventEmitter<TEventObject>, DataJSON.Class {
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
     * Regular expression to extract the store name (group 1) from the
     * stringified class type.
     */
    private static readonly nameRegExp = /^function\s+(\w*?)(?:DataStore)?\s*\(/;

    /* *
     *
     *  Static Functions
     *
     * */


    /**
     * Adds a dataStore class to the registry. The store has to provide the
     * `DataStore.options` property and the `DataStore.load` method to
     * modify the DataTable.
     *
     * @param {DataStore} dataStore
     * Store class (aka class constructor) to register.
     *
     * @return {boolean}
     * Returns true, if the registration was successful. False is returned, if
     * their is already a store registered with this name.
     */
    public static addStore(dataStore: StoreType): boolean {
        const name = DataStore.getName(dataStore),
            registry = DataStore.registry;

        if (
            typeof name === 'undefined' ||
            registry[name]
        ) {
            return false;
        }

        registry[name] = dataStore;

        return true;
    }

    /**
     * Returns all registered dataStore names.
     *
     * @return {Array<string>}
     * All registered store names.
     */
    public static getAllStoreNames(): Array<string> {
        return Object.keys(DataStore.registry);
    }

    /**
     * Returns a copy of the dataStore registry as record object with
     * dataStore names and their dataStore class.
     *
     * @return {Record<string,DataStoreRegistryType>}
     * Copy of the dataStore registry.
     */
    public static getAllStores(): Record<string, StoreType> {
        return merge(DataStore.registry);
    }

    /**
     * Extracts the name from a given dataStore class.
     *
     * @param {DataStore} dataStore
     * DataStore class to extract the name from.
     *
     * @return {string}
     * DataStore name, if the extraction was successful, otherwise an empty
     * string.
     */
    private static getName(dataStore: (NewableFunction|StoreType)): string {
        return (
            dataStore.toString().match(DataStore.nameRegExp) ||
            ['', '']
        )[1];
    }

    /**
     * Returns a dataStore class (aka class constructor) of the given dataStore
     * name.
     *
     * @param {string} name
     * Registered class name of the class type.
     *
     * @return {DataStoreRegistryType|undefined}
     * Class type, if the class name was found, otherwise `undefined`.
     */
    public static getStore(name: string): (StoreType|undefined) {
        return DataStore.registry[name];
    }

    /* *
    *
    *  Constructors
    *
    * */

    /**
     * Constructor for the DataStore class.
     *
     * @param {DataTable} table
     * Optional DataTable to use in the DataStore.
     *
     * @param {DataStore.Metadata} metadata
     * Optional metadata to use in the DataStore.
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
     * The DataParser responsible for handling converting the provided data to
     * a DataStore.
     */
    public abstract readonly parser: DataParser<DataParser.EventObject>;

    /**
     * Metadata to describe the store and the content of columns.
     */
    public metadata: DataStore.Metadata;

    /**
     * DataTable managed by this DataStore instance.
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
     * @param {Record<string, DataStore.MetaColumn>} columns
     * Pairs of column names and MetaColumn objects.
     */
    public describeColumns(columns: Record<string, DataStore.MetaColumn>): void {
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
     * @param {DataStore.EventObject} [e]
     * Event object containing additional event information.
     */
    public emit(e: TEventObject): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Returns the order of columns.
     *
     * @param {boolean} [usePresentationState]
     * Whether to use the column order of the presentation state of the table.
     *
     * @return {Array<string>}
     * Order of columns.
     */
    public getColumnOrder(usePresentationState?: boolean): Array<string> {
        const store = this,
            metadata = store.metadata,
            columns = metadata.columns,
            columnNames = Object.keys(columns),
            columnOrder: Array<string> = [];

        let columnName: string;

        for (let i = 0, iEnd = columnNames.length; i < iEnd; ++i) {
            columnName = columnNames[i];
            columnOrder[pick(columns[columnName].index, i)] = columnName;
        }

        return columnOrder;
    }

    /**
     * Retrieves the columns of the the dataTable,
     * applies column order from meta.
     *
     * @param {boolean} [includeIdColumn]
     * Whether to include the `id` column in the returned array.
     *
     * @param {boolean} [usePresentationOrder]
     * Whether to use the column order of the presentation state of the table.
     *
     * @return {{}}
     * An object with the properties `columnNames` and `columnValues`
     */
    protected getColumnsForExport(
        includeIdColumn?: boolean,
        usePresentationOrder?: boolean
    ): DataStore.ColumnsForExportObject {
        const table = this.table,
            columnsRecord = table.getColumns(),
            columnNames = (
                includeIdColumn ?
                    Object.keys(columnsRecord) :
                    Object.keys(columnsRecord).slice(1)
            );

        const columnOrder = this.getColumnOrder(usePresentationOrder);

        if (columnOrder.length) {
            columnNames.sort((a, b): number => {
                if (columnOrder.indexOf(a) < columnOrder.indexOf(b)) {
                    return 1;
                }
                if (columnOrder.indexOf(a) > columnOrder.indexOf(b)) {
                    return -1;
                }
                return 0;
            });
        }

        return ({
            columnNames,
            columnValues: columnNames.map(
                (name: string): DataTableRow.CellType[] => columnsRecord[name]
            )
        });
    }

    /**
     * The default load method, which fires the `afterLoad` event
     * @emits DataStore#afterLoad
     */
    public load(): void {
        fireEvent(this, 'afterLoad', { table: this.table });
    }

    /**
     * Registers a callback for a specific store event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventCallback} callback
     * Function to register for the store callback.
     *
     * @return {Function}
     * Function to unregister callback from the store event.
     */
    public on(
        type: TEventObject['type'],
        callback: DataEventEmitter.EventCallback<this, TEventObject>
    ): Function {
        return addEvent(this, type, callback);
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
     * Converts the class instance to a class JSON.
     *
     * @return {DataStore.ClassJSON}
     * Class JSON of this DataStore instance.
     */
    public toJSON(): DataStore.ClassJSON {
        return {
            $class: DataStore.getName(this.constructor),
            metadata: merge(this.metadata),
            table: this.table.toJSON()
        };
    }

    /**
     * Method for retriving metadata from a single column.
     *
     * @param {string} name
     * The identifier for the column that should be described
     *
     * @return {DataStore.MetaColumn | undefined}
     * Returns a MetaColumn object if found.
     */
    public whatIs(name: string): (DataStore.MetaColumn | undefined) {
        return this.metadata.columns[name];
    }

}

/* *
 *
 *  Namespace
 *
 * */

namespace DataStore {

    /**
     * Interface of the class JSON to convert to class instances.
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        table: DataTable.ClassJSON;
        metadata: DataStore.Metadata;
    }

    /**
     * The default event object for a datastore
     */
    export interface EventObject extends DataEventEmitter.EventObject {
        readonly table: DataTable;
    }

    /**
     * Object with columns for object.
     */
    export interface ColumnsForExportObject {
        columnNames: Array<string>;
        columnValues: Array<Array<DataTableRow.CellType>>;
        columnHeaderFormatter?: Function;
    }

    /**
     * Metadata entry containing the name of the column
     * and a metadata object
     */
    export interface MetaColumn extends DataJSON.JSONObject {
        dataType?: string;
        // validator: Function;
        defaultValue?: DataJSON.JSONPrimitive;
        index?: number;
        title?: string;
    }

    /**
     * Metadata
     */
    export interface Metadata extends DataJSON.JSONObject {
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
        '': typeof DataStore;
    }
}

/* *
 *
 *  Export
 *
 * */

export default DataStore;
