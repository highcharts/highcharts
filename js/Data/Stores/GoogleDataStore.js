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
import AjaxMixin from '../../Extensions/Ajax.js';
var ajax = AjaxMixin.ajax;
import DataTable from '../DataTable.js';
import DataStore from './DataStore.js';
import DataParser from '../Parsers/DataParser.js';
import U from '../../Core/Utilities.js';
var fireEvent = U.fireEvent, merge = U.merge;
/** eslint-disable valid-jsdoc */
/**
 * @private
 */
var GoogleDataStore = /** @class */ (function (_super) {
    __extends(GoogleDataStore, _super);
    /* *
     *
     *  Constructors
     *
     * */
    function GoogleDataStore(table, options) {
        var _this = _super.call(this, table) || this;
        _this.dataParser = new DataParser();
        _this.options = merge(GoogleDataStore.defaultOptions, options);
        _this.columns = [];
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    GoogleDataStore.fromJSON = function (json) {
        var options = json.options, table = DataTable.fromJSON(json.table), store = new GoogleDataStore(table, options);
        store.describe(DataStore.getMetadataFromJSON(json.metadata));
        return store;
    };
    /* *
     *
     *  Functions
     *
     * */
    GoogleDataStore.prototype.getSheetColumns = function (json) {
        var store = this, _a = store.options, startColumn = _a.startColumn, endColumn = _a.endColumn, startRow = _a.startRow, endRow = _a.endRow, columns = [], cells = json.feed.entry, cellCount = (cells || []).length;
        var cell, colCount = 0, rowCount = 0, val, gr, gc, cellInner, i, j;
        // First, find the total number of columns and rows that
        // are actually filled with data
        for (i = 0; i < cellCount; i++) {
            cell = cells[i];
            colCount = Math.max(colCount, cell.gs$cell.col);
            rowCount = Math.max(rowCount, cell.gs$cell.row);
        }
        // Set up arrays containing the column data
        for (i = 0; i < colCount; i++) {
            if (i >= startColumn && i <= endColumn) {
                // Create new columns with the length of either
                // end-start or rowCount
                columns[i - startColumn] = [];
            }
        }
        // Loop over the cells and assign the value to the right
        // place in the column arrays
        for (i = 0; i < cellCount; i++) {
            cell = cells[i];
            gr = cell.gs$cell.row - 1; // rows start at 1
            gc = cell.gs$cell.col - 1; // columns start at 1
            // If both row and col falls inside start and end set the
            // transposed cell value in the newly created columns
            if (gc >= startColumn && gc <= endColumn &&
                gr >= startRow && gr <= endRow) {
                cellInner = cell.gs$cell || cell.content;
                val = null;
                if (cellInner.numericValue) {
                    if (cellInner.$t.indexOf('/') >= 0 ||
                        cellInner.$t.indexOf('-') >= 0) {
                        // This is a date - for future reference.
                        val = cellInner.$t;
                    }
                    else if (cellInner.$t.indexOf('%') > 0) {
                        // Percentage
                        val = parseFloat(cellInner.numericValue) * 100;
                    }
                    else {
                        val = parseFloat(cellInner.numericValue);
                    }
                }
                else if (cellInner.$t && cellInner.$t.length) {
                    val = cellInner.$t;
                }
                columns[gc - startColumn][gr - startRow] = val;
            }
        }
        // Insert null for empty spreadsheet cells (#5298)
        for (i = 0; i < colCount; i++) {
            for (j = 0; j < cellCount; i++) {
                if (typeof columns[i][j] === 'undefined') {
                    columns[i][j] = null;
                }
            }
        }
        return columns;
    };
    GoogleDataStore.prototype.parseSheet = function (json) {
        var store = this, cells = json.feed.entry, columns = [];
        if (!cells || cells.length === 0) {
            return false;
        }
        fireEvent(store, 'parse', { json: json }, function () {
            columns = store.getSheetColumns(json);
            store.columns = columns;
            fireEvent(store, 'afterParse', { columns: columns });
        });
    };
    GoogleDataStore.prototype.fetchSheet = function () {
        var store = this, headers = [], _a = store.options, enablePolling = _a.enablePolling, dataRefreshRate = _a.dataRefreshRate, googleSpreadsheetKey = _a.googleSpreadsheetKey, worksheet = _a.worksheet, url = [
            'https://spreadsheets.google.com/feeds/cells',
            googleSpreadsheetKey,
            worksheet,
            'public/values?alt=json'
        ].join('/');
        var i, colsCount;
        ajax({
            url: url,
            dataType: 'json',
            success: function (json) {
                fireEvent(store, 'load', { json: json, enablePolling: enablePolling, dataRefreshRate: dataRefreshRate }, function () {
                    store.parseSheet(json);
                    colsCount = store.columns.length;
                    for (i = 0; i < colsCount; i++) {
                        headers.push('' + store.columns[i][0]);
                    }
                    var table = DataTable.fromColumns(store.columns, headers);
                    // Polling
                    if (enablePolling) {
                        setTimeout(function () {
                            store.fetchSheet();
                        }, dataRefreshRate * 1000);
                    }
                    fireEvent(store, 'afterLoad', { table: table });
                });
            },
            error: function (xhr, text) {
                /* *
                 * TODO:
                 * catch error
                 * ...
                 *
                 * */
                // console.log(text);
                fireEvent(store, 'fail', { text: text });
            }
        });
        // return true;
    };
    GoogleDataStore.prototype.load = function () {
        return this.options.googleSpreadsheetKey ?
            this.fetchSheet() : void 0;
    };
    GoogleDataStore.prototype.toJSON = function () {
        var json = {
            $class: 'GoogleDataStore',
            options: merge(this.options),
            table: this.table.toJSON(),
            metadata: this.getMetadataJSON()
        };
        return json;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    GoogleDataStore.defaultOptions = {
        googleSpreadsheetKey: '',
        worksheet: 1,
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        enablePolling: false,
        dataRefreshRate: 2
    };
    return GoogleDataStore;
}(DataStore));
export default GoogleDataStore;
