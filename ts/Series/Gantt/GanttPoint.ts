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
        options: (GanttPoint|GanttPointOptions)
    ): void {
        options.x = options.start = options.start ?? options.x;
        options.x2 = options.end = options.end ?? options.x2;
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

        GanttPoint.setGanttPointAliases(ganttPoint);

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
