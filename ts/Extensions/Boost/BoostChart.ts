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
const { shouldForceChartSeriesBoosting } = BU;
import U from '../../Core/Utilities.js';
const { pick } = U;

/* *
 *
 *  Declarations
 *
 * */

export declare class BoostChartComposition extends Chart {
    getBoostClipRect(target: BoostTargetObject): BBoxObject;
    isChartSeriesBoosting(): boolean;
}

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        boosted?: boolean;
        /** @requires modules/boost */
        getBoostClipRect(target: BoostTargetObject): BBoxObject;
        /** @requires modules/boost */
        isChartSeriesBoosting(): boolean;
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
 *  Functions
 *
 * */

/**
 * @private
 */
function compose<T extends typeof Chart>(
    ChartClass: T
): (T&typeof BoostChartComposition) {

    if (composedClasses.indexOf(ChartClass) === -1) {
        composedClasses.push(ChartClass);

        const chartProto = ChartClass.prototype as BoostChartComposition;

        chartProto.getBoostClipRect = getBoostClipRect;
        chartProto.isChartSeriesBoosting = isChartSeriesBoosting;
    }

    return ChartClass as (T&typeof BoostChartComposition);
}

/**
 * Get the clip rectangle for a target, either a series or the chart.
 * For the chart, we need to consider the maximum extent of its Y axes,
 * in case of Highcharts Stock panes and navigator.
 *
 * @private
 * @function Highcharts.Chart#getBoostClipRect
 */
function getBoostClipRect(
    this: BoostChartComposition,
    target: BoostTargetObject
): BBoxObject {
    const chart = this,
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
function isChartSeriesBoosting(
    this: BoostChartComposition
): boolean {
    const chart = this,
        threshold = pick(
            chart.options.boost && chart.options.boost.seriesThreshold,
            50
        );

    return (
        threshold <= chart.series.length ||
        shouldForceChartSeriesBoosting(chart)
    );
}

/* *
 *
 *  Default Export
 *
 * */

const BoostChart = {
    compose
};

export default BoostChart;
