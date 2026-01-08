/* *
 *
 *  (c) 2016-2026 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type GanttPointOptions from './GanttPointOptions';
import type GanttSeries from './GanttSeries';
import type Chart from '../../Core/Chart/Chart';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    xrange: { prototype: { pointClass: XRangePoint } }
} = SeriesRegistry.seriesTypes;

/* *
 *
 *  Class
 *
 * */

class GanttPoint extends XRangePoint {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * @private
     */
    public static setGanttPointAliases(
        options: (GanttPoint|GanttPointOptions),
        chart: Chart
    ): void {
        options.x = options.start = chart.time.parse(
            options.start ?? options.x
        );
        options.x2 = options.end = chart.time.parse(
            options.end ?? options.x2
        );
        (options as any).partialFill = options.completed =
            options.completed ?? options.partialFill;
    }

    /* *
     *
     *  Properties
     *
     * */

    public collapsed?: boolean;

    public completed?: boolean;

    public end?: number;

    public milestone?: boolean;

    public options!: GanttPointOptions;

    public series!: GanttSeries;

    public start?: number;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Applies the options containing the x and y data and possible some
     * extra properties. This is called on point init or from point.update.
     *
     * @private
     * @function Highcharts.Point#applyOptions
     *
     * @param {Object} options
     *        The point options
     *
     * @param {number} x
     *        The x value
     *
     * @return {Highcharts.Point}
     *         The Point instance
     */
    public applyOptions(
        options: GanttPointOptions,
        x: number
    ): GanttPoint {
        const ganttPoint = super.applyOptions(options, x) as GanttPoint;

        GanttPoint.setGanttPointAliases(ganttPoint, ganttPoint.series.chart);

        this.isNull = !this.isValid?.();
        this.formatPrefix = this.isNull ? 'null' : 'point'; // #23605

        return ganttPoint;
    }

    public isValid(): boolean {
        return (
            (
                typeof this.start === 'number' ||
                typeof this.x === 'number'
            ) &&
            (
                typeof this.end === 'number' ||
                typeof this.x2 === 'number' ||
                (this.milestone as any)
            )
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default GanttPoint;
