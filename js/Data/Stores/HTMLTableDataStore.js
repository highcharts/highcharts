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
import HTMLTableParser from '../Parsers/HTMLTableParser.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import H from '../../Core/Globals.js';
var win = H.win;
import U from '../../Core/Utilities.js';
var fireEvent = U.fireEvent, merge = U.merge;
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
        var tableHTML = options.tableHTML, parserOptions = __rest(options, ["tableHTML"]);
        _this.element = tableHTML || '';
        _this.parserOptions = merge(HTMLTableDataStore.defaultOptions, parserOptions);
        _this.dataParser = new HTMLTableParser(table);
        _this.addEvents();
        return _this;
    }
    HTMLTableDataStore.prototype.addEvents = function () {
        var _this = this;
        var dataParser = this.dataParser;
        this.on('load', function (e) {
            if (e.tableElement) {
                fireEvent(_this, 'parse', { tableElement: e.tableElement });
            }
            else {
                fireEvent(_this, 'fail', {
                    error: 'HTML table not provided, or element with ID not found'
                });
            }
        });
        this.on('afterLoad', function (e) {
            _this.table = e.table;
        });
        this.on('parse', function (e) {
            _this.dataParser.parse(__assign({ tableElement: e.tableElement }, _this.parserOptions));
            fireEvent(_this, 'afterParse', { dataParser: dataParser });
        });
        this.on('afterParse', function (e) {
            fireEvent(_this, 'afterLoad', { table: dataParser.getTable() });
        });
        this.on('fail', function (e) {
            // throw new Error(e.error)
        });
    };
    /**
     * Handle supplied table being either an ID or an actual table
     */
    HTMLTableDataStore.prototype.fetchTable = function () {
        var tableElement;
        if (typeof this.element === 'string') {
            tableElement = win.document.getElementById(this.element);
        }
        else {
            tableElement = this.element;
        }
        fireEvent(this, 'load', { tableElement: tableElement });
    };
    HTMLTableDataStore.prototype.load = function () {
        this.fetchTable();
    };
    /**
     * Save
     * @todo implement
     */
    HTMLTableDataStore.prototype.save = function () {
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
