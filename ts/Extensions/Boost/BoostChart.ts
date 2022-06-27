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
import type Series from '../../Core/Series/Series';

import BU from './BoostUtils.js';
const { shouldForceChartSeriesBoosting } = BU;
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
    getBoostClipRect(target: BoostTargetObject): BBoxObject;
    isChartSeriesBoosting(): boolean;
}

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        boosted?: boolean;
        markerGroup?: Series['markerGroup'];
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
 * Get the clip rectangle for a target, either a series or the chart.
 * For the chart, we need to consider the maximum extent of its Y axes,
 * in case of Highcharts Stock panes and navigator.
 *
 * @private
 * @function Highcharts.Chart#getBoostClipRect
 */
function chartGetBoostClipRect(
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
function chartIsChartSeriesBoosting(
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

/**
 * @private
 */
function compose<T extends typeof Chart>(
    ChartClass: T,
    wglMode?: boolean
): (T&typeof BoostChartComposition) {

    if (composedClasses.indexOf(ChartClass) === -1) {
        const chartProto = ChartClass.prototype as BoostChartComposition;

        composedClasses.push(ChartClass);

        chartProto.getBoostClipRect = chartGetBoostClipRect;
        chartProto.isChartSeriesBoosting = chartIsChartSeriesBoosting;

        if (wglMode) {
            chartProto.propsRequireUpdateSeries.push('boost');

            ChartClass.prototype.callbacks.push(onChartCallback);
        }
    }

    return ChartClass as (T&typeof BoostChartComposition);
}

/**
 * Take care of the canvas blitting
 * @private
 */
function onChartCallback(
    chart: Chart
): void {

    /**
     * Convert chart-level canvas to image.
     * @private
     */
    function canvasToSVG(): void {
        if (
            chart.ogl &&
            chart.isChartSeriesBoosting()
        ) {
            chart.ogl.render(chart);
        }
    }

    /**
     * Clear chart-level canvas.
     * @private
     */
    function preRender(): void {

        // Reset force state
        chart.boostForceChartBoost = void 0;
        chart.boostForceChartBoost = shouldForceChartSeriesBoosting(chart);
        chart.boosted = false;

        // Clear the canvas
        if (chart.boostClear) {
            chart.boostClear();
        }

        if (
            chart.canvas &&
            chart.ogl &&
            chart.isChartSeriesBoosting()
        ) {
            // Allocate
            chart.ogl.allocateBuffer(chart);
        }

        // see #6518 + #6739
        if (
            chart.markerGroup &&
            chart.xAxis &&
            chart.xAxis.length > 0 &&
            chart.yAxis &&
            chart.yAxis.length > 0
        ) {
            chart.markerGroup.translate(
                chart.xAxis[0].pos,
                chart.yAxis[0].pos
            );
        }
    }

    addEvent(chart, 'predraw', preRender);
    addEvent(chart, 'render', canvasToSVG);

    // addEvent(chart, 'zoom', function () {
    //     chart.boostForceChartBoost =
    //         shouldForceChartSeriesBoosting(chart);
    // });

    let prevX = -1;
    let prevY = -1;

    addEvent(chart.pointer, 'afterGetHoverData', (): void => {
        const series = chart.hoverSeries;

        if (chart.markerGroup && series) {
            const xAxis = chart.inverted ? series.yAxis : series.xAxis;
            const yAxis = chart.inverted ? series.xAxis : series.yAxis;

            if (
                (xAxis && xAxis.pos !== prevX) ||
                (yAxis && yAxis.pos !== prevY)
            ) {
                // #10464: Keep the marker group position in sync with the
                // position of the hovered series axes since there is only
                // one shared marker group when boosting.
                chart.markerGroup.translate(xAxis.pos, yAxis.pos);

                prevX = xAxis.pos;
                prevY = yAxis.pos;
            }
        }
    });
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
