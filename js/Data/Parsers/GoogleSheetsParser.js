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
import DataConverter from '../DataConverter.js';
import U from '../../Core/Utilities.js';
var merge = U.merge, uniqueKey = U.uniqueKey;
/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */
/* *
 *
 *  Class
 *
 * */
/**
 * Handles parsing and transformation of an Google Sheets to a DataTable
 */
var GoogleSheetsParser = /** @class */ (function (_super) {
    __extends(GoogleSheetsParser, _super);
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Constructs an instance of the GoogleSheetsParser.
     *
     * @param {GoogleSheetsParser.OptionsType} [options]
     * Options for the Google Sheets parser.
     *
     * @param {DataConverter} converter
     * Parser data converter.
     */
    function GoogleSheetsParser(options, converter) {
        var _this = _super.call(this) || this;
        _this.columns = [];
        _this.headers = [];
        _this.options = merge(GoogleSheetsParser.defaultOptions, options);
        _this.converter = converter || new DataConverter();
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Creates a GoogleSheetsParser instance from ClassJSON.
     *
     * @param {GoogleSheetsParser.ClassJSON} json
     * Class JSON to convert to the parser instance.
     *
     * @return {GoogleSheetsParser}
     * An instance of GoogleSheetsParser.
     */
    GoogleSheetsParser.fromJSON = function (json) {
        return new GoogleSheetsParser(json.options);
    };
    /* *
     *
     *  Functions
     *
     * */
    GoogleSheetsParser.prototype.getSheetColumns = function (json) {
        var parser = this, _a = parser.options, startColumn = _a.startColumn, endColumn = _a.endColumn, startRow = _a.startRow, endRow = _a.endRow, columns = [], cells = json.feed.entry, cellCount = (cells || []).length;
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
    /**
     * Initiates the parsing of the Google Sheet
     *
     * @param {GoogleSheetsParser.OptionsType}[options]
     * Options for the parser
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits GoogleSheetsParser#parse
     * @emits GoogleSheetsParser#afterParse
     */
    GoogleSheetsParser.prototype.parse = function (jsonProp, eventDetail) {
        var _a;
        var parser = this, parserOptions = merge(true, parser.options, { json: jsonProp }), converter = parser.converter, json = parserOptions.json, cells = json.feed.entry, headers = parser.headers;
        var column;
        if (!cells || cells.length === 0) {
            return false;
        }
        parser.emit({
            type: 'parse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.headers
        });
        parser.columns = parser.getSheetColumns(json);
        for (var i = 0, iEnd = parser.columns.length; i < iEnd; i++) {
            headers.push(((_a = parser.columns[i][0]) === null || _a === void 0 ? void 0 : _a.toString()) || uniqueKey());
            column = parser.columns[i];
            for (var j = 0, jEnd = column.length; j < jEnd; ++j) {
                if (column[j] && typeof column[j] === 'string') {
                    parser.columns[i][j] = converter.asGuessedType(column[j]);
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
     * Handles converting the parsed data to a DataTable
     *
     * @return {DataTable}
     * A DataTable from the parsed Google Sheet
     */
    GoogleSheetsParser.prototype.getTable = function () {
        return DataParser.getTableFromColumns(this.columns, this.headers);
    };
    /**
     * Converts the parser instance to ClassJSON.
     *
     * @return {GoogleSheetsParser.ClassJSON}
     * ClassJSON from the parser instance.
     */
    GoogleSheetsParser.prototype.toJSON = function () {
        var parser = this, json = {
            $class: 'GoogleSheetsParser',
            options: parser.options
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
    GoogleSheetsParser.defaultOptions = __assign(__assign({}, DataParser.defaultOptions), { json: {} });
    return GoogleSheetsParser;
}(DataParser));
/* *
 *
 *  Register
 *
 * */
DataJSON.addClass(GoogleSheetsParser);
/* *
 *
 *  Export
 *
 * */
export default GoogleSheetsParser;
