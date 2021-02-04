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
const { merge } = U;

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
    ) { console.log('DataPoint.constructor');
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

    public readonly options: DataPointOptions;

    public readonly series: DataSeries;

    public tableRow: DataTableRow;

    private tableRowListener?: Function;

    /* *
     *
     *  Functions
     *
     * */

    public destroy(): void { console.log('DataPoint.destroy');
        const point = this;

        point.tableRow = DataTableRow.NULL;

        if (point.tableRowListener) {
            point.tableRowListener();
        }
    }

    public render(parent: SVGElement): void { console.log('DataPoint.render');
        const point = this,
            tableRow = point.tableRow;

        point.graphic = parent.renderer
            .rect(
                tableRow.getCellAsNumber('x') * 10,
                tableRow.getCellAsNumber('y'),
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
    ): void { console.log('DataPoint.setTableRow');
        const point = this,
            series = point.series,
            chart = series.chart;

        if (point.tableRow === tableRow) {
            point.update(tableRow, false, false);
        } else {
            if (point.tableRowListener) {
                point.tableRowListener();
            }

            point.tableRow = tableRow;
            point.update(tableRow, false, false);

            point.tableRowListener = tableRow.on('afterChangeRow', function (
                this: DataTableRow
            ): void {
                point.update(this, false, false);

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
    ): void { console.log('DataPoint.update');
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
