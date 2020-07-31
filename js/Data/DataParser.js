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
import DataTable from './DataTable.js';
import DataRow from './DataRow.js';
import U from '../Core/Utilities.js';
var uniqueKey = U.uniqueKey;
var DataParser = /** @class */ (function () {
    function DataParser() {
    }
    /**
     * Functions
     */
    DataParser.prototype.columnArrayToDataTable = function (columns, headers) {
        if (headers === void 0) { headers = []; }
        var table = new DataTable();
        var columnsLength = columns.length;
        if (columnsLength) {
            var rowsLength = columns[0].length;
            for (var i = 0; i < rowsLength; ++i) {
                var row = new DataRow();
                for (var j = 0; j < columnsLength; ++j) {
                    row.insertColumn((headers.length ? headers[j] : uniqueKey()), columns[j][i]);
                }
                table.insertRow(row);
            }
        }
        return table;
    };
    return DataParser;
}());
export default DataParser;
