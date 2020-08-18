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
import DataJSON from '../DataJSON.js';
import DataParser from './DataParser.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
/* *
 *
 *  Class
 *
 * */
var HTMLTableParser = /** @class */ (function (_super) {
    __extends(HTMLTableParser, _super);
    /* *
     *
     *  Constructor
     *
     * */
    function HTMLTableParser(tableElement, options) {
        if (tableElement === void 0) { tableElement = null; }
        var _this = _super.call(this) || this;
        _this.columns = [];
        _this.headers = [];
        _this.options = merge(HTMLTableParser.defaultOptions, options);
        _this.tableElement = tableElement;
        return _this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    HTMLTableParser.fromJSON = function (json) {
        return new HTMLTableParser(document.getElementById(json.tableElement), json.options);
    };
    /* *
     *
     *  Functions
     *
     * */
    HTMLTableParser.prototype.parse = function (options) {
        var parser = this, columns = [], headers = [], parseOptions = merge(parser.options, options), startRow = parseOptions.startRow, endRow = parseOptions.endRow, startColumn = parseOptions.startColumn, endColumn = parseOptions.endColumn, tableHTML = parseOptions.tableHTML;
        if (!(tableHTML instanceof HTMLElement)) {
            parser.emit({
                type: 'parseError',
                columns: columns,
                headers: headers,
                error: 'Not a valid HTML Table'
            });
            return;
        }
        var colsCount, rowNo, colNo, item;
        var rows = tableHTML.getElementsByTagName('tr'), rowsCount = rows.length;
        rowNo = 0;
        while (rowNo < rowsCount) {
            if (rowNo >= startRow && rowNo <= endRow) {
                var cols = rows[rowNo].children;
                colsCount = cols.length;
                colNo = 0;
                while (colNo < colsCount) {
                    var row = columns[colNo - startColumn];
                    item = cols[colNo];
                    var i = 1;
                    if ((item.tagName === 'TD' ||
                        item.tagName === 'TH') &&
                        colNo >= startColumn &&
                        colNo <= endColumn) {
                        if (!columns[colNo - startColumn]) {
                            columns[colNo - startColumn] = [];
                        }
                        if (item.tagName === 'TH') {
                            headers.push(item.innerHTML);
                        }
                        columns[colNo - startColumn][rowNo - startRow] = item.innerHTML;
                        // Loop over all previous indices and make sure
                        // they are nulls, not undefined.
                        while (rowNo - startRow >= i &&
                            row[rowNo - startRow - i] === void 0) {
                            row[rowNo - startRow - i] = null;
                            i++;
                        }
                    }
                    colNo++;
                }
            }
            rowNo++;
        }
        this.columns = columns;
        this.headers = headers;
    };
    HTMLTableParser.prototype.getTable = function () {
        return DataTable.fromColumns(this.columns, this.headers);
    };
    HTMLTableParser.prototype.toJSON = function () {
        var parser = this, options = parser.options, tableElement = parser.tableElement, json = {
            $class: 'HTMLTableParser',
            options: options,
            tableElement: (tableElement &&
                tableElement.getAttribute('id') ||
                '')
        };
        return json;
    };
    /* *
     *
     *  Static Properties
     *
     * */
    HTMLTableParser.defaultOptions = DataParser.defaultOptions;
    return HTMLTableParser;
}(DataParser));
/* *
 *
 *  Register
 *
 * */
DataJSON.addClass(HTMLTableParser);
/* *
 *
 *  Export
 *
 * */
export default HTMLTableParser;
