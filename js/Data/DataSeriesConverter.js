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
/* *
 *
 *  Imports
 *
 * */
import DataTable from './DataTable.js';
import DataTableRow from './DataTableRow.js';
import U from './../Core/Utilities.js';
var defined = U.defined, uniqueKey = U.uniqueKey;
/* *
 *
 *  Class
 *
 * */
/**
 * Class to convert DataTable to Highcharts series data.
 */
var DataSeriesConverter = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    function DataSeriesConverter(table, options) {
        if (table === void 0) { table = new DataTable(); }
        this.table = table;
        this.options = options;
    }
    /* *
     *
     *  Functions
     *
     * */
    DataSeriesConverter.prototype.getSeriesData = function (columnIndex) {
        var table = this.table, options = this.options || {}, dataOptions = [], seriesTypeData = this.getSeriesTypeData(options.type || 'line');
        var row, column;
        for (var i = 0, iEnd = table.getRowCount(); i < iEnd; i++) {
            row = table.getRow(i);
            if (row) {
                column = row.getColumn(columnIndex);
                if (typeof column === 'number') {
                    dataOptions.push(seriesTypeData(column));
                }
            }
        }
        return dataOptions;
    };
    DataSeriesConverter.prototype.getSeriesTypeData = function (type) {
        var fcName;
        switch (type) {
            case 'line':
                fcName = this.getLinePoint;
                break;
            case 'pie':
                fcName = this.getPiePoint;
                break;
            case 'range':
                fcName = this.getRangePoint;
                break;
            default:
                fcName = this.getLinePoint;
                break;
        }
        return fcName;
    };
    DataSeriesConverter.prototype.getLinePoint = function (column) {
        return {
            y: column
        };
    };
    DataSeriesConverter.prototype.getPiePoint = function (column) {
        return {
            y: column
        };
    };
    DataSeriesConverter.prototype.getRangePoint = function (column) {
        return {
            y: column
        };
    };
    DataSeriesConverter.prototype.getAllSeriesData = function () {
        var table = this.table, seriesOptions = [], row = table.getRow(0);
        var seriesData;
        if (row) {
            for (var i = 0, iEnd = row.getColumnCount(); i < iEnd; i++) {
                seriesData = this.getSeriesData(i);
                if (seriesData.length > 0) {
                    seriesOptions.push({
                        data: seriesData
                    });
                }
            }
        }
        return seriesOptions;
    };
    DataSeriesConverter.prototype.setDataTable = function (allSeries, eventDetail) {
        var table = this.table, columnMap = (this.options || {}).columnMap || {};
        var columns, series, pointArrayMap, pointArrayMapLength, options, keys, data, elem, row, y, needsArrayMap, xIndex, yIndex, yValueName, yValueIndex, yValueId, id;
        for (var i = 0, iEnd = allSeries.length; i < iEnd; i++) {
            series = allSeries[i];
            // Add a unique ID to the series if none is assigned.
            series.id = defined(series.id) ? series.id : uniqueKey();
            yValueId = '_' + series.id;
            pointArrayMap = series.pointArrayMap || ['y'];
            pointArrayMapLength = pointArrayMap.length;
            options = series.options;
            keys = options.keys;
            data = series.options.data || [];
            for (var j = 0, jEnd = data.length; j < jEnd; j++) {
                elem = data[j];
                y = columnMap.y ? columnMap.y + yValueId : 'y' + yValueId;
                columns = {};
                needsArrayMap = pointArrayMapLength > 1;
                if (typeof elem === 'number') {
                    columns[y] = elem;
                    columns.x = j;
                }
                else if (elem instanceof Array) {
                    xIndex = keys && keys.indexOf('x') > -1 ? keys.indexOf('x') : 0;
                    yIndex = keys && keys.indexOf('y') > -1 ? keys.indexOf('y') : 1;
                    if (needsArrayMap) {
                        for (var k = 0; k < pointArrayMapLength; k++) {
                            yValueIndex = keys && keys.indexOf(pointArrayMap[k]) > -1 ?
                                keys.indexOf(pointArrayMap[k]) : k + elem.length - pointArrayMapLength;
                            yValueName = columnMap[pointArrayMap[k]] ?
                                columnMap[pointArrayMap[k]] : pointArrayMap[k];
                            columns[yValueName + yValueId] = elem[yValueIndex];
                        }
                    }
                    else {
                        columns[y] = elem[yIndex];
                    }
                    columns.x = elem.length - pointArrayMapLength > 0 ? elem[xIndex] : j;
                }
                else if (elem instanceof Object) {
                    if (needsArrayMap) {
                        var elemSet = elem;
                        for (var k = 0; k < pointArrayMapLength; k++) {
                            yValueName = columnMap[pointArrayMap[k]] ?
                                columnMap[pointArrayMap[k]] : pointArrayMap[k];
                            columns[yValueName + yValueId] = elemSet[yValueName];
                        }
                    }
                    else {
                        columns[y] = elem.y;
                    }
                    columns.x = elem.x || j;
                }
                id = '' + columns.x;
                row = table.getRow(id);
                if (!row) {
                    columns.id = id;
                    row = new DataTableRow(columns);
                    table.insertRow(row, eventDetail);
                }
                else if (columns[y]) {
                    row.insertColumn(y, columns[y], eventDetail);
                }
            }
        }
        return table;
    };
    return DataSeriesConverter;
}());
/* *
 *
 *  Export
 *
 * */
export default DataSeriesConverter;
