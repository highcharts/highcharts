/* *
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../Animation/AnimationOptions';
import type {
    PointOptions,
    PointShortOptions
} from './PointOptions';
import type Series from './Series';

import DataTable from '../../Data/DataTable.js';
import H from '../Globals.js';
const { composed } = H;
import U from '../Utilities.js';
const {
    addEvent,
    fireEvent,
    isNumber,
    merge,
    pushUnique,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module './SeriesBase' {
    interface SeriesBase {
        datas?: DataSeriesAdditions;
    }
}

// Unmark as internal when in the future.
/** @internal */
declare module './SeriesOptions' {
    interface SeriesOptions {
        /* *
        * Indicates data is structured as columns instead of rows.
        *
        * @type      {boolean}
        * @since     Future
        * @apioption plotOptions.series.dataAsColumns
        */
        dataAsColumns?: boolean;
    }
}

/** @internal */
export declare class DataSeriesComposition extends Series {
    datas: DataSeriesAdditions;
}

/* *
 *
 *  Functions
 *
 * */

/** @internal */
function wrapSeriesGeneratePoints(
    this: DataSeriesComposition,
    proceed: DataSeriesComposition['generatePoints']
): void {
    if (this.hasGroupedData) {
        return proceed.call(this);
    }

    const PointClass = this.pointClass,
        cropStart = this.cropStart || 0,
        data = this.data || [],
        points = [],
        processedXData = this.getColumn('x', true),
        processedYData = this.getColumn('y', true);

    let cursor: number,
        point: typeof PointClass.prototype;

    for (let i = 0, iEnd = processedXData.length; i < iEnd; ++i) {
        cursor = cropStart + i;
        point = data[cursor];
        if (!point) {
            point = data[cursor] = new PointClass(
                this,
                processedYData[cursor],
                processedXData[i]
            );
        }
        point.index = cursor;
        points[i] = point;
    }

    this.data = data;
    this.points = points;

    fireEvent(this, 'afterGeneratePoints');
}

/** @internal */
function wrapSeriesSetData(
    this: DataSeriesComposition,
    proceed: DataSeriesComposition['setData'],
    data: Array<(PointOptions|PointShortOptions)> = [],
    redraw: boolean = true,
    animation?: (boolean|Partial<AnimationOptions>)
): void {
    const datas = this.datas;

    if (this.hasGroupedData || !this.options.dataAsColumns) {
        return proceed.call(this, data, redraw, animation);
    }

    data = this.options.data = this.userOptions.data = (
        this.chart.options.chart.allowMutatingData ?
            (data || []) :
            merge(true, data)
    );

    const columns: DataTable.ColumnCollection = {},
        keys = (this.options.keys || this.parallelArrays).slice();

    if (isNumber(data[0]) || keys.length === 1) {
        // First column is implicit index
        const xData: Array<number> = columns.x = [];
        for (let i = 0, iEnd = data.length; i < iEnd; ++i) {
            xData.push(this.autoIncrement());
        }
        columns[keys[1] || 'y'] = data as Array<number>;
    } else {
        if (keys.indexOf('x') === -1 && keys.length > data.length) {
            // First column is implicit index
            const xData: Array<number> = columns.x = [];
            for (let i = 0, iEnd = data.length; i < iEnd; ++i) {
                xData.push(this.autoIncrement());
            }
        }
        for (
            let i = 0,
                iEnd = Math.min(data.length, keys.length);
            i < iEnd;
            ++i
        ) {
            if (data[i] instanceof Array) {
                columns[keys[i]] = data[i] as Array<DataTable.CellType>;
            }
        }
    }

    datas.setTable(new DataTable({ columns, id: this.name }));
}

/* *
 *
 *  Class
 *
 * */

/** @internal */
class DataSeriesAdditions {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * @internal
     */
    public static compose(
        SeriesClass: typeof Series
    ): void {

        if (pushUnique(composed, 'Core.DataSeries')) {
            const seriesProto = SeriesClass.prototype as DataSeriesComposition;

            addEvent(SeriesClass, 'init', function (): void {
                this.datas = new DataSeriesAdditions(
                    this as DataSeriesComposition
                );
            });

            wrap(seriesProto, 'generatePoints', wrapSeriesGeneratePoints);
            wrap(seriesProto, 'setData', wrapSeriesSetData);
        }

    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        series: DataSeriesComposition
    ) {
        const columns: DataTable.ColumnCollection = {},
            keys = series.parallelArrays;

        for (let i = 0, iEnd = keys.length; i < iEnd; ++i) {
            columns[keys[i]] = [];
        }

        this.series = series;
        this.table = new DataTable();
    }

    /* *
     *
     *  Properties
     *
     * */

    private indexAsX?: boolean;

    public series: DataSeriesComposition;

    public table: DataTable;

    private unlisteners: Array<Function> = [];

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Triggers processing and redrawing
     * @internal
     */
    public processTable(
        redraw?: boolean,
        animation?: (boolean|Partial<AnimationOptions>)
    ): void {
        const series = this.series;

        if (series.options.legendType === 'point') {
            series.processData();
            series.generatePoints();
        }

        if (redraw) {
            const chart = series.chart;

            series.isDirty = chart.isDirtyBox = true;
            series.isDirtyData = true;

            chart.redraw(animation);
        }
    }

