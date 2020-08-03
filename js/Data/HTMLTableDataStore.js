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
import DataStore from './DataStore.js';
import DataTable from './DataTable.js';
import DataParser from './DataParser.js';
import U from '../Core/Utilities.js';
import H from '../Core/Globals.js';
var fireEvent = U.fireEvent;
var win = H.win;
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
    function HTMLTableDataStore(dataSet, options) {
        if (dataSet === void 0) { dataSet = new DataTable(); }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, dataSet) || this;
        _this.table = options.table || '';
        _this.startRow = options.startRow || 0;
        _this.endRow = options.endRow || Number.MAX_VALUE;
        _this.startColumn = options.startColumn || 0;
        _this.endColumn = options.endColumn || Number.MAX_VALUE;
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
            _this.rows = e.table;
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
        var columns = [], headers = [], store = this, startRow = store.startRow, endRow = store.endRow, startColumn = store.startColumn, endColumn = store.endColumn;
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
        var tableElement;
        if (typeof this.table === 'string') {
            tableElement = win.document.getElementById(this.table);
        }
        else {
            tableElement = this.table;
        }
        fireEvent(this, 'load', { tableElement: tableElement }, function () {
            if (tableElement) {
                _this.htmlToDataTable(tableElement);
                var table = _this.columns ?
                    _this.dataParser.columnArrayToDataTable(_this.columns, _this.headers) :
                    new DataTable();
                fireEvent(_this, 'afterLoad', { table: table });
            }
            else {
                fireEvent(_this, 'fail', {
                    error: 'HTML table not provided, or could not find ID'
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
    return HTMLTableDataStore;
}(DataStore));
export default HTMLTableDataStore;
