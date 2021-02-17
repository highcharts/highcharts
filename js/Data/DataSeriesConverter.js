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
import DataTable from './DataTable.js';
import DataTableRow from './DataTableRow.js';
import U from '../Core/Utilities.js';
var defined = U.defined, uniqueKey = U.uniqueKey;
/* *
 *
 *  Class
 *
 * */
/**
 * Class to convert Highcharts series data to DataTable
 * and get series data from the DataTable.
 */
var DataSeriesConverter = /** @class */ (function () {
    /* *
     *
     *  Constructor
     *
     * */
    /**
     * Constructs an instance of the DataSeriesConverter class.
     *
     * @param {DataTable} [table]
     * DataSeriesConverter table to store series data.
     *
     * @param {DataSeriesConverter.Options} [options]
     * DataSeriesConverter options.
     */
    function DataSeriesConverter(table, options) {
        if (table === void 0) { table = new DataTable(); }
        if (options === void 0) { options = {}; }
        this.table = table;
        this.options = options;
        this.seriesIdMap = {};
        this.seriesMeta = [];
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Get the specific series data stored in the converter DataTable.
     *
     * @param {string} seriesId
     * The id of the series.
     *
     * @return {Array<PointOptions>}
     * Returns an array of series points opitons.
     */
    DataSeriesConverter.prototype.getSeriesData = function (seriesId) {
        var converter = this, table = converter.table, seriesData = [];
        var pointOptions, row, cellName, cell, isCellFound, pointArrayMap;
        if (seriesId) {
            pointArrayMap = converter.seriesIdMap[seriesId].pointArrayMap || ['y'];
            for (var i = 0, iEnd = table.getRowCount(); i < iEnd; i++) {
                row = table.getRow(i);
                if (row) {
                    isCellFound = false;
                    pointOptions = {
                        x: table.converter.asNumber(row.getCell('x'))
                    };
                    for (var j = 0, jEnd = pointArrayMap.length; j < jEnd; j++) {
                        cellName = pointArrayMap[j] + '_' + seriesId;
                        cell = row.getCell(cellName);
                        if (cell) {
                            isCellFound = true;
                            pointOptions[pointArrayMap[j]] = table.converter.asNumber(cell);
                        }
                    }
                    if (isCellFound) {
                        seriesData.push(pointOptions);
                    }
                }
            }
        }
        return seriesData;
    };
    /**
     * Get all series data stored in the converter DataTable.
     *
     * @return {Array<SeriesOptions>}
     * Returns an array of series opitons.
     */
    DataSeriesConverter.prototype.getAllSeriesData = function () {
        var converter = this, seriesOptions = [];
        var id;
        for (var i = 0, iEnd = converter.seriesMeta.length; i < iEnd; i++) {
            id = converter.seriesMeta[i].id;
            seriesOptions.push({
                id: id,
                data: converter.getSeriesData(id)
            });
        }
        return seriesOptions;
    };
    /**
     * Update the converter DataTable with passed series options.
     *
     * @param {Array<LineSeries>} allSeries
     * Array of series options to store in the converter DataTable.
     *
     * @param {DataEventEmitter.EventDetail} eventDetail
     * Custom information for pending events.
     */
    DataSeriesConverter.prototype.updateDataTable = function (allSeries, eventDetail) {
        var table = this.table;
        var columns, series, seriesMeta, pointArrayMap, pointArrayMapLength, options, keys, data, elem, row, y, needsArrayMap, xIndex, yIndex, yValueName, yValueIndex, yValueId, id;
        if (allSeries && allSeries.length) {
            this.options.seriesOptions = [];
            this.seriesMeta = [];
            this.seriesIdMap = {};
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
                seriesMeta = {
                    id: series.id,
                    pointArrayMap: pointArrayMap,
                    options: series.options
                };
                this.options.seriesOptions.push(series.options);
                this.seriesMeta.push(seriesMeta);
                this.seriesIdMap[series.id] = seriesMeta;
                for (var j = 0, jEnd = data.length; j < jEnd; j++) {
                    elem = data[j];
                    y = 'y' + yValueId;
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
                                    keys.indexOf(pointArrayMap[k]) : k + elem.length -
                                    pointArrayMapLength;
                                yValueName = pointArrayMap[k];
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
                                yValueName = pointArrayMap[k];
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
                        row.setCell(y, columns[y], eventDetail);
                    }
                }
            }
        }
    };
    return DataSeriesConverter;
}());
/* *
 *
 *  Export
 *
 * */
export default DataSeriesConverter;
