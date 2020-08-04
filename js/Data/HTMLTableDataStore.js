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
import DataParser from './DataParser.js';
import DataStore from './DataStore.js';
import DataTable from './DataTable.js';
import H from '../Core/Globals.js';
var win = H.win;
import U from '../Core/Utilities.js';
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
        _this.element = options.table || '';
        _this.options = merge(HTMLTableDataStore.defaultOptions, options);
        _this.dataParser = new DataParser();
        _this.addEvents();
        return _this;
    }
    HTMLTableDataStore.prototype.addEvents = function () {
        var _this = this;
        this.on('load', function (e) {
            // console.log(e)
        });
        this.on('afterLoad', function (e) {
            _this.table = e.table;
        });
        this.on('parse', function (e) {
            // console.log(e)
        });
        this.on('afterParse', function (e) {
            _this.columns = e.columns;
            _this.headers = e.headers;
        });
        this.on('fail', function (e) {
            // throw new Error(e.error)
        });
    };
    HTMLTableDataStore.prototype.htmlToDataTable = function (table) {
        var columns = [], headers = [], store = this, _a = store.options, startRow = _a.startRow, endRow = _a.endRow, startColumn = _a.startColumn, endColumn = _a.endColumn;
        fireEvent(this, 'parse', { table: table.innerHTML }, function () {
            [].forEach.call(table.getElementsByTagName('tr'), function (tr, rowNo) {
                if (rowNo >= startRow && rowNo <= endRow) {
                    [].forEach.call(tr.children, function (item, colNo) {
                        var row = columns[colNo - startColumn];
                        var i = 1;
                        if ((item.tagName === 'TD' ||
                            item.tagName === 'TH') &&
                            colNo >= startColumn &&
                            colNo <= endColumn) {
                            if (!columns[colNo - startColumn]) {
                                columns[colNo - startColumn] = [];
                            }
                            if (item.tagName === 'TH') {
                                headers.push(item.innerHTML);
                            }
                            columns[colNo - startColumn][rowNo - startRow] = item.innerHTML;
                            // Loop over all previous indices and make sure
                            // they are nulls, not undefined.
                            while (rowNo - startRow >= i &&
                                row[rowNo - startRow - i] === void 0) {
                                row[rowNo - startRow - i] = null;
                                i++;
                            }
                        }
                    });
                }
            });
            fireEvent(store, 'afterParse', { columns: columns, headers: headers });
        });
    };
    /**
     * Handle supplied table being either an ID or an actual table
     */
    HTMLTableDataStore.prototype.fetchTable = function () {
        var _this = this;
        var element;
        if (typeof this.element === 'string') {
            element = win.document.getElementById(this.element);
        }
        else {
            element = this.element;
        }
        fireEvent(this, 'load', { tableElement: element }, function () {
            if (element) {
                _this.htmlToDataTable(element);
                var table = _this.columns ?
                    _this.dataParser.columnArrayToDataTable(_this.columns, _this.headers) :
                    new DataTable();
                fireEvent(_this, 'afterLoad', { table: table });
            }
            else {
                fireEvent(_this, 'fail', {
                    error: 'HTML table not provided, or element with ID not found'
                });
            }
        });
    };
    /**
     * Load
     * TODO: add callback / fire event
     */
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
        table: '',
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE
    };
    return HTMLTableDataStore;
}(DataStore));
export default HTMLTableDataStore;
