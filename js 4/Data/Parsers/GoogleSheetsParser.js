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
 *  - Gøran Slettemark
 *  - Wojciech Chmiel
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
var merge = U.merge, uniqueKey = U.uniqueKey;
/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */
/* *
 *
 *  Class
 *
 * */
/**
 * Handles parsing and transformation of an Google Sheets to a table.
 *
 * @private
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
                    if (cellInner.$t.indexOf('/') >= 0 || (cellInner.$t.indexOf('-') >= 0 &&
                        cellInner.$t.indexOf('.') === -1)) {
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
        var parser = this, parserOptions = merge(true, parser.options, { json: jsonProp }), converter = parser.converter, json = parserOptions.json, cells = json.feed.entry, headers = parser.headers;
        var column;
        if (!cells || cells.length === 0) {
            return false;
        }
        parser.headers = [];
        parser.columns = [];
        parser.emit({
            type: 'parse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.headers
        });
        parser.columns = parser.getSheetColumns(json);
        for (var i = 0, iEnd = parser.columns.length; i < iEnd; i++) {
            column = parser.columns[i];
            parser.headers[i] = parserOptions.firstRowAsNames ?
                column.splice(0, 1).toString() :
                uniqueKey();
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
        parser.emit({
            type: 'afterParse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.headers
        });
    };
    /**
     * Handles converting the parsed data to a table.
     *
     * @return {DataTable}
     * Table from the parsed Google Sheet
     */
    GoogleSheetsParser.prototype.getTable = function () {
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
    GoogleSheetsParser.defaultOptions = __assign(__assign({}, DataParser.defaultOptions), { json: {} });
    return GoogleSheetsParser;
}(DataParser));
/* *
 *
 *  Export
 *
 * */
export default GoogleSheetsParser;
