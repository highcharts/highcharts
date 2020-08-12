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
import DataParser from './DataParser.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
var merge = U.merge;
var HTMLTableParser = /** @class */ (function (_super) {
    __extends(HTMLTableParser, _super);
    function HTMLTableParser(dataTable) {
        if (dataTable === void 0) { dataTable = new DataTable(); }
        var _this = _super.call(this) || this;
        _this.dataTable = dataTable;
        _this.options = HTMLTableParser.defaultOptions;
        return _this;
    }
    HTMLTableParser.prototype.parse = function (options) {
        this.options = merge(options, HTMLTableParser.defaultOptions);
        var columns = [], headers = [], store = this, _a = store.options, startRow = _a.startRow, endRow = _a.endRow, startColumn = _a.startColumn, endColumn = _a.endColumn, tableElement = _a.tableElement;
        if (!(tableElement instanceof HTMLElement)) {
            this.emit({
                type: 'parseError',
                columns: columns,
                headers: headers,
                error: 'Not a valid HTML Table'
            });
            return;
        }
        var colsCount, rowNo, colNo, item;
        var rows = tableElement.getElementsByTagName('tr'), rowsCount = rows.length;
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
    HTMLTableParser.defaultOptions = {
        startColumn: 0,
        endColumn: Number.MAX_VALUE,
        startRow: 0,
        endRow: Number.MAX_VALUE,
        firstRowAsNames: true
    };
    return HTMLTableParser;
}(DataParser));
export default HTMLTableParser;
