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
import ajaxModule from '../mixins/ajax.js';
var ajax = ajaxModule.ajax;
/** eslint-disable valid-jsdoc */
/**
 * @private
 */
var GoogleDataStore = /** @class */ (function (_super) {
    __extends(GoogleDataStore, _super);
    function GoogleDataStore(dataSet, options) {
        var _this = _super.call(this, dataSet) || this;
        _this.googleSpreadsheetKey = options.googleSpreadsheetKey;
        _this.worksheet = options.worksheet || 1;
        _this.startRow = options.startRow || 0;
        _this.endRow = options.endRow || Number.MAX_VALUE;
        _this.startColumn = options.startColumn || 0;
        _this.endColumn = options.endColumn || Number.MAX_VALUE;
        _this.enablePolling = options.enablePolling || false;
        _this.dataRefreshRate = options.dataRefreshRate || 2;
        return _this;
    }
    /* *
    *
    *  Functions
    *
    * */
    GoogleDataStore.prototype.parseSheet = function (json) {
        var startColumn = this.startColumn, endColumn = this.endColumn, startRow = this.startRow, endRow = this.endRow, columns = [], cells = json.feed.entry, cell, cellCount = (cells || []).length, colCount = 0, rowCount = 0, val, gr, gc, cellInner, i;
        if (!cells || cells.length === 0) {
            return false;
        }
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
        columns.forEach(function (column) {
            for (i = 0; i < column.length; i++) {
                if (typeof column[i] === 'undefined') {
                    column[i] = null;
                }
            }
        });
        /* *
         * TODO:
         * add data to dataTable
         * ...
         *
         * */
    };
    GoogleDataStore.prototype.fetchSheet = function () {
        var parseSheet = this.parseSheet;
        var fetchSheet = this.fetchSheet;
        var enablePolling = this.enablePolling;
        var dataRefreshRate = this.dataRefreshRate;
        var url = [
            'https://spreadsheets.google.com/feeds/cells',
            this.googleSpreadsheetKey,
            this.worksheet,
            'public/values?alt=json'
        ].join('/');
        ajax({
            url: url,
            dataType: 'json',
            success: function (json) {
                parseSheet(json);
                // Polling
                if (enablePolling) {
                    setTimeout(function () {
                        fetchSheet();
                    }, dataRefreshRate * 1000);
                }
            },
            error: function (xhr, text) {
                /* *
                 * TODO:
                 * catch error
                 * ...
                 *
                 * */
                // console.log(text);
            }
        });
        // return true;
    };
    GoogleDataStore.prototype.load = function () {
        return this.googleSpreadsheetKey ?
            this.fetchSheet() : void 0;
    };
    return GoogleDataStore;
}(DataStore));
export default GoogleDataStore;
