/* *
 *
 *  Copyright (c) 2019-2021 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *  This files contains generic utility functions used by the boost module.
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

import type Series from '../../Core/Series/Series';
import type WGLRenderer from './WGLRenderer';

import boostableMap from './BoostableMap.js';
import Chart from '../../Core/Chart/Chart.js';
import createAndAttachRenderer from './BoostAttach.js';
import H from '../../Core/Globals.js';
const {
    win,
    doc
} = H;
import U from '../../Core/Utilities.js';
const {
    pick
} = U;


/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        boostForceChartBoost?: boolean;
    }
}

/* *
 *
 *  Constants
 *
 * */

// This should be a const.
const CHUNK_SIZE = 3000;

const contexts = [
    'webgl',
    'experimental-webgl',
    'moz-webgl',
    'webkit-3d'
];

/* *
 *
 *  Functions
 *
 * */

/**
 * Tolerant max() function.
 *
 * @private
 * @param {...Array<Array<unknown>>} args
 * Max arguments
 * @return {number}
 * Max value
 */
function patientMax(...args: Array<Array<unknown>>): number {
    let r = -Number.MAX_VALUE;

    args.forEach(function (t: Array<unknown>): (boolean|undefined) {
        if (
            typeof t !== 'undefined' &&
            t !== null &&
            typeof t.length !== 'undefined'
        ) {
            // r = r < t.length ? t.length : r;
            if (t.length > 0) {
                r = t.length;
                return true;
            }
        }
    });

    return r;
}

/**
 * Return true if ths boost.enabled option is true
 *
 * @private
 * @param {Highcharts.Chart} chart
 * The chart
 * @return {boolean}
 * True, if boost is enabled.
 */
function boostEnabled(chart: Chart): boolean {
    return pick(
        (
            chart &&
            chart.options &&
            chart.options.boost &&
            chart.options.boost.enabled
        ),
        true
    );
}

/**
 * Returns true if we should force boosting the chart.
 *
 * @private
 * @param {Highcharts.Chart} chart
 * The chart to check for forcing on
 * @return {boolean}
 * True, if boosting should be forced.
 */
function shouldForceChartSeriesBoosting(chart: Chart): boolean {
    const allowBoostForce = pick(
        chart.options.boost && chart.options.boost.allowForce,
        true
    );

    // If there are more than five series currently boosting,
    // we should boost the whole chart to avoid running out of webgl contexts.
    let sboostCount = 0,
        canBoostCount = 0,
        series;

    if (typeof chart.boostForceChartBoost !== 'undefined') {
        return chart.boostForceChartBoost;
    }

    if (chart.series.length > 1) {
        for (let i = 0; i < chart.series.length; i++) {

            series = chart.series[i];

            // Don't count series with boostThreshold set to 0
            // See #8950
            // Also don't count if the series is hidden.
            // See #9046
            if (series.options.boostThreshold === 0 ||
                series.visible === false) {
                continue;
            }

            // Don't count heatmap series as they are handled differently.
            // In the future we should make the heatmap/treemap path compatible
            // with forcing. See #9636.
            if (series.type === 'heatmap') {
                continue;
            }

            if (boostableMap[series.type]) {
                ++canBoostCount;
            }

            if (patientMax(
                series.processedXData,
                series.options.data as any,
                // series.xData,
                series.points
            ) >= (series.options.boostThreshold || Number.MAX_VALUE)) {
                ++sboostCount;
            }
        }
    }

    chart.boostForceChartBoost = allowBoostForce && (
        (
            canBoostCount === chart.series.length &&
            sboostCount > 0
        ) ||
        sboostCount > 5
    );

    return chart.boostForceChartBoost;
}

/* eslint-disable valid-jsdoc */

/**
 * Performs the actual render if the renderer is
 * attached to the series.
 * @private
 */
