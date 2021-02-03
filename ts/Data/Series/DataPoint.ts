/* eslint-disable brace-style */
/* eslint-disable no-console */
/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type DataPointOptions from './DataPointOptions';
import type DataSeries from './DataSeries';
import type DataTableRow from '../DataTableRow';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import CP from '../../Core/Series/Point.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

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
        options: DataPointOptions = {},
        x?: number
    ) { console.log('DataPoint.constructor');
        this.series = series;
        this.options = merge({ x }, options);
        this.tableRow = DataPoint.getTableRowFromPointOptions(options);
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

    /* *
     *
     *  Functions
     *
     * */

    public destroy(): void { console.log('DataPoint.destroy');
        const point = this;

        point.series.table.deleteRow(point.tableRow);
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
        const point = this;

        if (point.tableRow !== tableRow) {
            point.series.table.replaceRow(point.tableRow, tableRow);
            point.tableRow = tableRow;
        }

        this.update(
            DataPoint.getPointOptionsFromTableRow(
                tableRow,
                this.series.pointArrayMap
            ) || {}
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
