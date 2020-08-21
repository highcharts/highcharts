/* *
 *
 *  Data Layer
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
import DataJSON from '../DataJSON.js';
import DataParser from './DataParser.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */
/**
 * Handles parsing and transforming CSV to a DataTable
 */
var CSVDataParser = /** @class */ (function (_super) {
    __extends(CSVDataParser, _super);
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Constructs an instance of the CSV parser.
     *
     * @param {CSVDataParser.ClassJSONOptions} [options]
     * Options for the CSV parser.
     */
    function CSVDataParser(options) {
        var _this = _super.call(this) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.columns = [];
        _this.headers = [];
        _this.options = merge(CSVDataParser.defaultOptions, options);
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Creates a CSVDataParser instance from ClassJSON.
     *
     * @param {CSVDataParser.ClassJSON} json
     * Class JSON to convert to the parser instance.
     *
     * @return {CSVDataParser}
     * An instance of CSVDataParser.
     */
    CSVDataParser.fromJSON = function (json) {
        return new CSVDataParser(json.options);
    };
    /**
     * Initiates parsing of CSV
     *
     * @param {CSVDataParser.OptionsType}[options]
     * Options for the parser
     *
     * @emits CSVDataParser#parse
     * @emits CSVDataParser#afterParse
     */
    CSVDataParser.prototype.parse = function (options) {
        var parser = this, parserOptions = merge(this.options, options), beforeParse = parserOptions.beforeParse, lineDelimiter = parserOptions.lineDelimiter, firstRowAsNames = parserOptions.firstRowAsNames, itemDelimiter = parserOptions.itemDelimiter;
        var lines, rowIt = 0, csv = parserOptions.csv, startRow = parserOptions.startRow, endRow = parserOptions.endRow, i, colsCount;
        this.columns = [];
        this.emit({ type: 'parse', columns: parser.columns, headers: parser.headers });
        if (csv && beforeParse) {
            csv = beforeParse(csv);
        }
        if (csv) {
            lines = csv
                .replace(/\r\n/g, '\n') // Unix
                .replace(/\r/g, '\n') // Mac
                .split(lineDelimiter);
            if (!startRow || startRow < 0) {
                startRow = 0;
            }
            if (!endRow || endRow >= lines.length) {
                endRow = lines.length - 1;
            }
            if (!itemDelimiter) {
                parser.guessedItemDelimiter = parser.guessDelimiter(lines);
            }
            var offset = 0;
            for (rowIt = startRow; rowIt <= endRow; rowIt++) {
                if (lines[rowIt][0] === '#') {
                    offset++;
                }
                else {
                    parser.parseCSVRow(lines[rowIt], rowIt - startRow - offset);
                }
            }
        }
        if (firstRowAsNames && parser.columns) {
            colsCount = parser.columns.length;
            for (i = 0; i < colsCount; i++) {
                if (!parser.headers) {
                    parser.headers = [];
                }
                parser.headers[i] = '' + parser.columns[i][0];
            }
        }
        parser.emit({ type: 'afterParse', columns: parser.columns, headers: parser.headers });
    };
    /**
     * Internal method that parses a single CSV row
     */
    CSVDataParser.prototype.parseCSVRow = function (columnStr, rowNumber) {
        var parser = this, columns = parser.columns || [], _a = parser.options, startColumn = _a.startColumn, endColumn = _a.endColumn, itemDelimiter = parser.options.itemDelimiter || parser.guessedItemDelimiter;
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
            if (startColumn > actualColumn || actualColumn > endColumn) {
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
            else if (c === itemDelimiter) {
                push();
                // Actual column data
            }
            else {
                token += c;
            }
        }
        push();
    };
    /**
     * Internal method that guesses the delimiter from the first
     * 13 lines of the CSV
     * @param {Array<string>} lines
     * The CSV, split into lines
     */
    CSVDataParser.prototype.guessDelimiter = function (lines) {
        var decimalPoint = this.options.decimalPoint;
        var points = 0, commas = 0, guessed;
        var potDelimiters = {
            ',': 0,
            ';': 0,
            '\t': 0
        }, linesCount = lines.length;
        for (var i = 0; i < linesCount; i++) {
            var inStr = false, c, cn, cl, token = '';
            // We should be able to detect dateformats within 13 rows
            if (i > 13) {
                break;
            }
            var columnStr = lines[i];
            for (var j = 0; j < columnStr.length; j++) {
                c = columnStr[j];
                cn = columnStr[j + 1];
                cl = columnStr[j - 1];
                if (c === '#') {
                    // Skip the rest of the line - it's a comment
                    break;
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
        }
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
        if (!decimalPoint) {
            if (points > commas) {
                this.guessedDecimalPoint = '.';
            }
            else {
                this.guessedDecimalPoint = ',';
            }
            // Apply a new decimal regex based on the presumed decimal sep.
            this.decimalRegex = new RegExp('^(-?[0-9]+)' +
                decimalPoint +
                '([0-9]+)$');
        }
        return guessed;
    };
    /**
     * Handles converting the parsed data to a DataTable
     *
     * @returns {DataTable}
     * A DataTable from the parsed CSV
     */
    CSVDataParser.prototype.getTable = function () {
        return DataTable.fromColumns(this.columns, this.headers);
    };
    /**
     * Converts the parser instance to ClassJSON.
     *
     * @returns {CSVDataParser.ClassJSON}
     * ClassJSON from the parser instance.
     */
    CSVDataParser.prototype.toJSON = function () {
        var parser = this, options = parser.options, json = {
            $class: 'CSVDataParser',
            options: options
        };
        return json;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Default options
     */
    CSVDataParser.defaultOptions = __assign(__assign({}, DataParser.defaultOptions), { decimalPoint: '.', lineDelimiter: '\n' });
    return CSVDataParser;
}(DataParser));
/* *
 *
 *  Register
 *
 * */
DataJSON.addClass(CSVDataParser);
/* *
 *
 *  Export
 *
 * */
export default CSVDataParser;
