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
import DataParser from './Parsers/DataParser.js';
import ajaxModule from '../Extensions/Ajax.js';
import U from '../Core/Utilities.js';
var ajax = ajaxModule.ajax;
var fireEvent = U.fireEvent;
/* eslint-disable valid-jsdoc, require-jsdoc */
/**
 * @private
 */
var CSVDataStore = /** @class */ (function (_super) {
    __extends(CSVDataStore, _super);
    /* *
    *
    *  Constructors
    *
    * */
    function CSVDataStore(dataSet, options) {
        if (dataSet === void 0) { dataSet = new DataTable(); }
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, dataSet) || this;
        if (options.csv) {
            _this.csv = options.csv;
        }
        if (options.csvURL) {
            _this.csvURL = options.csvURL;
        }
        _this.enablePolling = options.enablePolling || false;
        _this.dataRefreshRate = options.dataRefreshRate || 2;
        _this.decimalPoint = options.decimalPoint || '.';
        _this.itemDelimiter = options.itemDelimiter;
        _this.lineDelimiter = options.lineDelimiter || '\n';
        _this.firstRowAsNames = options.firstRowAsNames || true;
        _this.startRow = options.startRow || 0;
        _this.endRow = options.endRow || Number.MAX_VALUE;
        _this.startColumn = options.startColumn || 0;
        _this.endColumn = options.endColumn || Number.MAX_VALUE;
        _this.dataParser = new DataParser();
        _this.addEvents();
        return _this;
    }
    CSVDataStore.prototype.addEvents = function () {
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
    /**
    * Parse a CSV input string
    * @todo simplify
    *
    * @function Highcharts.Data#parseCSV
    * @return {void}
    */
    CSVDataStore.prototype.parseCSV = function (csv) {
        var store = this;
        var lines, rowIt = 0, startRow = store.startRow, endRow = store.endRow;
        this.columns = [];
        // todo parse should have a payload
        fireEvent(store, 'parse', {}, function () {
            var _a;
            if (csv && store.beforeParse) {
                csv = store.beforeParse(csv);
            }
            if (csv) {
                lines = csv
                    .replace(/\r\n/g, '\n') // Unix
                    .replace(/\r/g, '\n') // Mac
                    .split(store.lineDelimiter);
                if (!startRow || startRow < 0) {
                    startRow = 0;
                }
                if (!endRow || endRow >= lines.length) {
                    endRow = lines.length - 1;
                }
                if (!store.itemDelimiter) {
                    store.itemDelimiter = store.guessDelimiter(lines);
                }
                var offset = 0;
                for (rowIt = startRow; rowIt <= endRow; rowIt++) {
                    if (lines[rowIt][0] === '#') {
                        offset++;
                    }
                    else {
                        store.parseCSVRow(lines[rowIt], rowIt - startRow - offset);
                    }
                }
            }
            if (store.firstRowAsNames) {
                (_a = store.columns) === null || _a === void 0 ? void 0 : _a.forEach(function (col, i) {
                    if (!store.headers) {
                        store.headers = [];
                    }
                    store.headers[i] = '' + col[0];
                });
            }
            fireEvent(store, 'afterParse', { columns: store.columns, headers: store.headers });
        });
    };
    CSVDataStore.prototype.parseCSVRow = function (columnStr, rowNumber) {
        var store = this, columns = store.columns || [];
        var i = 0, c = '', cl = '', cn = '', token = '', actualColumn = 0, column = 0;
        /**
         * @private
         */
        function read(j) {
            c = columnStr[j];
            cl = columnStr[j - 1];
            cn = columnStr[j + 1];
        }
        /**
         * @private
         */
        function push() {
            if (store.startColumn > actualColumn || actualColumn > store.endColumn) {
                // Skip this column, but increment the column count (#7272)
                ++actualColumn;
                token = '';
                return;
            }
            if (columns.length < column + 1) {
                columns.push([]);
            }
            columns[column][rowNumber] = token;
            token = '';
            ++column;
            ++actualColumn;
        }
        if (!columnStr.trim().length) {
            return;
        }
        if (columnStr.trim()[0] === '#') {
            return;
        }
        for (; i < columnStr.length; i++) {
            read(i);
            // Quoted string
            if (c === '#') {
                // The rest of the row is a comment
                push();
                return;
            }
            if (c === '"') {
                read(++i);
                while (i < columnStr.length) {
                    if (c === '"' && cl !== '"' && cn !== '"') {
                        break;
                    }
                    if (c !== '"' || (c === '"' && cl !== '"')) {
                        token += c;
                    }
                    read(++i);
                }
            }
            else if (c === this.itemDelimiter) {
                push();
                // Actual column data
            }
            else {
                token += c;
            }
        }
        push();
    };
    CSVDataStore.prototype.guessDelimiter = function (lines) {
        var points = 0, commas = 0, guessed;
        var potDelimiters = {
            ',': 0,
            ';': 0,
            '\t': 0
        };
        // TODO make this not a [].some
        lines.some(function (columnStr, i) {
            var inStr = false, c, cn, cl, token = '';
            // We should be able to detect dateformats within 13 rows
            if (i > 13) {
                return true;
            }
            for (var j = 0; j < columnStr.length; j++) {
                c = columnStr[j];
                cn = columnStr[j + 1];
                cl = columnStr[j - 1];
                if (c === '#') {
                    // Skip the rest of the line - it's a comment
                    return;
                }
                if (c === '"') {
                    if (inStr) {
                        if (cl !== '"' && cn !== '"') {
                            while (cn === ' ' && j < columnStr.length) {
                                cn = columnStr[++j];
                            }
                            // After parsing a string, the next non-blank
                            // should be a delimiter if the CSV is properly
                            // formed.
                            if (typeof potDelimiters[cn] !== 'undefined') {
                                potDelimiters[cn]++;
                            }
                            inStr = false;
                        }
                    }
                    else {
                        inStr = true;
                    }
                }
                else if (typeof potDelimiters[c] !== 'undefined') {
                    token = token.trim();
                    if (!isNaN(Date.parse(token))) {
                        potDelimiters[c]++;
                    }
                    else if (isNaN(Number(token)) ||
                        !isFinite(Number(token))) {
                        potDelimiters[c]++;
                    }
                    token = '';
                }
                else {
                    token += c;
                }
                if (c === ',') {
                    commas++;
                }
                if (c === '.') {
                    points++;
                }
            }
        });
        // Count the potential delimiters.
        // This could be improved by checking if the number of delimiters
        // equals the number of columns - 1
        if (potDelimiters[';'] > potDelimiters[',']) {
            guessed = ';';
        }
        else if (potDelimiters[','] > potDelimiters[';']) {
            guessed = ',';
        }
        else {
            // No good guess could be made..
            guessed = ',';
        }
        // Try to deduce the decimal point if it's not explicitly set.
        // If both commas or points is > 0 there is likely an issue
        if (!this.decimalPoint) {
            if (points > commas) {
                this.decimalPoint = '.';
            }
            else {
                this.decimalPoint = ',';
            }
            // Apply a new decimal regex based on the presumed decimal sep.
            this.decimalRegex = new RegExp('^(-?[0-9]+)' +
                this.decimalPoint +
                '([0-9]+)$');
        }
        return guessed;
    };
    CSVDataStore.prototype.getTable = function () {
        return this.columns ?
            this.dataParser.columnArrayToDataTable(this.columns, this.headers) :
            new DataTable();
    };
    /**
     * Handle polling of live data
     */
    CSVDataStore.prototype.poll = function () {
        var _this = this;
        var updateIntervalMs = (this.dataRefreshRate > 1 ? this.dataRefreshRate : 1) * 1000;
        if (this.enablePolling && this.csvURL === this.liveDataURL) {
            // We need to stop doing this if the URL has changed
            this.liveDataTimeout = setTimeout(function () {
                _this.fetchCSV();
            }, updateIntervalMs);
        }
    };
    CSVDataStore.prototype.fetchCSV = function (initialFetch) {
        var store = this, maxRetries = 3;
        var currentRetries;
        if (initialFetch) {
            clearTimeout(store.liveDataTimeout);
            store.liveDataURL = this.csvURL;
        }
        ajax({
            url: this.csvURL,
            dataType: 'text',
            success: function (csv) {
                fireEvent(store, 'load', { csv: csv }, function () {
                    store.parseCSV(csv);
                    store.poll();
                    fireEvent(store, 'afterLoad', { table: store.getTable() });
                });
            },
            error: function (xhr, text) {
                if (++currentRetries < maxRetries) {
                    store.poll();
                }
                fireEvent(store, 'fail', { error: { xhr: xhr, text: text } });
            }
        });
    };
    CSVDataStore.prototype.load = function () {
        var store = this, csv = store.csv, csvURL = store.csvURL;
        if (csv) {
            fireEvent(store, 'load', { csv: csv }, function () {
                store.parseCSV(csv);
                fireEvent(store, 'afterLoad', { table: store.getTable() });
            });
        }
        else if (csvURL) {
            store.fetchCSV(true);
        }
    };
    CSVDataStore.prototype.save = function () {
    };
    return CSVDataStore;
}(DataStore));
export default CSVDataStore;
