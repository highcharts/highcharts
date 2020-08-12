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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import H from '../../Core/Globals.js';
var win = H.win;
import HTMLTableParser from '../Parsers/HTMLTableParser.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
/** eslint-disable valid-jsdoc */
/**
 * @private
 */
var HTMLTableDataStore = /** @class */ (function (_super) {
    __extends(HTMLTableDataStore, _super);
    /* *
     *
     *  Constructors
     *
     * */
    function HTMLTableDataStore(table, options) {
        if (table === void 0) { table = new DataTable(); }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, table) || this;
        _this.parser = new HTMLTableParser(table);
        _this.options = merge(HTMLTableDataStore.defaultOptions, HTMLTableParser.defaultOptions, options);
        _this.tableElement = null;
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    HTMLTableDataStore.fromJSON = function (json) {
        var options = {
            tableHTML: json.tableElement
        }, table = DataTable.fromJSON(json.table), store = new HTMLTableDataStore(table, options);
        store.describe(DataStore.getMetadataFromJSON(json.metadata));
        return store;
    };
    /**
     * Handle supplied table being either an ID or an actual table
     */
    HTMLTableDataStore.prototype.fetchTable = function () {
        var store = this, tableHTML = store.options.tableHTML;
        var tableElement;
        if (typeof tableHTML === 'string') {
            tableElement = win.document.getElementById(tableHTML);
        }
        else {
            tableElement = tableHTML;
        }
        store.tableElement = tableElement;
    };
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
        store.parser.parse(__assign({ tableElement: store.tableElement }, store.options));
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
            table: store.table.toJSON(),
            tableElement: (typeof store.tableElement === 'string' ?
                store.tableElement :
                store.tableElement ?
                    store.tableElement.id :
                    ''),
            metadata: store.getMetadataJSON()
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
export default HTMLTableDataStore;
