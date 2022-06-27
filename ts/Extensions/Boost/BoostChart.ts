/* *
 *
 *  Copyright (c) 2019-2021 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
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

import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type BoostTargetObject from './BoostTargetObject';
import type Chart from '../../Core/Chart/Chart';

import BU from './BoostUtils.js';
const {
    shouldForceChartSeriesBoosting
} = BU;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

export declare class BoostChartComposition extends Chart {
    boost: BoostChartAdditions;
}

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        boost?: BoostChartAdditions;
        boosted?: boolean;
    }
}

/* *
 *
 *  Constants
 *
 * */

const composedClasses: Array<Function> = [];

/* *
 *
 *  Class
 *
 * */

class BoostChartAdditions {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * @private
     */
    public static compose<T extends typeof Chart>(
        ChartClass: T
    ): (T&typeof BoostChartComposition) {

        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);

            addEvent(ChartClass, 'afterInit', function (): void {
                if (!this.boost) {
                    this.boost = new BoostChartAdditions(
                        this as BoostChartComposition
                    );
                }
            });
        }

        return ChartClass as (T&typeof BoostChartComposition);
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        chart: BoostChartComposition
    ) {
        this.chart = chart;
    }

    /* *
     *
     *  Properties
     *
     * */

    private chart: BoostChartComposition;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Returns true if the chart is in series boost mode.
     *
     * @function Highcharts.Chart#isChartSeriesBoosting
     *
     * @param {Highcharts.Chart} chart
     *        the chart to check
     *
     * @return {boolean}
     *         true if the chart is in series boost mode
     */
    public isChartSeriesBoosting(): boolean {
        const chart = this.chart,
            threshold = pick(
                chart.options.boost && chart.options.boost.seriesThreshold,
                50
            );

        return (
            threshold <= chart.series.length ||
            shouldForceChartSeriesBoosting(chart)
        );
    }

    /* eslint-disable valid-jsdoc */

    /**
     * Get the clip rectangle for a target, either a series or the chart.
     * For the chart, we need to consider the maximum extent of its Y axes,
     * in case of Highcharts Stock panes and navigator.
     *
     * @private
     * @function Highcharts.Chart#getBoostClipRect
     */
    public getBoostClipRect(
        target: BoostTargetObject
    ): BBoxObject {
        const chart = this.chart,
            clipBox = {
                x: chart.plotLeft,
                y: chart.plotTop,
                width: chart.plotWidth,
                height: chart.plotHeight
            };

        if (target === chart) {
            const verticalAxes =
                chart.inverted ? chart.xAxis : chart.yAxis; // #14444

            if (verticalAxes.length <= 1) {
                clipBox.y = Math.min(verticalAxes[0].pos, clipBox.y);
                clipBox.height = (
                    verticalAxes[0].pos -
                    chart.plotTop +
                    verticalAxes[0].len
                );
            } else {
                clipBox.height = chart.plotHeight;
            }
        }

        return clipBox;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default BoostChartAdditions;
