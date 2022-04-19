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
var merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/**
 * Handles parsing and transformation of an HTML table to a table.
 *
 * @private
 */
var HTMLTableParser = /** @class */ (function (_super) {
    __extends(HTMLTableParser, _super);
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Constructs an instance of the HTML table parser.
     *
     * @param {HTMLTableParser.OptionsType} [options]
     * Options for the CSV parser.
     *
     * @param {HTMLElement | null} tableElement
     * The HTML table to parse
     *
     * @param {DataConverter} converter
     * Parser data converter.
     */
    function HTMLTableParser(options, tableElement, converter) {
        if (tableElement === void 0) { tableElement = null; }
        var _this = _super.call(this) || this;
        _this.columns = [];
        _this.headers = [];
        _this.options = merge(HTMLTableParser.defaultOptions, options);
        _this.converter = converter || new DataConverter();
        if (tableElement) {
            _this.tableElement = tableElement;
            _this.tableElementID = tableElement.id;
        }
        else if (options && options.tableHTML) {
            _this.tableElement = options.tableHTML;
            _this.tableElementID = options.tableHTML.id;
        }
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Initiates the parsing of the HTML table
     *
     * @param {HTMLTableParser.OptionsType}[options]
     * Options for the parser
     *
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVDataParser#parse
     * @emits CSVDataParser#afterParse
     * @emits HTMLTableParser#parseError
     */
    HTMLTableParser.prototype.parse = function (options, eventDetail) {
        var parser = this, converter = this.converter, columns = [], headers = [], parseOptions = merge(parser.options, options), endRow = parseOptions.endRow, startColumn = parseOptions.startColumn, endColumn = parseOptions.endColumn, firstRowAsNames = parseOptions.firstRowAsNames, tableHTML = parseOptions.tableHTML || this.tableElement;
        if (!(tableHTML instanceof HTMLElement)) {
            parser.emit({
                type: 'parseError',
                columns: columns,
                detail: eventDetail,
                headers: headers,
                error: 'Not a valid HTML Table'
            });
            return;
        }
        parser.tableElement = this.tableElement;
        parser.tableElementID = tableHTML.id;
        this.emit({
            type: 'parse',
            columns: parser.columns,
            detail: eventDetail,
            headers: parser.headers
        });
        var rows = tableHTML.getElementsByTagName('tr'), rowsCount = rows.length;
        var rowIndex = 0, item, startRow = parseOptions.startRow;
        // Insert headers from the first row
        if (firstRowAsNames && rowsCount) {
            var items = rows[0].children, itemsLength = items.length;
            for (var i = startColumn; i < itemsLength; i++) {
                if (i > endColumn) {
                    break;
                }
                item = items[i];
                if (item.tagName === 'TD' ||
                    item.tagName === 'TH') {
                    headers.push(item.innerHTML);
                }
            }
            startRow++;
        }
        while (rowIndex < rowsCount) {
            if (rowIndex >= startRow && rowIndex <= endRow) {
                var columnsInRow = rows[rowIndex].children, columnsInRowLength = columnsInRow.length;
                var columnIndex = 0;
                while (columnIndex < columnsInRowLength) {
                    var relativeColumnIndex = columnIndex - startColumn, row = columns[relativeColumnIndex];
                    item = columnsInRow[columnIndex];
                    if ((item.tagName === 'TD' ||
                        item.tagName === 'TH') &&
                        (columnIndex >= startColumn &&
                            columnIndex <= endColumn)) {
                        if (!columns[relativeColumnIndex]) {
                            columns[relativeColumnIndex] = [];
                        }
                        var cellValue = converter.asGuessedType(item.innerHTML);
                        if (cellValue instanceof Date) {
                            cellValue = cellValue.getTime();
                        }
                        columns[relativeColumnIndex][rowIndex - startRow] = cellValue;
                        // Loop over all previous indices and make sure
                        // they are nulls, not undefined.
                        var i = 1;
                        while (rowIndex - startRow >= i &&
                            row[rowIndex - startRow - i] === void 0) {
                            row[rowIndex - startRow - i] = null;
                            i++;
                        }
                    }
                    columnIndex++;
                }
            }
            rowIndex++;
        }
        this.columns = columns;
        this.headers = headers;
        this.emit({
            type: 'afterParse',
            columns: columns,
            detail: eventDetail,
            headers: headers
        });
    };
    /**
     * Handles converting the parsed data to a table.
     *
     * @return {DataTable}
     * Table from the parsed HTML table
     */
    HTMLTableParser.prototype.getTable = function () {
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
    HTMLTableParser.defaultOptions = __assign({}, DataParser.defaultOptions);
    return HTMLTableParser;
}(DataParser));
/* *
 *
 *  Export
 *
 * */
export default HTMLTableParser;
