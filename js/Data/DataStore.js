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
var DataStore = /** @class */ (function () {
    /* *
    *
    *  Constructors
    *
    * */
    function DataStore(dataSet) {
        this.rows = dataSet;
        this.metadata = [];
        this.length = this.rows.getRowCount();
    }
    /* *
    *
    *  Functions
    *
    * */
    DataStore.prototype.describeColumn = function (name, metadata) {
        this.metadata.push({
            name: name,
            metadata: metadata
        });
    };
    DataStore.prototype.describe = function (metadata) {
        this.metadata = metadata;
    };
    DataStore.prototype.whatIs = function (name) {
        var metadata = this.metadata;
        var i;
        for (i = 0; i < metadata.length; i++) {
            if (metadata[i].name === name) {
                return metadata[i];
            }
        }
    };
    DataStore.prototype.on = function (event, callback) {
    };
    DataStore.prototype.colsToDataTable = function (cols, headers) {
        if (headers === void 0) { headers = []; }
        var table = new DataTable();
        var noOfCols = cols.length;
        if (noOfCols) {
            var noOfRows = cols[0].length;
            for (var i = 0; i < noOfRows; ++i) {
                var row = new DataRow();
                for (var j = 0; j < noOfCols; ++j) {
                    row.insertColumn((headers.length ? headers[j] : uniqueKey()), cols[j][i]);
                }
                table.insertRow(row);
            }
        }
        return table;
    };
    return DataStore;
}());
export default DataStore;
