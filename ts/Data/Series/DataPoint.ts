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

    public readonly tableRow: DataTableRow;

    /* *
     *
     *  Functions
     *
     * */

    public destroy(): void { console.log('DataPoint.destroy');

    }

    public render(parent: SVGElement): void { console.log('DataPoint.render');
        const point = this,
            tableRow = point.tableRow;

        point.graphic = parent.renderer.rect({
            x: tableRow.getCellAsNumber('x') * 10,
            y: tableRow.getCellAsNumber('y'),
            width: 1,
            height: 1,
            fill: '#333',
            stroke: '#000',
            'stroke-width': 1,
            opacity: 1
        });
    }

    public setTableRow(
        tableRow: DataTableRow
    ): void { console.log('DataPoint.setTableRow');
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
