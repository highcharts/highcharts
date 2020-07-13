/* *
 *
 *  Copyright (c) 2019-2020 Highsoft AS
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
import H from '../../Core/Globals.js';
var win = H.win, doc = H.doc;
import '../../Core/Series/Series.js';
import boostableMap from './BoostableMap.js';
import createAndAttachRenderer from './BoostAttach.js';
import U from '../../Core/Utilities.js';
var pick = U.pick;
// This should be a const.
var CHUNK_SIZE = 3000;
/**
 * Tolerant max() function.
 *
 * @private
 * @function patientMax
 *
 * @param {...Array<Array<unknown>>} args
 * Max arguments
 *
 * @return {number}
 * Max value
 */
function patientMax() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var r = -Number.MAX_VALUE;
    args.forEach(function (t) {
        if (typeof t !== 'undefined' &&
            t !== null &&
            typeof t.length !== 'undefined') {
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
 * @function boostEnabled
 *
 * @param {Highcharts.Chart} chart
 * The chart
 *
 * @return {boolean}
 * True, if boost is enabled.
 */
function boostEnabled(chart) {
    return pick((chart &&
        chart.options &&
        chart.options.boost &&
        chart.options.boost.enabled), true);
}
/**
 * Returns true if we should force boosting the chart
 * @private
 * @function shouldForceChartSeriesBoosting
 *
 * @param {Highcharts.Chart} chart
 * The chart to check for forcing on
 *
 * @return {boolean}
 * True, if boosting should be forced.
 */
function shouldForceChartSeriesBoosting(chart) {
    // If there are more than five series currently boosting,
    // we should boost the whole chart to avoid running out of webgl contexts.
    var sboostCount = 0, canBoostCount = 0, allowBoostForce = pick(chart.options.boost && chart.options.boost.allowForce, true), series;
    if (typeof chart.boostForceChartBoost !== 'undefined') {
        return chart.boostForceChartBoost;
    }
    if (chart.series.length > 1) {
        for (var i = 0; i < chart.series.length; i++) {
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
            if (patientMax(series.processedXData, series.options.data, 
            // series.xData,
            series.points) >= (series.options.boostThreshold || Number.MAX_VALUE)) {
                ++sboostCount;
            }
        }
    }
    chart.boostForceChartBoost = allowBoostForce && ((canBoostCount === chart.series.length &&
        sboostCount > 0) ||
        sboostCount > 5);
    return chart.boostForceChartBoost;
}
/* eslint-disable valid-jsdoc */
/**
 * Performs the actual render if the renderer is
 * attached to the series.
 * @private
 * @param renderer {OGLRenderer} - the renderer
 * @param series {Highcharts.Series} - the series
 */
function renderIfNotSeriesBoosting(renderer, series, chart) {
    if (renderer &&
        series.renderTarget &&
        series.canvas &&
        !(chart || series.chart).isChartSeriesBoosting()) {
        renderer.render(chart || series.chart);
    }
}
/**
 * @private
 */
function allocateIfNotSeriesBoosting(renderer, series) {
    if (renderer &&
        series.renderTarget &&
        series.canvas &&
        !series.chart.isChartSeriesBoosting()) {
        renderer.allocateBufferForSingleSeries(series);
    }
}
/**
 * An "async" foreach loop. Uses a setTimeout to keep the loop from blocking the
 * UI thread.
 *
 * @private
 *
 * @param arr {Array} - the array to loop through
 * @param fn {Function} - the callback to call for each item
 * @param finalFunc {Function} - the callback to call when done
 * @param chunkSize {Number} - the number of iterations per timeout
 * @param i {Number} - the current index
 * @param noTimeout {Boolean} - set to true to skip timeouts
 */
function eachAsync(arr, fn, finalFunc, chunkSize, i, noTimeout) {
    i = i || 0;
    chunkSize = chunkSize || CHUNK_SIZE;
    var threshold = i + chunkSize, proceed = true;
    while (proceed && i < threshold && i < arr.length) {
        proceed = fn(arr[i], i);
        ++i;
    }
    if (proceed) {
        if (i < arr.length) {
            if (noTimeout) {
                eachAsync(arr, fn, finalFunc, chunkSize, i, noTimeout);
            }
            else if (win.requestAnimationFrame) {
                // If available, do requestAnimationFrame - shaves off a few ms
                win.requestAnimationFrame(function () {
                    eachAsync(arr, fn, finalFunc, chunkSize, i);
                });
            }
            else {
                setTimeout(function () {
                    eachAsync(arr, fn, finalFunc, chunkSize, i);
                });
            }
        }
        else if (finalFunc) {
            finalFunc();
        }
    }
}
/**
 * Returns true if the current browser supports webgl
 *
 * @private
 * @function hasWebGLSupport
 *
 * @return {boolean}
 */
function hasWebGLSupport() {
    var i = 0, canvas, contexts = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'], context = false;
    if (typeof win.WebGLRenderingContext !== 'undefined') {
        canvas = doc.createElement('canvas');
        for (; i < contexts.length; i++) {
            try {
                context = canvas.getContext(contexts[i]);
                if (typeof context !== 'undefined' && context !== null) {
                    return true;
                }
            }
            catch (e) {
                // silent error
            }
        }
    }
    return false;
}
/* eslint-disable no-invalid-this */
/**
 * Used for treemap|heatmap.drawPoints
 *
 * @private
 * @function pointDrawHandler
 *
 * @param {Function} proceed
 *
 * @return {*}
 */
function pointDrawHandler(proceed) {
    var enabled = true, renderer;
    if (this.chart.options && this.chart.options.boost) {
        enabled = typeof this.chart.options.boost.enabled === 'undefined' ?
            true :
            this.chart.options.boost.enabled;
    }
    if (!enabled || !this.isSeriesBoosting) {
        return proceed.call(this);
    }
    this.chart.isBoosting = true;
    // Make sure we have a valid OGL context
    renderer = createAndAttachRenderer(this.chart, this);
    if (renderer) {
        allocateIfNotSeriesBoosting(renderer, this);
        renderer.pushSeries(this);
    }
    renderIfNotSeriesBoosting(renderer, this);
}
/* eslint-enable no-invalid-this, valid-jsdoc */
var funs = {
    patientMax: patientMax,
    boostEnabled: boostEnabled,
    shouldForceChartSeriesBoosting: shouldForceChartSeriesBoosting,
    renderIfNotSeriesBoosting: renderIfNotSeriesBoosting,
    allocateIfNotSeriesBoosting: allocateIfNotSeriesBoosting,
    eachAsync: eachAsync,
    hasWebGLSupport: hasWebGLSupport,
    pointDrawHandler: pointDrawHandler
};
// This needs to be fixed.
H.hasWebGLSupport = hasWebGLSupport;
export default funs;
