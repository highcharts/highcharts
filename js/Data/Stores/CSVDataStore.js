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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import Ajax from '../../Extensions/Ajax.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
import CSVDataParser from '../Parsers/CSVDataParser.js';
var ajax = Ajax.ajax;
/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */
/**
 * Class that handles creating a datastore from CSV
 */
var CSVDataStore = /** @class */ (function (_super) {
    __extends(CSVDataStore, _super);
    /* *
    *
    *  Constructors
    *
    * */
    /**
     * Constructs an instance of CSVDataStore
     *
     * @param {DataTable} table
     * Optional DataTable to create the store from
     *
     * @param {CSVDataStore.OptionsType} options
     * Options for the store and parser
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser
     */
    function CSVDataStore(table, options, parser) {
        if (table === void 0) { table = new DataTable(); }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, table) || this;
        var csv = options.csv, csvURL = options.csvURL, enablePolling = options.enablePolling, dataRefreshRate = options.dataRefreshRate, parserOptions = __rest(options, ["csv", "csvURL", "enablePolling", "dataRefreshRate"]);
        _this.options = merge(CSVDataStore.defaultOptions, { csv: csv, csvURL: csvURL, enablePolling: enablePolling, dataRefreshRate: dataRefreshRate });
        _this.parser = parser || new CSVDataParser(parserOptions);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Creates a CSVDatastore from a ClassJSON object.
     *
     * @param {CSVDataStore.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {CSVDataStore}
     * CSVDataStore from the ClassJSON.
     */
    CSVDataStore.fromJSON = function (json) {
        var options = json.options, parser = CSVDataParser.fromJSON(json.parser), table = DataTable.fromJSON(json.table), store = new CSVDataStore(table, options, parser);
        store.describe(DataStore.getMetadataFromJSON(json.metadata));
        return store;
    };
    /**
     * Handles polling of live data
     */
    CSVDataStore.prototype.poll = function () {
        var _this = this;
        var _a = this.options, dataRefreshRate = _a.dataRefreshRate, pollingEnabled = _a.enablePolling, csvURL = _a.csvURL;
        var updateIntervalMs = (dataRefreshRate > 1 ? dataRefreshRate : 1) * 1000;
        if (pollingEnabled && csvURL === this.liveDataURL) {
            // We need to stop doing this if the URL has changed
            this.liveDataTimeout = setTimeout(function () {
                _this.fetchCSV();
            }, updateIntervalMs);
        }
    };
    /**
     * Fetches CSV from external source
     *
     * @param {boolean} initialFetch
     * Indicates whether this is a single fetch or a repeated fetch
     *
     * @emits CSVDataStore#load
     * @emits CSVDataStore#afterLoad
     * @emits CSVDataStore#loadError
     */
    CSVDataStore.prototype.fetchCSV = function (initialFetch) {
        var store = this, maxRetries = 3, csvURL = store.options.csvURL;
        var currentRetries;
        if (initialFetch) {
            clearTimeout(store.liveDataTimeout);
            store.liveDataURL = csvURL;
        }
        store.emit({ type: 'load', table: store.table });
        ajax({
            url: store.liveDataURL,
            dataType: 'text',
            success: function (csv) {
                store.parser.parse({ csv: csv });
                if (store.liveDataURL) {
                    store.poll();
                }
                store.table = store.parser.getTable();
                store.emit({ type: 'afterLoad', csv: csv, table: store.table });
            },
            error: function (xhr, error) {
                if (++currentRetries < maxRetries) {
                    store.poll();
                }
                store.emit({ type: 'loadError', error: error, table: store.table, xhr: xhr });
            }
        });
    };
    /**
     * Initiates the loading of the CSV source to the store
     * @emits CSVDataParser#load
     * @emits CSVDataParser#afterLoad
     */
    CSVDataStore.prototype.load = function () {
        var store = this, _a = store.options, csv = _a.csv, csvURL = _a.csvURL;
        if (csv) {
            store.emit({ type: 'load', csv: csv, table: store.table });
            store.parser.parse({ csv: csv });
            store.table = store.parser.getTable();
            store.emit({ type: 'afterLoad', csv: csv, table: store.table });
        }
        else if (csvURL) {
            store.fetchCSV(true);
        }
    };
    CSVDataStore.prototype.save = function () {
    };
    /**
     * Converts the store to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this store.
     */
    CSVDataStore.prototype.toJSON = function () {
        var json = {
            $class: 'CSVDataStore',
            metadata: this.getMetadataJSON(),
            options: merge(this.options),
            parser: this.parser.toJSON(),
            table: this.table.toJSON()
        };
        return json;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    CSVDataStore.defaultOptions = {
        csv: '',
        csvURL: '',
        enablePolling: false,
        dataRefreshRate: 1
    };
    return CSVDataStore;
}(DataStore));
/* *
 *
 *  Export
 *
 * */
export default CSVDataStore;