    /**
     * Experimental integration of the data layer
     * @internal
     */
    public setTable(
        table: DataTable,
        redraw: boolean = true,
        animation?: (boolean|Partial<AnimationOptions>)
    ): void {
        const series = this.series,
            anySeries: AnyRecord = series,
            oldData = series.points,
            keys = series.parallelArrays,
            rowCount = table.getRowCount();

        let key: string;

        if (oldData) {
            const xAxis = series.xAxis;

            series.colorCounter = 0;
            series.data = [];

            delete anySeries.points;
            delete anySeries.processedXData;
            delete anySeries.processedYData;
            delete anySeries.xIncrement;

            for (let i = 0, iEnd = keys.length; i < iEnd; ++i) {
                key = keys[i];
                anySeries[`${key}Data`] = [];
            }

            for (let i = 0, iEnd = oldData.length; i < iEnd; ++i) {
                if (oldData[i] && !!oldData[i].destroy) {
                    oldData[i].destroy();
                }
            }

            if (xAxis) {
                xAxis.minRange = xAxis.userMinRange;
            }
        }

        let column: (Readonly<DataTable.Column>|undefined),
            failure = false,
            indexAsX = false;

        for (let i = 0, iEnd = keys.length; i < iEnd; ++i) {
            key = keys[i];
            column = table.getColumn(key, true);

            if (!column) {
                if (key === 'x') {
                    indexAsX = true;
                    continue;
                } else {
                    failure = true;
                    break;
                }
            }

            anySeries[`${key}Data`] = column;
        }

        if (failure) {
            // Fallback to index
            const columnIds = table.getColumnIds(),
                emptyColumn: DataTable.Column = [];

            emptyColumn.length = rowCount;

            let columnOffset = 0;

            if (columnIds.length === keys.length - 1) {
                // Table index becomes x
                columnOffset = 1;
                indexAsX = true;
            }

            for (
                let i = columnOffset,
                    iEnd = keys.length;
                i < iEnd;
                ++i
            ) {
                column = table.getColumn(columnIds[i], true);
                key = keys[i];

                anySeries[`${key}Data`] = column || emptyColumn.slice();
            }
        }

        this.indexAsX = indexAsX;

        if (indexAsX && keys.indexOf('x') !== -1) {
            column = [];

            for (let x = 0; x < rowCount; ++x) {
                column.push(series.autoIncrement());
            }

            anySeries.xData = column;
        }

        this.syncOff();

        this.table = table;

        if (redraw) {
            this.syncOn();
        }

        this.processTable(redraw, oldData && animation);
    }

    /**
     * Stops synchronization of table changes with series.
     * @internal
     */
    public syncOff(): void {
        const unlisteners = this.unlisteners;

        for (let i = 0, iEnd = unlisteners.length; i < iEnd; ++i) {
            unlisteners[i]();
        }

        unlisteners.length = 0;
    }

    /**
     * Activates synchronization of table changes with series.
     * @internal
     */
    public syncOn(): void {
        if (this.unlisteners.length) {
            return;
        }

        const series = this.series,
            table = this.table,
            anySeries: AnyRecord = series,
            onChange = (e: DataTable.Event): void => {
                const type = e.type;
                if (type === 'afterDeleteColumns') {
                    // Deletion affects all points
                    this.setTable(table, true);
                    return;
                }
                if (type === 'afterDeleteRows') {
                    const { rowIndex, rowCount } = e;

                    if (
                        Array.isArray(rowIndex) ||
                        (
                            rowIndex > 0 &&
                            rowIndex + rowCount < series.points.length
                        )
                    ) {
                        // Deletion affects trailing points
                        this.setTable(table, true);
                        return;
                    }
                    for (
                        let i = rowIndex,
                            iEnd = i + rowCount;
                        i < iEnd;
                        ++i
                    ) {
                        series.removePoint(i, false);
                    }
                }
                if (this.indexAsX) {
                    if (type === 'afterSetCell') {
                        anySeries.xData[e.rowIndex] = e.rowIndex;
                    } else if (
                        type === 'afterSetRows' &&
                        isNumber(e.rowIndex)
                    ) {
                        for (
                            let i = e.rowIndex,
                                iEnd = i + e.rowCount;
                            i < iEnd;
                            ++i
                        ) {
                            anySeries.xData[i] = series.autoIncrement();
                        }
                    }
                }

                this.processTable(true);
            };

        this.unlisteners.push(
            table.on('afterDeleteColumns', onChange),
            table.on('afterDeleteRows', onChange),
            table.on('afterSetCell', onChange),
            table.on('afterSetRows', onChange)
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default DataSeriesAdditions;

/* *
 *
 *  API Options
 *
 * */

/* *
 * Indicates data is structured as columns instead of rows.
 *
 * @type      {boolean}
 * @since     Future
 * @apioption plotOptions.series.dataAsColumns
 */

(''); // Keeps doclets above in JS file