function renderIfNotSeriesBoosting(
    renderer: WGLRenderer,
    series: Series,
    chart?: Chart
): void {
    chart = chart || series.chart;

    if (renderer &&
        series.renderTarget &&
        series.canvas &&
        !(chart.isChartSeriesBoosting())
    ) {
        renderer.render(chart);
    }
}

/**
 * @private
 */
function allocateIfNotSeriesBoosting(
    renderer: WGLRenderer,
    series: Series
): void {
    if (renderer &&
        series.renderTarget &&
        series.canvas &&
        !(series.chart.isChartSeriesBoosting())
    ) {
        renderer.allocateBufferForSingleSeries(series);
    }
}

/**
 * An "async" foreach loop. Uses a setTimeout to keep the loop from blocking the
 * UI thread.
 *
 * @private
 * @param {Array<unknown>} arr
 * The array to loop through.
 * @param {Function} fn
 * The callback to call for each item.
 * @param {Function} finalFunc
 * The callback to call when done.
 * @param {number} [chunkSize]
 * The number of iterations per timeout.
 * @param {number} [i]
 * The current index.
 * @param {boolean} [noTimeout]
 * Set to true to skip timeouts.
 */
function eachAsync(
    arr: Array<unknown>,
    fn: Function,
    finalFunc: Function,
    chunkSize?: number,
    i?: number,
    noTimeout?: boolean
): void {
    i = i || 0;
    chunkSize = chunkSize || CHUNK_SIZE;

    const threshold = i + chunkSize;

    let proceed = true;

    while (proceed && i < threshold && i < arr.length) {
        proceed = fn(arr[i], i);
        ++i;
    }

    if (proceed) {
        if (i < arr.length) {

            if (noTimeout) {
                eachAsync(arr, fn, finalFunc, chunkSize, i, noTimeout);
            } else if (win.requestAnimationFrame) {
                // If available, do requestAnimationFrame - shaves off a few ms
                win.requestAnimationFrame(function (): void {
                    eachAsync(arr, fn, finalFunc, chunkSize, i);
                });
            } else {
                setTimeout(function (): void {
                    eachAsync(arr, fn, finalFunc, chunkSize, i);
                });
            }

        } else if (finalFunc) {
            finalFunc();
        }
    }
}

/**
 * Returns true if the current browser supports webgl
 * @private
 */
function hasWebGLSupport(): boolean {
    let canvas,
        gl: (false|RenderingContext|null) = false;

    if (typeof win.WebGLRenderingContext !== 'undefined') {
        canvas = doc.createElement('canvas');

        for (let i = 0; i < contexts.length; ++i) {
            try {
                gl = canvas.getContext(contexts[i]);
                if (typeof gl !== 'undefined' && gl !== null) {
                    return true;
                }
            } catch (e) {
                // silent error
            }
        }
    }

    return false;
}

/* eslint-disable no-invalid-this */

/**
 * Used for treemap|heatmap.drawPoints
 * @private
 */
function pointDrawHandler(this: Series, proceed: Function): void {
    let enabled = true;

    if (this.chart.options && this.chart.options.boost) {
        enabled = typeof this.chart.options.boost.enabled === 'undefined' ?
            true :
            this.chart.options.boost.enabled;
    }

    if (!enabled || !this.boosted) {
        return proceed.call(this);
    }

    this.chart.boosted = true;

    // Make sure we have a valid OGL context
    const renderer = createAndAttachRenderer(this.chart, this);

    if (renderer) {
        allocateIfNotSeriesBoosting(renderer, this);
        renderer.pushSeries(this);
    }

    renderIfNotSeriesBoosting(renderer, this);
}

/* eslint-enable no-invalid-this, valid-jsdoc */

/* *
 *
 *  Default Export
 *
 * */

const BoostUtils = {
    allocateIfNotSeriesBoosting,
    boostEnabled,
    eachAsync,
    hasWebGLSupport,
    patientMax,
    pointDrawHandler,
    renderIfNotSeriesBoosting,
    shouldForceChartSeriesBoosting
};

export default BoostUtils;
