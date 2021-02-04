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

import type DataEventEmitter from './DataEventEmitter';
import type LineSeries from '../Series/Line/LineSeries';
import type PointOptions from '../Core/Series/PointOptions';
import type SeriesOptions from '../Core/Series/SeriesOptions';
import DataTable from './DataTable.js';
import DataTableRow from './DataTableRow.js';
import U from '../Core/Utilities.js';
const {
    defined,
    uniqueKey
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Class to convert Highcharts series data to DataTable
 * and get series data from the DataTable.
 */
class DataSeriesConverter {

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
    public constructor(table: DataTable = new DataTable(), options: DataSeriesConverter.Options) {
        this.table = table;
        this.options = options;
        this.seriesPointArrayMaps = {};
        this.seriesIds = [];
    }

    /* *
     *
     *  Properties
     *
     * */

    public table: DataTable;
    public options: DataSeriesConverter.Options;

    /**
     * Stored series PointArrayMaps.
     */
    public seriesPointArrayMaps: Record<string, string | Array<string>>;

    /**
     * Stored series ids.
     */
    public seriesIds: Array<string>;

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
    getSeriesData(seriesId: string): Array<PointOptions> {
        const converter = this,
            table = converter.table,
            options = converter.options || {},
            columnMap = options.columnMap || {},
            seriesData = [],
            pointArrayMap = converter.seriesPointArrayMaps[seriesId] || ['y'];

        let pointOptions: Record<string, number>,
            row,
            cellName,
            cell,
            mappedProp,
            isCellFound;

        if (seriesId) {
            for (let i = 0, iEnd = table.getRowCount(); i < iEnd; i++) {
                row = table.getRow(i);

                if (row) {
                    isCellFound = false;
                    pointOptions = {
                        x: table.converter.asNumber(row.getCell('x'))
                    };

                    for (let j = 0, jEnd = pointArrayMap.length; j < jEnd; j++) {
                        mappedProp = columnMap[pointArrayMap[j]];
                        cellName = (mappedProp ? mappedProp : pointArrayMap[j]) + '_' + seriesId;
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
    }

    /**
     * Get all series data stored in the converter DataTable.
     *
     * @return {Array<SeriesOptions>}
     * Returns an array of series opitons.
     */
    getAllSeriesData(): Array<SeriesOptions> {
        const converter = this,
            seriesOptions: Array<SeriesOptions> = [];

        let id;

        for (let i = 0, iEnd = converter.seriesIds.length; i < iEnd; i++) {
            id = converter.seriesIds[i];

            seriesOptions.push({
                id: id,
                data: converter.getSeriesData(id)
            });
        }

        return seriesOptions;
    }

    /**
     * Update the converter DataTable with passed series options.
     *
     * @param {Array<LineSeries>} allSeries
     * Array of series options to store in the converter DataTable.
     *
     * @param {DataEventEmitter.EventDetail} eventDetail
     * Custom information for pending events.
     */
    updateDataTable(
        allSeries: Array<LineSeries>,
        eventDetail?: DataEventEmitter.EventDetail
    ): void {
        const table = this.table,
            columnMap = (this.options || {}).columnMap || {};

        let columns: Record<string, DataTableRow.CellType>,
            series,
            pointArrayMap,
            pointArrayMapLength,
            options,
            keys,
            data,
            elem,
            row,
            y,
            needsArrayMap,
            xIndex,
            yIndex,
            yValueName,
            yValueIndex,
            yValueId,
            id;

        if (allSeries && allSeries.length) {
            this.seriesIds = [];
            this.seriesPointArrayMaps = {};

            for (let i = 0, iEnd = allSeries.length; i < iEnd; i++) {
                series = allSeries[i];
                // Add a unique ID to the series if none is assigned.
                series.id = defined(series.id) ? series.id : uniqueKey();
                yValueId = '_' + series.id;
                pointArrayMap = series.pointArrayMap || ['y'];
                pointArrayMapLength = pointArrayMap.length;
                options = series.options;
                keys = options.keys;
                data = series.options.data || [];

                this.seriesIds.push(series.id);
                this.seriesPointArrayMaps[series.id] = pointArrayMap;

                for (let j = 0, jEnd = data.length; j < jEnd; j++) {
                    elem = data[j];
                    y = columnMap.y ? columnMap.y + yValueId : 'y' + yValueId;
                    columns = {};
                    needsArrayMap = pointArrayMapLength > 1;

                    if (typeof elem === 'number') {
                        columns[y] = elem;
                        columns.x = j;
                    } else if (elem instanceof Array) {
                        xIndex = keys && keys.indexOf('x') > -1 ? keys.indexOf('x') : 0;
                        yIndex = keys && keys.indexOf('y') > -1 ? keys.indexOf('y') : 1;

                        if (needsArrayMap) {
                            for (let k = 0; k < pointArrayMapLength; k++) {
                                yValueIndex = keys && keys.indexOf(pointArrayMap[k]) > -1 ?
                                    keys.indexOf(pointArrayMap[k]) : k + elem.length -
                                        pointArrayMapLength;

                                yValueName = columnMap[pointArrayMap[k]] ?
                                    columnMap[pointArrayMap[k]] : pointArrayMap[k];
                                columns[yValueName + yValueId] = elem[yValueIndex];
                            }
                        } else {
                            columns[y] = elem[yIndex];
                        }

                        columns.x = elem.length - pointArrayMapLength > 0 ? elem[xIndex] : j;

                    } else if (elem instanceof Object) {
                        if (needsArrayMap) {
                            const elemSet = elem as Record<string, DataTableRow.CellType>;

                            for (let k = 0; k < pointArrayMapLength; k++) {
                                yValueName = columnMap[pointArrayMap[k]] ?
                                    columnMap[pointArrayMap[k]] : pointArrayMap[k];
                                columns[yValueName + yValueId] = elemSet[yValueName];
                            }
                        } else {
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
                    } else if (columns[y]) {
                        row.insertCell(y, columns[y], eventDetail);
                    }
                }
            }
        }
    }
}
/* *
 *
 *  Namespace
 *
 * */
namespace DataSeriesConverter {
    export interface Options {
        type?: string;
        columnMap?: Record<string, string>;
    }
}
/* *
 *
 *  Export
 *
 * */
export default DataSeriesConverter;
