/* eslint-disable brace-style */
/* eslint-disable no-console */
/* eslint-disable no-invalid-this */

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type DataPointOptions from './DataPointOptions';
import type DataSeries from './DataSeries';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import CP from '../../Core/Series/Point.js';
import DataTableRow from '../DataTableRow.js';
import U from '../../Core/Utilities.js';
const {
    getOptions,
    merge
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike' {
    interface ChartLike {
        redrawTimer?: number;
    }
}

/* *
 *
 *  Constants
 *
 * */

const DEBUG = !!(getOptions() as any).debug;

/* *
 *
 *  Class
 *
 * */

class DataPoint {

    /* *
     *
     *  Static Functions
     *
     * */

    public static readonly getPointOptionsFromTableRow = CP.getPointOptionsFromTableRow;

    public static readonly getTableRowFromPointOptions = CP.getTableRowFromPointOptions;

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        series: DataSeries,
        data?: (DataPointOptions|DataTableRow),
        x?: number
    ) {
        DEBUG && console.log('DataPoint.constructor');

        this.options = { x };
        this.series = series;
        this.tableRow = DataTableRow.NULL;

        if (data) {
            if (data instanceof DataTableRow) {
                this.setTableRow(data);
            } else {
                this.setTableRow(DataPoint.getTableRowFromPointOptions(data));
            }
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    public graphic?: SVGElement;

    public index?: number;

    public readonly options: DataPointOptions;

    public readonly series: DataSeries;

    public tableRow: DataTableRow;

    private tableRowListener?: Function;

    /* *
     *
     *  Functions
     *
     * */

    public destroy(): void {
        DEBUG && console.log('DataPoint.destroy');

        const point = this;

        point.tableRow = DataTableRow.NULL;

        if (point.tableRowListener) {
            point.tableRowListener();
        }
    }

    public render(parent: SVGElement): void {
        DEBUG && console.log('DataPoint.render');

        const point = this,
            tableRow = point.tableRow,
            valueKey = point.series.pointArrayMap[0];

        if (point.graphic) {
            point.graphic.destroy();
        }

        point.graphic = parent.renderer
            .rect(
                tableRow.getCellAsNumber('x') * 10,
                tableRow.getCellAsNumber(valueKey) * 10,
                1,
                1
            )
            .addClass('highcharts-data-point')
            .attr({
                fill: '#333',
                stroke: '#000',
                'stroke-width': 1,
                opacity: 1
            })
            .add(parent);
    }

    public setTableRow(
        tableRow: DataTableRow
    ): void {
        DEBUG && console.log('DataPoint.setTableRow');

        const point = this,
            series = point.series,
            chart = series.chart;

        if (point.tableRow !== tableRow) {
            if (point.tableRowListener) {
                point.tableRowListener();
            }

            point.tableRow = tableRow;
            point.tableRowListener = tableRow.on('afterChangeRow', function (
                this: DataTableRow
            ): void {
                point.update(
                    DataPoint.getPointOptionsFromTableRow(
                        this,
                        series.options.keys || series.pointArrayMap
                    ) || {},
                    false,
                    false
                );
                series.isDirty = true;
                series.isDirtyData = true;

                // POC by Torstein
                if (typeof chart.redrawTimer === 'undefined') {
                    chart.redrawTimer = setTimeout(function (): void {
                        chart.redrawTimer = void 0;
                        chart.redraw();
                    });
                }
            });
        }

        point.update(
            DataPoint.getPointOptionsFromTableRow(
                tableRow,
                series.pointArrayMap
            ) || {},
            false,
            false
        );
    }

    public update(
        options: DataPointOptions,
        redraw?: boolean,
        animation?: (false|AnimationOptions)
    ): void {
        DEBUG && console.log('DataPoint.update');

        const point = this;

        merge(true, point.options, options);

        if (redraw) {
            point.series.chart.redraw(animation);
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DataPoint;
