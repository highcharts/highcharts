/* *
 *
 *  (c) 2012-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Torstein Hønsi
 *  - Christer Vasseng
 *  - Gøran Slettemark
 *  - Sophie Bremer
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
import DataParser from './DataParser.js';
import DataConverter from '../DataConverter.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */
/**
 * Handles parsing and transforming CSV to a table.
 *
 * @private
 */
var CSVParser = /** @class */ (function (_super) {
    __extends(CSVParser, _super);
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Constructs an instance of the CSV parser.
     *
     * @param {CSVParser.OptionsType} [options]
     * Options for the CSV parser.
     *
     * @param {DataConverter} converter
     * Parser data converter.
     */
    function CSVParser(options, converter) {
        var _this = _super.call(this) || this;
        /* *
         *
         *  Properties
         *
         * */
        _this.columns = [];
        _this.headers = [];
        _this.dataTypes = [];
        _this.options = merge(CSVParser.defaultOptions, options);
        _this.converter = converter || new DataConverter();
        return _this;
    }
    /**
     * Initiates parsing of CSV
     *
     * @param {CSVParser.OptionsType}[options]
     * Options for the parser
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVDataParser#parse
     * @emits CSVDataParser#afterParse
     */
    CSVParser.prototype.parse = function (options, eventDetail) {
        var parser = this, dataTypes = parser.dataTypes, converter = parser.converter, parserOptions = merge(this.options, options), beforeParse = parserOptions.beforeParse, lineDelimiter = parserOptions.lineDelimiter, firstRowAsNames = parserOptions.firstRowAsNames, itemDelimiter = parserOptions.itemDelimiter;
        var lines, rowIt = 0, csv = parserOptions.csv, startRow = parserOptions.startRow, endRow = parserOptions.endRow, column;
        parser.columns = [];
        parser.emit({
            type: 'parse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.headers
        });
        if (csv && beforeParse) {
            csv = beforeParse(csv);
        }
        if (csv) {
            lines = csv
                .replace(/\r\n/g, '\n') // Unix
                .replace(/\r/g, '\n') // Mac
                .split(lineDelimiter || '\n');
            if (!startRow || startRow < 0) {
                startRow = 0;
            }
            if (!endRow || endRow >= lines.length) {
                endRow = lines.length - 1;
            }
            if (!itemDelimiter) {
                parser.guessedItemDelimiter = parser.guessDelimiter(lines);
            }
            // If the first row contain names, add them to the
            // headers array and skip the row.
            if (firstRowAsNames) {
                var headers = lines[0]
                    .split(itemDelimiter || parser.guessedItemDelimiter || ',');
                // Remove ""s from the headers
                for (var i = 0; i < headers.length; i++) {
                    headers[i] = headers[i].replace(/^["']|["']$/g, '');
                }
                parser.headers = headers;
                startRow++;
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
            if (dataTypes.length &&
                dataTypes[0].length &&
                dataTypes[0][1] === 'date' && // format is a string date
                !parser.converter.getDateFormat()) {
                parser.converter.deduceDateFormat(parser.columns[0], null, true);
            }
            // Guess types.
            for (var i = 0, iEnd = parser.columns.length; i < iEnd; ++i) {
                column = parser.columns[i];
                for (var j = 0, jEnd = column.length; j < jEnd; ++j) {
                    if (column[j] && typeof column[j] === 'string') {
                        var cellValue = converter.asGuessedType(column[j]);
                        if (cellValue instanceof Date) {
                            cellValue = cellValue.getTime();
                        }
                        parser.columns[i][j] = cellValue;
                    }
                }
            }
        }
        parser.emit({
            type: 'afterParse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.headers
        });
    };
    /**
     * Internal method that parses a single CSV row
     */
    CSVParser.prototype.parseCSVRow = function (columnStr, rowNumber) {
        var parser = this, converter = this.converter, columns = parser.columns || [], dataTypes = parser.dataTypes, _a = parser.options, startColumn = _a.startColumn, endColumn = _a.endColumn, itemDelimiter = (parser.options.itemDelimiter ||
            parser.guessedItemDelimiter);
        var decimalPoint = parser.options.decimalPoint;
        if (!decimalPoint || decimalPoint === itemDelimiter) {
            decimalPoint = parser.guessedDecimalPoint || '.';
        }
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
            // Save the type of the token.
            if (typeof token === 'string') {
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
            }
            else {
                pushType('number');
            }
            if (columns.length < column + 1) {
                columns.push([]);
            }
            // Try to apply the decimal point, and check if the token then is a
            // number. If not, reapply the initial value
            if (typeof token !== 'number' &&
                converter.guessType(token) !== 'number' &&
                decimalPoint) {
                var initialValue = token;
                token = token.replace(decimalPoint, '.');
                if (converter.guessType(token) !== 'number') {
                    token = initialValue;
                }
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
            if (c === '#') {
                // If there are hexvalues remaining (#13283)
                if (!/^#[0-F]{3,3}|[0-F]{6,6}/i.test(columnStr.substr(i))) {
                    // The rest of the row is a comment
                    push();
                    return;
                }
            }
            // Quoted string
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
    CSVParser.prototype.guessDelimiter = function (lines) {
        var points = 0, commas = 0, guessed;
        var potDelimiters = {
            ',': 0,
            ';': 0,
            '\t': 0
        }, linesCount = lines.length;
        for (var i = 0; i < linesCount; i++) {
            var inStr = false, c = void 0, cn = void 0, cl = void 0, token = '';
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
        if (points > commas) {
            this.guessedDecimalPoint = '.';
        }
        else {
            this.guessedDecimalPoint = ',';
        }
        return guessed;
    };
    /**
     * Handles converting the parsed data to a table.
     *
     * @return {DataTable}
     * Table from the parsed CSV.
     */
    CSVParser.prototype.getTable = function () {
        return DataParser.getTableFromColumns(this.columns, this.headers);
    };
    /* *
     *
     *  Static Properties
     *
     * */
    /**
     * Default options
     */
    CSVParser.defaultOptions = __assign(__assign({}, DataParser.defaultOptions), { lineDelimiter: '\n' });
    return CSVParser;
}(DataParser));
/* *
 *
 *  Export
 *
 * */
export default CSVParser;
