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
var addEvent = U.addEvent, fireEvent = U.fireEvent;
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
     * Constructor for the DataStore class
     * @param {DataTable} table
     * Optional DataTable to create the DataStore from
     */
    function DataStore(table) {
        if (table === void 0) { table = new DataTable(); }
        this.table = table;
        this.metadata = [];
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Function for converting MetadataJSON to metadata array used within the
     * datastore
     * @param {DataStore.MetadataJSON} metadataJSON JSON containing metadata
     * @return {Array<DataStore.MetaColumn>}
     * Returns an array of MetaColumn objects
     */
    DataStore.getMetadataFromJSON = function (metadataJSON) {
        var metadata = [];
        var elem;
        for (var i = 0, iEnd = metadataJSON.length; i < iEnd; i++) {
            elem = metadataJSON[i];
            if (elem instanceof Array && typeof elem[0] === 'string' &&
                typeof elem[1] === 'object' && !Array.isArray(elem[1])) {
                metadata.push({
                    name: elem[0],
                    metadata: elem[1] || {}
                });
            }
        }
        return metadata;
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Method for adding metadata for a single column
     * @param {string} name
     * The name of the column to be described
     * @param {DataStore.Metadata} metadata
     * The metadata to apply to the column
     */
    DataStore.prototype.describeColumn = function (name, metadata) {
        this.metadata.push({
            name: name,
            metadata: metadata
        });
    };
    /**
     * Method for applying metadata to the whole datastore
     * @param {Array<DataStore.MetaColumn>} metadata
     * An array of MetaColumn objects
     */
    DataStore.prototype.describe = function (metadata) {
        this.metadata = metadata;
    };
    /**
     * Method for retriving metadata from a single column
     * @param {string} name
     * The identifier for the column that should be described
     * @return {DataStore.MetaColumn | void}
     * Returns a MetaColumn object if found
     */
    DataStore.prototype.whatIs = function (name) {
        var metadata = this.metadata;
        var i;
        for (i = 0; i < metadata.length; i++) {
            if (metadata[i].name === name) {
                return metadata[i];
            }
        }
    };
    /**
     * Internal method for converting metadata to MetadataJSON
     * @return {DataStore.MetadataJSON}
     * Metadata converted to the MetadataJSON scheme
     */
    DataStore.prototype.getMetadataJSON = function () {
        var json = [];
        var elem;
        for (var i = 0, iEnd = this.metadata.length; i < iEnd; i++) {
            elem = this.metadata[i];
            json.push([
                elem.name,
                elem.metadata
            ]);
        }
        return json;
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
     * Function to register for an modifier callback.
     *
     * @return {Function}
     * Function to unregister callback from the modifier event.
     */
    DataStore.prototype.on = function (type, callback) {
        return addEvent(this, type, callback);
    };
    return DataStore;
}());
export default DataStore;
