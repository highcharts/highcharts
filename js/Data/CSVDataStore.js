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
import ajaxModule from '../Mixins/Ajax.js';
var ajax = ajaxModule.ajax;
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
        _this.dataRefreshRate = options.dataRefreshRate || 1;
        _this.decimalPoint = options.decimalPoint || '.';
        _this.itemDelimiter = options.itemDelimiter;
        _this.lineDelimiter = options.lineDelimiter || '\n';
        _this.firstRowAsNames = options.firstRowAsNames || true;
        _this.startRow = options.startRow || 0;
        _this.endRow = options.endRow || Number.MAX_VALUE;
        _this.startColumn = options.startColumn || 0;
        _this.endColumn = options.endColumn || Number.MAX_VALUE;
        _this.dataParser = new DataParser();
        return _this;
    }
    /**
    * Parse a CSV input string
    * @todo simplify
    *
    * @function Highcharts.Data#parseCSV
    * @return {Array<Array<Highcharts.DataValueType>>}
    */
    CSVDataStore.prototype.parseCSV = function () {
        var csv = this.csv, columns, startRow = (typeof this.startRow !== 'undefined' && this.startRow ?
            this.startRow :
            0), endRow = this.endRow || Number.MAX_VALUE, startColumn = (typeof this.startColumn !== 'undefined' &&
            this.startColumn) ? this.startColumn : 0, endColumn = this.endColumn || Number.MAX_VALUE, itemDelimiter, lines, rowIt = 0, dataTypes = [];
        columns = [];
        /**
         * Parse a single row.
         * @private
         */
        function parseRow(columnStr, rowNumber, noAdd, callbacks) {
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
            function pushType(type) {
                if (dataTypes.length < column + 1) {
                    dataTypes.push([type]);
                }
                if (dataTypes[column][dataTypes[column].length - 1] !== type) {
                    dataTypes[column].push(type);
                }
            }
            /**
             * @private
             */
            function push() {
                if (startColumn > actualColumn || actualColumn > endColumn) {
                    // Skip this column, but increment the column count (#7272)
                    ++actualColumn;
                    token = '';
                    return;
                }
                if (!isNaN(parseFloat(token)) && isFinite(token)) {
                    token = parseFloat(token);
                    pushType('number');
                }
                else if (!isNaN(Date.parse(token))) {
                    token = token.replace(/\//g, '-');
                    pushType('date');
                }
                else {
                    pushType('string');
                }
                if (columns.length < column + 1) {
                    columns.push([]);
                }
                if (!noAdd) {
                    // Don't push - if there's a varrying amount of columns
                    // for each row, pushing will skew everything down n slots
                    columns[column][rowNumber] = token;
                }
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
                    // Perform "plugin" handling
                }
                else if (callbacks && callbacks[c]) {
                    if (callbacks[c](c, token)) {
                        push();
                    }
                    // Delimiter - push current token
                }
                else if (c === itemDelimiter) {
                    push();
                    // Actual column data
                }
                else {
                    token += c;
                }
            }
            push();
        }
        if (csv && this.beforeParse) {
            csv = this.beforeParse(csv);
        }
        if (csv) {
            lines = csv
                .replace(/\r\n/g, '\n') // Unix
                .replace(/\r/g, '\n') // Mac
                .split(this.lineDelimiter);
            if (!startRow || startRow < 0) {
                startRow = 0;
            }
            if (!endRow || endRow >= lines.length) {
                endRow = lines.length - 1;
            }
            if (this.itemDelimiter) {
                itemDelimiter = this.itemDelimiter;
            }
            else {
                itemDelimiter = null;
                itemDelimiter = this.guessDelimiter(lines);
            }
            var offset = 0;
            for (rowIt = startRow; rowIt <= endRow; rowIt++) {
                if (lines[rowIt][0] === '#') {
                    offset++;
                }
                else {
                    parseRow(lines[rowIt], rowIt - startRow - offset);
                }
            }
        }
        var headers = [];
        if (this.firstRowAsNames) {
            columns.forEach(function name(col) {
                headers.push('' + col[0]);
            });
        }
        return this.dataParser.columnArrayToDataTable(columns, headers);
    };
    CSVDataStore.prototype.guessDelimiter = function (lines) {
        var points = 0, commas = 0, guessed = false;
        var potDelimiters = {
            ',': 0,
            ';': 0,
            '\t': 0
        };
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
                    else if (isNaN(token) ||
                        !isFinite(token)) {
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
    // TODO
    CSVDataStore.prototype.fetchCSV = function () {
        ajax({
            url: this.csvURL,
            dataType: 'text',
            data: this.csv,
            success: function (csv) {
            },
            error: function (xhr, text) {
            }
        });
    };
    // TODO: handle csv from URL
    CSVDataStore.prototype.load = function () {
        if (this.csv) {
            this.rows = this.parseCSV();
        }
        else if (this.csvURL) {
            this.fetchCSV();
        }
    };
    CSVDataStore.prototype.save = function () {
    };
    return CSVDataStore;
}(DataStore));
export default CSVDataStore;
