/* *
 *
 *  Parallel coordinates module
 *
 *  (c) 2010-2021 Pawel Fus
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

import type Axis from '../../Core/Axis/Axis';
import type AxisOptions from '../../Core/Axis/AxisOptions';
import type ParallelCoordinates from './ParallelCoordinates';

import ParallelCoordinatesDefaults from './ParallelCoordinatesDefaults.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    arrayMax,
    arrayMin,
    isNumber,
    merge,
    pick,
    pushUnique,
    splat
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Axis/AxisOptions' {
    interface AxisOptions {
        angle?: number;
        tooltipValueFormat?: string;
    }
}

declare module '../../Core/Axis/AxisComposition' {
    interface AxisComposition {
        parallelCoordinates?: ParallelAxis.Composition['parallelCoordinates'];
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * Support for parallel axes.
 * @private
 * @class
 */
class ParallelAxisAdditions {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        axis: ParallelAxis.Composition
    ) {
        this.axis = axis;
    }

    /* *
     *
     *  Properties
     *
     * */

    public axis: ParallelAxis.Composition;
    public position?: number;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Set predefined left+width and top+height (inverted) for yAxes.
     * This method modifies options param.
     *
     * @private
     *
     * @param  {Array<string>} axisPosition
     * ['left', 'width', 'height', 'top'] or ['top', 'height', 'width', 'left']
     * for an inverted chart.
     *
     * @param  {Highcharts.AxisOptions} options
     * Axis options.
     */
    public setPosition(
        axisPosition: Array<('left'|'width'|'height'|'top')>,
        options: AxisOptions
    ): void {
        const parallel = this,
            axis = parallel.axis,
            chart = axis.chart,
            fraction = ((parallel.position || 0) + 0.5) /
                (chart.parallelInfo.counter + 1);

        if (chart.polar) {
            options.angle = 360 * fraction;
        } else {
            options[axisPosition[0]] = 100 * fraction + '%';
            axis[axisPosition[1]] = options[axisPosition[1]] = 0;

            // In case of chart.update(inverted), remove old options:
            axis[axisPosition[2]] = options[axisPosition[2]] = null as any;
            axis[axisPosition[3]] = options[axisPosition[3]] = null as any;
        }
    }

}

/* *
 *
 *  Composition
 *
 * */

namespace ParallelAxis {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Axis with parallel support.
     * @private
     */
    export declare class Composition extends Axis {
        chart: ParallelCoordinates.ChartComposition;
        parallelCoordinates: ParallelAxisAdditions;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedMembers: Array<unknown> = [];

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Adds support for parallel axes.
     * @private
     */
    export function compose(
        AxisClass: typeof Axis
    ): void {

        if (pushUnique(composedMembers, AxisClass)) {
            const axisCompo = AxisClass as typeof Composition;

            // On update, keep parallel additions.
            AxisClass.keepProps.push('parallel');

            addEvent(axisCompo, 'init', onInit);
            addEvent(axisCompo, 'afterSetOptions', onAfterSetOptions);
            addEvent(axisCompo, 'getSeriesExtremes', onGetSeriesExtremes);
        }

    }

    /**
     * Update default options with predefined for a parallel coords.
     * @private
     */
    function onAfterSetOptions(
        this: Composition,
        e: { userOptions: AxisOptions }
    ): void {
        const axis = this,
            chart = axis.chart,
            parallelCoordinates = axis.parallelCoordinates;

        let axisPosition: Array<('left'|'width'|'height'|'top')> = [
            'left', 'width', 'height', 'top'
        ];

        if (chart.hasParallelCoordinates) {
            if (chart.inverted) {
                axisPosition = axisPosition.reverse();
            }

            if (axis.isXAxis) {
                axis.options = merge(
                    axis.options,
                    ParallelCoordinatesDefaults.xAxis,
                    e.userOptions
                );
            } else {
                const axisIndex = chart.yAxis.indexOf(axis); // #13608
                axis.options = merge(
                    axis.options,
                    axis.chart.options.chart.parallelAxes,
                    e.userOptions
                );
                parallelCoordinates.position = pick(
                    parallelCoordinates.position,
                    axisIndex >= 0 ? axisIndex : chart.yAxis.length
                );
                parallelCoordinates.setPosition(axisPosition, axis.options);
            }
        }
    }

    /**
     * Each axis should gather extremes from points on a particular position in
     * series.data. Not like the default one, which gathers extremes from all
     * series bind to this axis. Consider using series.points instead of
     * series.yData.
     * @private
     */
    function onGetSeriesExtremes(
        this: Composition,
        e: Event
    ): void {
        const axis = this;
        const chart = axis.chart;
        const parallelCoordinates = axis.parallelCoordinates;

        if (!parallelCoordinates) {
            return;
        }

        if (chart && chart.hasParallelCoordinates && !axis.isXAxis) {
            const index = parallelCoordinates.position;
            let currentPoints: Array<number|null> = [];

            axis.series.forEach(function (series): void {
                if (
                    series.yData &&
                    series.visible &&
                    isNumber(index)
                ) {
                    const y = series.yData[index];

                    // Take into account range series points as well (#15752)
                    currentPoints.push.apply(currentPoints, splat(y));
                }
            });

            currentPoints = currentPoints.filter(isNumber);

            axis.dataMin = arrayMin(currentPoints);
            axis.dataMax = arrayMax(currentPoints);

            e.preventDefault();
        }
    }

    /**
     * Add parallel addition
     * @private
     */
    function onInit(
        this: Composition
    ): void {
        const axis = this;
        if (!axis.parallelCoordinates) {
            axis.parallelCoordinates = new ParallelAxisAdditions(axis);
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ParallelAxis;
