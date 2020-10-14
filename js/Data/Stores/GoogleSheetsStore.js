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
import AjaxMixin from '../../Extensions/Ajax.js';
var ajax = AjaxMixin.ajax;
import DataJSON from './../DataJSON.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
var merge = U.merge, uniqueKey = U.uniqueKey;
/** eslint-disable valid-jsdoc */
/**
 * @private
 */
var GoogleSheetsStore = /** @class */ (function (_super) {
    __extends(GoogleSheetsStore, _super);
    /* *
     *
     *  Constructors
     *
     * */
    function GoogleSheetsStore(table, options) {
        var _this = _super.call(this, table) || this;
        _this.parser = void 0;
        _this.options = merge(GoogleSheetsStore.defaultOptions, options);
        _this.columns = [];
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    GoogleSheetsStore.fromJSON = function (json) {
        var options = json.options, table = DataTable.fromJSON(json.table), store = new GoogleSheetsStore(table, options);
        store.metadata = merge(json.metadata);
        return store;
    };
    /* *
     *
     *  Functions
     *
     * */
    GoogleSheetsStore.prototype.getSheetColumns = function (json) {
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
                    if (cellInner.$t.indexOf('/') >= 0 || (cellInner.$t.indexOf('-') >= 0 && cellInner.$t.indexOf('.') === -1)) {
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
            var column = columns[i];
            // TODO: should this check be necessary?
            if (column.length) {
                for (i = 0; i < column.length; i++) {
                    if (typeof column[i] === 'undefined') {
                        column[i] = null;
                    }
                }
            }
        }
        return columns;
    };
    GoogleSheetsStore.prototype.parseSheet = function (json) {
        var store = this, cells = json.feed.entry, columns = [];
        if (!cells || cells.length === 0) {
            return false;
        }
        // parser.emit({ type: 'parse', json });
        columns = store.getSheetColumns(json);
        store.columns = columns;
        // parser.emit({ type: 'afterParse', columns });
    };
    /**
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    GoogleSheetsStore.prototype.fetchSheet = function (eventDetail) {
        var store = this, headers = [], _a = store.options, enablePolling = _a.enablePolling, dataRefreshRate = _a.dataRefreshRate, googleSpreadsheetKey = _a.googleSpreadsheetKey, worksheet = _a.worksheet, url = [
            'https://spreadsheets.google.com/feeds/cells',
            googleSpreadsheetKey,
            worksheet,
            'public/values?alt=json'
        ].join('/');
        var i, colsCount;
        store.emit({
            type: 'load',
            detail: eventDetail,
            table: store.table,
            url: url
        });
        ajax({
            url: url,
            dataType: 'json',
            success: function (json) {
                var _a;
                store.parseSheet(json);
                colsCount = store.columns.length;
                for (i = 0; i < colsCount; i++) {
                    headers.push(((_a = store.columns[i][0]) === null || _a === void 0 ? void 0 : _a.toString()) || uniqueKey());
                }
                var table = DataTable.fromColumns(store.columns, headers);
                store.table = table;
                // Polling
                if (enablePolling) {
                    setTimeout(function () {
                        store.fetchSheet();
                    }, dataRefreshRate * 1000);
                }
                store.emit({
                    type: 'afterLoad',
                    detail: eventDetail,
                    table: table,
                    url: url
                });
            },
            error: function (xhr, error) {
                /* *
                 * TODO:
                 * catch error
                 * ...
                 *
                 * */
                // console.log(text);
                store.emit({
                    type: 'loadError',
                    detail: eventDetail,
                    error: error,
                    table: store.table,
                    xhr: xhr
                });
            }
        });
        // return true;
    };
    /**
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    GoogleSheetsStore.prototype.load = function (eventDetail) {
        if (this.options.googleSpreadsheetKey) {
            this.fetchSheet(eventDetail);
        }
    };
    GoogleSheetsStore.prototype.toJSON = function () {
        return {
            $class: 'GoogleSheetsStore',
            metadata: merge(this.metadata),
            options: merge(this.options),
            table: this.table.toJSON()
        };
    };
    /* *
     *
     *  Static Properties
     *
     * */
    GoogleSheetsStore.defaultOptions = {
        googleSpreadsheetKey: '',
        worksheet: 1,
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        enablePolling: false,
        dataRefreshRate: 2
    };
    return GoogleSheetsStore;
}(DataStore));
/* *
 *
 *  Registry
 *
 * */
DataJSON.addClass(GoogleSheetsStore);
DataStore.addStore(GoogleSheetsStore);
/* *
 *
 *  Export
 *
 * */
export default GoogleSheetsStore;
