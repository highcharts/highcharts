/* *
 *
 *  (c) 2016-2024 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
import U from '../../Core/Utilities.js';
const { pick } = U;

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
        point: (GanttPoint|GanttPointOptions),
        chart: Chart
    ): void {

        /**
         * Add a value to options if the value exists.
         * @private
         */
        function addIfExists(prop: string, val: unknown): void {
            if (typeof val !== 'undefined') {
                (point as any)[prop] = val;
            }
        }

        addIfExists('x', chart.time.parse(point.start ?? point.x));
        addIfExists('x2', chart.time.parse(point.end ?? point.x2));
        addIfExists(
            'partialFill', pick(point.completed, point.partialFill)
        );
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
