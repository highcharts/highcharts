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
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, fireEvent = U.fireEvent, merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/**
 * Abstract class providing an interface for managing a DataStore
 */
var DataStore = /** @class */ (function () {
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
    function DataStore(table, metadata) {
        if (table === void 0) { table = new DataTable(); }
        if (metadata === void 0) { metadata = { columns: {} }; }
        this.table = table;
        this.metadata = metadata;
    }
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
    DataStore.addStore = function (dataStore) {
        var name = DataStore.getName(dataStore), registry = DataStore.registry;
        if (typeof name === 'undefined' ||
            registry[name]) {
            return false;
        }
        registry[name] = dataStore;
        return true;
    };
    /**
     * Returns all registered dataStore names.
     *
     * @return {Array<string>}
     * All registered store names.
     */
    DataStore.getAllStoreNames = function () {
        return Object.keys(DataStore.registry);
    };
    /**
     * Returns a copy of the dataStore registry as record object with
     * dataStore names and their dataStore class.
     *
     * @return {Record<string,DataStoreRegistryType>}
     * Copy of the dataStore registry.
     */
    DataStore.getAllStores = function () {
        return merge(DataStore.registry);
    };
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
    DataStore.getStore = function (name) {
        return DataStore.registry[name];
    };
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
    DataStore.getName = function (dataStore) {
        return (dataStore.toString().match(DataStore.nameRegExp) ||
            ['', ''])[1];
    };
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
     * @param {DataStore.MetaColumn} column
     * The metadata to apply to the column.
     */
    DataStore.prototype.describeColumn = function (name, column) {
        this.metadata.columns[name] = column;
    };
    /**
     * Method for applying columns meta information to the whole datastore.
     *
     * @param {Record<string, DataStore.MetaColumn>} columns
     * Pairs of column names and MetaColumn objects.
     */
    DataStore.prototype.describeColumns = function (columns) {
        this.metadata.columns = merge(columns);
    };
    /**
     * Method for retriving metadata from a single column
     *
     * @param {string} name
     * The identifier for the column that should be described
     *
     * @return {DataStore.MetaColumn | undefined}
     * Returns a MetaColumn object if found.
     */
    DataStore.prototype.whatIs = function (name) {
        return this.metadata.columns[name];
    };
    /**
     * The default load method, which fires the `afterLoad` event
     * @emits DataStore#afterLoad
     */
    DataStore.prototype.load = function () {
        fireEvent(this, 'afterLoad', { table: this.table });
    };
    /**
     * Emits an event on the store to all registered callbacks of this event.
     *
     * @param {DataStore.EventObject} [e]
     * Event object containing additional event information.
     */
    DataStore.prototype.emit = function (e) {
        fireEvent(this, e.type, e);
    };
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
    DataStore.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    /**
     * Converts the class instance to a class JSON.
     *
     * @return {DataStore.ClassJSON}
     * Class JSON of this DataStore instance.
     */
    DataStore.prototype.toJSON = function () {
        return {
            $class: DataStore.getName(this.constructor),
            metadata: merge(this.metadata),
            table: this.table.toJSON()
        };
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Registry as a record object with store names and their class.
     */
    DataStore.registry = {};
    /**
     * Regular expression to extract the store name (group 1) from the
     * stringified class type.
     */
    DataStore.nameRegExp = /^function\s+(\w*?)(?:DataStore)?\s*\(/;
    return DataStore;
}());
/* *
 *
 *  Export
 *
 * */
export default DataStore;
