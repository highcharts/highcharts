/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../Core/Animation/AnimationOptions';
import type Series from '../Core/Series/Series';

import DataTable from './DataTable.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    fireEvent,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        datas?: DataSeriesAdditions;
    }
}

export declare class DataSeriesComposition extends Series {
    datas: DataSeriesAdditions;
}

/* *
 *
 *  Constants
 *
 * */

const composedClasses: Array<Function> = [];

/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
function wrapSeriesGeneratePoints(
    this: DataSeriesComposition,
    proceed: DataSeriesComposition['generatePoints']
): void {
    const processedXData = this.processedXData,
        processedYData = this.processedYData,
        table = this.datas.table;

    if (this.hasGroupedData || !table.getRowCount()) {
        return proceed.call(this);
    }

    const PointClass = this.pointClass,
        cropStart = this.cropStart || 0,
        data = this.data,
        points = [];

    let cursor: number,
        point: typeof PointClass.prototype;

    for (let i = 0, iEnd = processedXData.length; i < iEnd; ++i) {
        cursor = cropStart + i;
        point = data[cursor];
        if (!point) {
            point = data[cursor] = (new PointClass()).init(
                this,
                processedYData[cursor],
                processedXData[i]
            );
        }
        point.index = cursor;
        points[i] = point;
    }

    this.points = points;

    fireEvent(this, 'afterGeneratePoints');
}

/* *
 *
 *  Class
 *
 * */

class DataSeriesAdditions {

    /* *
     *
     *  Static Functions
     *
     * */

    public static compose(
        SeriesClass: typeof Series
    ): void {

        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);

            addEvent(SeriesClass, 'init', function (): void {
                this.datas = new DataSeriesAdditions(
                    this as DataSeriesComposition
                );
            });

            const seriesProto = SeriesClass.prototype as DataSeriesComposition;

            wrap(seriesProto, 'generatePoints', wrapSeriesGeneratePoints);
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
        this.table = new DataTable(columns);
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
     * @private
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
     * @private
     */
    public setTable(
        table: DataTable,
        redraw: boolean = true,
        animation?: (boolean|Partial<AnimationOptions>)
    ): void {
        const series = this.series,
            anySeries: AnyRecord = series,
            oldData = series.points,
            parallelArrays = series.parallelArrays,
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

            for (let i = 0, iEnd = parallelArrays.length; i < iEnd; ++i) {
                key = parallelArrays[i];
                anySeries[`${key}Data`] = [];
            }

            for (let i = 0, iEnd = oldData.length; i < iEnd; ++i) {
                if (oldData[i] && (oldData[i].destroy)) {
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

        for (let i = 0, iEnd = parallelArrays.length; i < iEnd; ++i) {
            key = parallelArrays[i];
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
            // fallback to index
            const columnNames = table.getColumnNames(),
                emptyColumn: DataTable.Column = [];

            emptyColumn.length = rowCount;

            let columnOffset = 0;

            if (columnNames.length === parallelArrays.length - 1) {
                // table index becomes x
                columnOffset = 1;
                indexAsX = true;
            }

            for (
                let i = columnOffset,
                    iEnd = parallelArrays.length;
                i < iEnd;
                ++i
            ) {
                column = table.getColumn(columnNames[i], true);
                key = parallelArrays[i];

                anySeries[`${key}Data`] = column || emptyColumn.slice();
            }
        }

        this.indexAsX = indexAsX;

        if (indexAsX && parallelArrays.indexOf('x') !== -1) {
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
     * Stops synchronisation of table changes with series.
     * @private
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
     * @private
     */
    public syncOn(): void {
        if (this.unlisteners.length) {
            return;
        }

        const series = this.series,
            table = this.table,
            anySeries: AnyRecord = series,
            onChange = (e: DataTable.Event): void => {
                if (e.type === 'afterDeleteColumns') {
                    // deletion affects all points
                    this.setTable(table, true);
                    return;
                }
                if (e.type === 'afterDeleteRows') {
                    if (
                        e.rowIndex > 0 &&
                        e.rowIndex + e.rowCount < series.points.length
                    ) {
                        // deletion affects trailing points
                        this.setTable(table, true);
                        return;
                    }
                    for (
                        let i = e.rowIndex,
                            iEnd = i + e.rowCount;
                        i < iEnd;
                        ++i
                    ) {
                        series.removePoint(i, false);
                    }
                }
                if (this.indexAsX) {
                    if (e.type === 'afterSetCell') {
                        anySeries.xData[e.rowIndex] = e.rowIndex;
                    } else if (e.type === 'afterSetRows') {
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

export default DataSeriesAdditions;
