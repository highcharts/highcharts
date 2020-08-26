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
import DataJSON from '../DataJSON.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import H from '../../Core/Globals.js';
var win = H.win;
import HTMLTableParser from '../Parsers/HTMLTableParser.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
/** eslint-disable valid-jsdoc */
/**
 * Class that handles creating a datastore from an HTML table
 */
var HTMLTableDataStore = /** @class */ (function (_super) {
    __extends(HTMLTableDataStore, _super);
    /* *
     *
     *  Constructors
     *
     * */
    /**
     * Constructs an instance of HTMLTableDataStore
     *
     * @param {DataTable} table
     * Optional DataTable to create the store from
     *
     * @param {HTMLTableDataStore.OptionsType} options
     * Options for the store and parser
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser
     */
    function HTMLTableDataStore(table, options, parser) {
        if (table === void 0) { table = new DataTable(); }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, table) || this;
        _this.tableElement = null;
        _this.options = merge(HTMLTableDataStore.defaultOptions, options);
        _this.parser = parser || new HTMLTableParser(_this.tableElement, _this.options);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Creates an HTMLTableStore from ClassJSON
     *
     * @param {HTMLTableDataStore.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {HTMLTableDataStore}
     * HTMLTableStore from the ClassJSON
     */
    HTMLTableDataStore.fromJSON = function (json) {
        var options = json.options, parser = HTMLTableParser.fromJSON(json.parser), table = DataTable.fromJSON(json.table), store = new HTMLTableDataStore(table, options, parser);
        store.describe(DataStore.getMetadataFromJSON(json.metadata));
        return store;
    };
    /**
     * Handles retrieving the HTML table by ID if an ID is provided
     */
    HTMLTableDataStore.prototype.fetchTable = function () {
        var store = this, tableHTML = store.options.tableHTML;
        var tableElement;
        if (typeof tableHTML === 'string') {
            store.tableID = tableHTML;
            tableElement = win.document.getElementById(tableHTML);
        }
        else {
            tableElement = tableHTML;
            store.tableID = tableElement.id;
        }
        store.tableElement = tableElement;
    };
    /**
     * Initiates creating the datastore from the HTML table
     * @emits HTMLTableDataStore#load
     * @emits HTMLTableDataStore#afterLoad
     * @emits HTMLTableDataStore#loadError
     */
    HTMLTableDataStore.prototype.load = function () {
        var store = this;
        store.fetchTable();
        store.emit({
            type: 'load',
            table: store.table,
            tableElement: store.tableElement
        });
        if (!store.tableElement) {
            store.emit({
                type: 'loadError',
                error: 'HTML table not provided, or element with ID not found',
                table: store.table
            });
            return;
        }
        store.parser.parse(merge({ tableHTML: store.tableElement }, store.options));
        store.table = store.parser.getTable();
        store.emit({
            type: 'afterLoad',
            table: store.table,
            tableElement: store.tableElement
        });
    };
    /**
     * Save
     * @todo implement
     */
    HTMLTableDataStore.prototype.save = function () {
    };
    HTMLTableDataStore.prototype.toJSON = function () {
        var store = this, json = {
            $class: 'HTMLTableDataStore',
            metadata: store.getMetadataJSON(),
            parser: store.parser.toJSON(),
            table: store.table.toJSON(),
            options: merge(this.options),
            tableElementID: store.tableID || ''
        };
        return json;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    HTMLTableDataStore.defaultOptions = {
        tableHTML: ''
    };
    return HTMLTableDataStore;
}(DataStore));
/* *
 *
 *  Register
 *
 * */
DataJSON.addClass(HTMLTableDataStore);
/* *
 *
 *  Export
 *
 * */
export default HTMLTableDataStore;
