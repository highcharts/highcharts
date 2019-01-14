/**
 * License: www.highcharts.com/license
 * Author: Christer Vasseng, Torstein Honsi
 *
 * This is a Highcharts module that draws long data series on a cannvas in order
 * to increase performance of the initial load time and tooltip responsiveness.
 *
 * Compatible with WebGL compatible browsers (not IE < 11).
 *
 * If this module is taken in as part of the core
 * - All the loading logic should be merged with core. Update styles in the
 *   core.
 * - Most of the method wraps should probably be added directly in parent
 *   methods.
 *
 * Notes for boost mode
 * - Area lines are not drawn
 * - Lines are not drawn on scatter charts
 * - Zones and negativeColor don't work
 * - Dash styles are not rendered on lines.
 * - Columns are always one pixel wide. Don't set the threshold too low.
 * - Disable animations
 * - Marker shapes are not supported: markers will always be circles
 *
 * Optimizing tips for users
 * - Set extremes (min, max) explicitly on the axes in order for Highcharts to
 *   avoid computing extremes.
 * - Set enableMouseTracking to false on the series to improve total rendering
 *      time.
 * - The default threshold is set based on one series. If you have multiple,
 *   dense series, the combined number of points drawn gets higher, and you may
 *   want to set the threshold lower in order to use optimizations.
 * - If drawing large scatter charts, it's beneficial to set the marker radius
 *   to a value less than 1. This is to add additional spacing to make the chart
 *   more readable.
 * - If the value increments on both the X and Y axis aren't small, consider
 *   setting useGPUTranslations to true on the boost settings object. If you do
 *   this and the increments are small (e.g. datetime axis with small time
 *   increments) it may cause rendering issues due to floating point rounding
 *   errors, so your millage may vary.
 *
 * Settings
 *    There are two ways of setting the boost threshold:
 *    - Per series: boost based on number of points in individual series
 *    - Per chart: boost based on the number of series
 *
 *  To set the series boost threshold, set seriesBoostThreshold on the chart
 *  object.
 *  To set the series-specific threshold, set boostThreshold on the series
 *  object.
 *
 *  In addition, the following can be set in the boost object:
 *  {
 *      //Wether or not to use alpha blending
 *      useAlpha: boolean - default: true
 *      //Set to true to perform translations on the GPU.
 *      //Much faster, but may cause rendering issues
 *      //when using values far from 0 due to floating point
 *      //rounding issues
 *      useGPUTranslations: boolean - default: false
 *      //Use pre-allocated buffers, much faster,
 *      //but may cause rendering issues with some data sets
 *      usePreallocated: boolean - default: false
 *  }
 */

/**
 * Options for the Boost module. The Boost module allows certain series types
 * to be rendered by WebGL instead of the default SVG. This allows hundreds of
 * thousands of data points to be rendered in milliseconds. In addition to the
 * WebGL rendering it saves time by skipping processing and inspection of the
 * data wherever possible. This introduces some limitations to what features are
 * available in Boost mode. See [the docs](
 * https://www.highcharts.com/docs/advanced-chart-features/boost-module) for
 * details.
 *
 * In addition to the global `boost` option, each series has a
 * [boostThreshold](#plotOptions.series.boostThreshold) that defines when the
 * boost should kick in.
 *
 * Requires the `modules/boost.js` module.
 *
 * @sample {highstock} highcharts/boost/line-series-heavy-stock
 *         Stock chart
 * @sample {highstock} highcharts/boost/line-series-heavy-dynamic
 *         Dynamic stock chart
 * @sample highcharts/boost/line
 *         Line chart
 * @sample highcharts/boost/line-series-heavy
 *         Line chart with hundreds of series
 * @sample highcharts/boost/scatter
 *         Scatter chart
 * @sample highcharts/boost/area
 *         Area chart
 * @sample highcharts/boost/arearange
 *         Area range chart
 * @sample highcharts/boost/column
 *         Column chart
 * @sample highcharts/boost/columnrange
 *         Column range chart
 * @sample highcharts/boost/bubble
 *         Bubble chart
 * @sample highcharts/boost/heatmap
 *         Heat map
 * @sample highcharts/boost/treemap
 *         Tree map
 *
 * @product   highcharts highstock
 * @apioption boost
 */

/**
 * Set the series threshold for when the boost should kick in globally.
 *
 * Setting to e.g. 20 will cause the whole chart to enter boost mode
 * if there are 20 or more series active. When the chart is in boost mode,
 * every series in it will be rendered to a common canvas. This offers
 * a significant speed improvment in charts with a very high
 * amount of series.
 *
 * @type      {number|null}
 * @default   null
 * @apioption boost.seriesThreshold
 */

/**
 * Enable or disable boost on a chart.
 *
 * @type      {boolean}
 * @default   true
 * @apioption boost.enabled
 */

/**
 * Debugging options for boost.
 * Useful for benchmarking, and general timing.
 *
 * @apioption boost.debug
 */

/**
 * Time the series rendering.
 *
 * This outputs the time spent on actual rendering in the console when
 * set to true.
 *
 * @type      {boolean}
 * @default   false
 * @apioption boost.debug.timeRendering
 */

/**
 * Time the series processing.
 *
 * This outputs the time spent on transforming the series data to
 * vertex buffers when set to true.
 *
 * @type      {boolean}
 * @default   false
 * @apioption boost.debug.timeSeriesProcessing
 */

/**
 * Time the the WebGL setup.
 *
 * This outputs the time spent on setting up the WebGL context,
 * creating shaders, and textures.
 *
 * @type      {boolean}
 * @default   false
 * @apioption boost.debug.timeSetup
 */

/**
 * Time the building of the k-d tree.
 *
 * This outputs the time spent building the k-d tree used for
 * markers etc.
 *
 * Note that the k-d tree is built async, and runs post-rendering.
 * Following, it does not affect the performance of the rendering itself.
 *
 * @type      {boolean}
 * @default   false
 * @apioption boost.debug.timeKDTree
 */

/**
 * Show the number of points skipped through culling.
 *
 * When set to true, the number of points skipped in series processing
 * is outputted. Points are skipped if they are closer than 1 pixel from
 * each other.
 *
 * @type      {boolean}
 * @default   false
 * @apioption boost.debug.showSkipSummary
 */

/**
 * Time the WebGL to SVG buffer copy
 *
 * After rendering, the result is copied to an image which is injected
 * into the SVG.
 *
 * If this property is set to true, the time it takes for the buffer copy
 * to complete is outputted.
 *
 * @type      {boolean}
 * @default   false
 * @apioption boost.debug.timeBufferCopy
 */

/**
 * Enable or disable GPU translations. GPU translations are faster than doing
 * the translation in JavaScript.
 *
 * This option may cause rendering issues with certain datasets.
 * Namely, if your dataset has large numbers with small increments (such as
 * timestamps), it won't work correctly. This is due to floating point
 * precission.
 *
 * @type      {boolean}
 * @default   false
 * @apioption boost.useGPUTranslations
 */

/**
 * Enable or disable pre-allocation of vertex buffers.
 *
 * Enabling this will make it so that the binary data arrays required for
 * storing the series data will be allocated prior to transforming the data
 * to a WebGL-compatible format.
 *
 * This saves a copy operation on the order of O(n) and so is significantly more
 * performant. However, this is currently an experimental option, and may cause
 * visual artifacts with some datasets.
 *
 * As such, care should be taken when using this setting to make sure that
 * it doesn't cause any rendering glitches with the given use-case.
 *
 * @type      {boolean}
 * @default   false
 * @apioption boost.usePreallocated
 */

/**
 * Set the point threshold for when a series should enter boost mode.
 *
 * Setting it to e.g. 2000 will cause the series to enter boost mode when there
 * are 2000 or more points in the series.
 *
 * To disable boosting on the series, set the `boostThreshold` to 0. Setting it
 * to 1 will force boosting.
 *
 * Note that the [cropThreshold](plotOptions.series.cropThreshold) also affects
 * this setting. When zooming in on a series that has fewer points than the
 * `cropThreshold`, all points are rendered although outside the visible plot
 * area, and the `boostThreshold` won't take effect.
 *
 * Requires `modules/boost.js`.
 *
 * @type      {number}
 * @default   5000
 * @apioption plotOptions.series.boostThreshold
 */

/**
 * If set to true, the whole chart will be boosted if one of the series
 * crosses its threshold, and all the series can be boosted.
 *
 * @type      {boolean}
 * @default   true
 * @apioption boost.allowForce
 */

/**
 * Sets the color blending in the boost module.
 *
 * @type       {string}
 * @default    undefined
 * @validvalue ["add", "multiply", "darken"]
 * @apioption  plotOptions.series.boostBlending
 */

/* global Float32Array */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Color.js';
import '../parts/Series.js';
import '../parts/Options.js';
import '../parts/Point.js';
import '../parts/Interaction.js';

var win = H.win,
    doc = win.document,
    noop = function () {},
    Chart = H.Chart,
    Color = H.Color,
    Series = H.Series,
    seriesTypes = H.seriesTypes,
    objEach = H.objectEach,
    extend = H.extend,
    addEvent = H.addEvent,
    fireEvent = H.fireEvent,
    isNumber = H.isNumber,
    merge = H.merge,
    pick = H.pick,
    wrap = H.wrap,
    plotOptions = H.getOptions().plotOptions,
    CHUNK_SIZE = 30000,
    mainCanvas = doc.createElement('canvas'),
    index,
    boostable = [
        'area',
        'arearange',
        'column',
        'columnrange',
        'bar',
        'line',
        'scatter',
        'heatmap',
        'bubble',
        'treemap'
    ],
    boostableMap = {};

boostable.forEach(function (item) {
    boostableMap[item] = 1;
});

// Register color names since GL can't render those directly.
Color.prototype.names = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dodgerblue: '#1e90ff',
    feldspar: '#d19275',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgrey: '#d3d3d3',
    lightgreen: '#90ee90',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslateblue: '#8470ff',
    lightslategray: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370d8',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#d87093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    violetred: '#d02090',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32'
};

/**
 * Tolerant max() function.
 *
 * @private
 * @function patientMax
 *
 * @return {number}
 *         max value
 */
function patientMax() {
    var args = Array.prototype.slice.call(arguments),
        r = -Number.MAX_VALUE;

    args.forEach(function (t) {
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
 * Returns true if we should force chart series boosting
 * The result of this is cached in chart.boostForceChartBoost.
 * It's re-fetched on redraw.
 *
 * We do this because there's a lot of overhead involved when dealing
 * with a lot of series.
 *
 * @private
 * @function shouldForceChartSeriesBoosting
 *
 * @param {Highcharts.Chart} chart
 *
 * @return {boolean}
 */
function shouldForceChartSeriesBoosting(chart) {
    // If there are more than five series currently boosting,
    // we should boost the whole chart to avoid running out of webgl contexts.
    var sboostCount = 0,
        canBoostCount = 0,
        allowBoostForce = pick(
            chart.options.boost && chart.options.boost.allowForce,
            true
        ),
        series;

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

            if (patientMax(
                series.processedXData,
                series.options.data,
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

/**
 * Return true if ths boost.enabled option is true
 *
 * @private
 * @function boostEnabled
 *
 * @param {Highcharts.Chart} chart
 *        The chart
 *
 * @return {boolean}
 */
function boostEnabled(chart) {
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
Chart.prototype.isChartSeriesBoosting = function () {
    var isSeriesBoosting,
        threshold = pick(
            this.options.boost && this.options.boost.seriesThreshold,
            50
        );

    isSeriesBoosting = threshold <= this.series.length ||
        shouldForceChartSeriesBoosting(this);

    return isSeriesBoosting;
};

/**
 * Get the clip rectangle for a target, either a series or the chart. For the
 * chart, we need to consider the maximum extent of its Y axes, in case of
 * Highstock panes and navigator.
 *
 * @private
 * @function Highcharts.Chart#getBoostClipRect
 *
 * @param {Highcharts.Chart} target
 *
 * @return {Highcharts.BBoxObject}
 */
Chart.prototype.getBoostClipRect = function (target) {
    var clipBox = {
        x: this.plotLeft,
        y: this.plotTop,
        width: this.plotWidth,
        height: this.plotHeight
    };

    if (target === this) {
        this.yAxis.forEach(function (yAxis) {
            clipBox.y = Math.min(yAxis.pos, clipBox.y);
            clipBox.height = Math.max(
                yAxis.pos - this.plotTop + yAxis.len,
                clipBox.height
            );
        }, this);
    }

    return clipBox;
};

/*
 * Returns true if the series is in boost mode
 * @param series {Highchart.Series} - the series to check
 * @returns {boolean} - true if the series is in boost mode
 */
/*
function isSeriesBoosting(series, overrideThreshold) {
    return  isChartSeriesBoosting(series.chart) ||
            patientMax(
                series.processedXData,
                series.options.data,
                series.points
            ) >= (
                overrideThreshold ||
                series.options.boostThreshold ||
                Number.MAX_VALUE
            );
}
*/

// START OF WEBGL ABSTRACTIONS

/**
 * A static shader mimicing axis translation functions found in parts/Axis
 *
 * @private
 * @function GLShader
 *
 * @param {WebGLContext} gl
 *        the context in which the shader is active
 *
 * @return {*}
 */
function GLShader(gl) {
    var vertShade = [
            /* eslint-disable */
            '#version 100',
            'precision highp float;',

            'attribute vec4 aVertexPosition;',
            'attribute vec4 aColor;',

            'varying highp vec2 position;',
            'varying highp vec4 vColor;',

            'uniform mat4 uPMatrix;',
            'uniform float pSize;',

            'uniform float translatedThreshold;',
            'uniform bool hasThreshold;',

            'uniform bool skipTranslation;',

            'uniform float plotHeight;',

            'uniform float xAxisTrans;',
            'uniform float xAxisMin;',
            'uniform float xAxisMinPad;',
            'uniform float xAxisPointRange;',
            'uniform float xAxisLen;',
            'uniform bool  xAxisPostTranslate;',
            'uniform float xAxisOrdinalSlope;',
            'uniform float xAxisOrdinalOffset;',
            'uniform float xAxisPos;',
            'uniform bool  xAxisCVSCoord;',

            'uniform float yAxisTrans;',
            'uniform float yAxisMin;',
            'uniform float yAxisMinPad;',
            'uniform float yAxisPointRange;',
            'uniform float yAxisLen;',
            'uniform bool  yAxisPostTranslate;',
            'uniform float yAxisOrdinalSlope;',
            'uniform float yAxisOrdinalOffset;',
            'uniform float yAxisPos;',
            'uniform bool  yAxisCVSCoord;',

            'uniform bool  isBubble;',
            'uniform bool  bubbleSizeByArea;',
            'uniform float bubbleZMin;',
            'uniform float bubbleZMax;',
            'uniform float bubbleZThreshold;',
            'uniform float bubbleMinSize;',
            'uniform float bubbleMaxSize;',
            'uniform bool  bubbleSizeAbs;',
            'uniform bool  isInverted;',

            'float bubbleRadius(){',
                'float value = aVertexPosition.w;',
                'float zMax = bubbleZMax;',
                'float zMin = bubbleZMin;',
                'float radius = 0.0;',
                'float pos = 0.0;',
                'float zRange = zMax - zMin;',

                'if (bubbleSizeAbs){',
                    'value = value - bubbleZThreshold;',
                    'zMax = max(zMax - bubbleZThreshold, zMin - bubbleZThreshold);',
                    'zMin = 0.0;',
                '}',

                'if (value < zMin){',
                    'radius = bubbleZMin / 2.0 - 1.0;',
                '} else {',
                    'pos = zRange > 0.0 ? (value - zMin) / zRange : 0.5;',
                    'if (bubbleSizeByArea && pos > 0.0){',
                        'pos = sqrt(pos);',
                    '}',
                    'radius = ceil(bubbleMinSize + pos * (bubbleMaxSize - bubbleMinSize)) / 2.0;',
                '}',

                'return radius * 2.0;',
            '}',

            'float translate(float val,',
                            'float pointPlacement,',
                            'float localA,',
                            'float localMin,',
                            'float minPixelPadding,',
                            'float pointRange,',
                            'float len,',
                            'bool  cvsCoord',
                            '){',

                'float sign = 1.0;',
                'float cvsOffset = 0.0;',

                'if (cvsCoord) {',
                    'sign *= -1.0;',
                    'cvsOffset = len;',
                '}',

                'return sign * (val - localMin) * localA + cvsOffset + ',
                    '(sign * minPixelPadding);',//' + localA * pointPlacement * pointRange;',
            '}',

            'float xToPixels(float value){',
                'if (skipTranslation){',
                    'return value;// + xAxisPos;',
                '}',

                'return translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen, xAxisCVSCoord);// + xAxisPos;',
            '}',

            'float yToPixels(float value, float checkTreshold){',
                'float v;',
                'if (skipTranslation){',
                    'v = value;// + yAxisPos;',
                '} else {',
                    'v = translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen, yAxisCVSCoord);// + yAxisPos;',
                    'if (v > plotHeight) {',
                        'v = plotHeight;',
                    '}',
                '}',
                'if (checkTreshold > 0.0 && hasThreshold) {',
                    'v = min(v, translatedThreshold);',
                '}',
                'return v;',
            '}',

            'void main(void) {',
                'if (isBubble){',
                    'gl_PointSize = bubbleRadius();',
                '} else {',
                    'gl_PointSize = pSize;',
                '}',
                //'gl_PointSize = 10.0;',
                'vColor = aColor;',

                'if (isInverted) {',
                    'gl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.y) + yAxisPos, yToPixels(aVertexPosition.x, aVertexPosition.z) + xAxisPos, 0.0, 1.0);',
                '} else {',
                    'gl_Position = uPMatrix * vec4(xToPixels(aVertexPosition.x) + xAxisPos, yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, 0.0, 1.0);',
                '}',
                //'gl_Position = uPMatrix * vec4(aVertexPosition.x, aVertexPosition.y, 0.0, 1.0);',
            '}'
            /* eslint-enable */
        ].join('\n'),
        // Fragment shader source
        fragShade = [
            /* eslint-disable */
            'precision highp float;',
            'uniform vec4 fillColor;',
            'varying highp vec2 position;',
            'varying highp vec4 vColor;',
              'uniform sampler2D uSampler;',
              'uniform bool isCircle;',
              'uniform bool hasColor;',

              // 'vec4 toColor(float value, vec2 point) {',
              //     'return vec4(0.0, 0.0, 0.0, 0.0);',
              // '}',

            'void main(void) {',
                'vec4 col = fillColor;',
                'vec4 tcol;',

                'if (hasColor) {',
                    'col = vColor;',
                '}',

                'if (isCircle) {',
                    'tcol = texture2D(uSampler, gl_PointCoord.st);',
                    'col *= tcol;',
                    'if (tcol.r < 0.0) {',
                        'discard;',
                    '} else {',
                        'gl_FragColor = col;',
                    '}',
                '} else {',
                    'gl_FragColor = col;',
                '}',
            '}'
            /* eslint-enable */
        ].join('\n'),
        uLocations = {},
        // The shader program
        shaderProgram,
        // Uniform handle to the perspective matrix
        pUniform,
        // Uniform for point size
        psUniform,
        // Uniform for fill color
        fillColorUniform,
        // Uniform for isBubble
        isBubbleUniform,
        // Uniform for bubble abs sizing
        bubbleSizeAbsUniform,
        bubbleSizeAreaUniform,
        // Skip translation uniform
        skipTranslationUniform,
        // Set to 1 if circle
        isCircleUniform,
        // Uniform for invertion
        isInverted,
        plotHeightUniform,
        // Error stack
        errors = [],
        // Texture uniform
        uSamplerUniform;

    /*
     * Handle errors accumulated in errors stack
     */
    function handleErrors() {
        if (errors.length) {
            H.error('[highcharts boost] shader error - ' + errors.join('\n'));
        }
    }

    /* String to shader program
     * @param {string} str - the program source
     * @param {string} type - the program type: either `vertex` or `fragment`
     * @returns {bool|shader}
     */
    function stringToProgram(str, type) {
        var t = type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER,
            shader = gl.createShader(t);

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            errors.push(
                'when compiling ' +
                type +
                ' shader:\n' +
                gl.getShaderInfoLog(shader)
            );

            return false;
        }
        return shader;
    }

    /*
     * Create the shader.
     * Loads the shader program statically defined above
     */
    function createShader() {
        var v = stringToProgram(vertShade, 'vertex'),
            f = stringToProgram(fragShade, 'fragment');

        if (!v || !f) {
            shaderProgram = false;
            handleErrors();
            return false;
        }

        function uloc(n) {
            return gl.getUniformLocation(shaderProgram, n);
        }

        shaderProgram = gl.createProgram();

        gl.attachShader(shaderProgram, v);
        gl.attachShader(shaderProgram, f);

        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            errors.push(gl.getProgramInfoLog(shaderProgram));
            handleErrors();
            shaderProgram = false;
            return false;
        }

        gl.useProgram(shaderProgram);

        gl.bindAttribLocation(shaderProgram, 0, 'aVertexPosition');

        pUniform = uloc('uPMatrix');
        psUniform = uloc('pSize');
        fillColorUniform = uloc('fillColor');
        isBubbleUniform = uloc('isBubble');
        bubbleSizeAbsUniform = uloc('bubbleSizeAbs');
        bubbleSizeAreaUniform = uloc('bubbleSizeByArea');
        uSamplerUniform = uloc('uSampler');
        skipTranslationUniform = uloc('skipTranslation');
        isCircleUniform = uloc('isCircle');
        isInverted = uloc('isInverted');
        plotHeightUniform = uloc('plotHeight');

        return true;
    }

    /*
     * Destroy the shader
     */
    function destroy() {
        if (gl && shaderProgram) {
            gl.deleteProgram(shaderProgram);
            shaderProgram = false;
        }
    }

    /*
     * Bind the shader.
     * This makes the shader the active one until another one is bound,
     * or until 0 is bound.
     */
    function bind() {
        if (gl && shaderProgram) {
            gl.useProgram(shaderProgram);
        }
    }

    /*
     * Set a uniform value.
     * This uses a hash map to cache uniform locations.
     * @param name {string} - the name of the uniform to set
     * @param val {float} - the value to set
     */
    function setUniform(name, val) {
        if (gl && shaderProgram) {
            var u = uLocations[name] = uLocations[name] ||
                                       gl.getUniformLocation(
                                           shaderProgram,
                                           name
                                       );

            gl.uniform1f(u, val);
        }
    }

    /*
     * Set the active texture
     * @param texture - the texture
     */
    function setTexture(texture) {
        if (gl && shaderProgram) {
            gl.uniform1i(uSamplerUniform, texture);
        }
    }

    /*
     * Set if inversion state
     * @flag is the state
     */
    function setInverted(flag) {
        if (gl && shaderProgram) {
            gl.uniform1i(isInverted, flag);
        }
    }

    /*
     * Enable/disable circle drawing
     */
    function setDrawAsCircle(flag) {
        if (gl && shaderProgram) {
            gl.uniform1i(isCircleUniform, flag ? 1 : 0);
        }
    }

    function setPlotHeight(n) {
        if (gl && shaderProgram) {
            gl.uniform1f(plotHeightUniform, n);
        }
    }

    /*
     * Flush
     */
    function reset() {
        if (gl && shaderProgram) {
            gl.uniform1i(isBubbleUniform, 0);
            gl.uniform1i(isCircleUniform, 0);
        }
    }

    /*
     * Set bubble uniforms
     * @param series {Highcharts.Series} - the series to use
     */
    function setBubbleUniforms(series, zCalcMin, zCalcMax) {
        var seriesOptions = series.options,
            zMin = Number.MAX_VALUE,
            zMax = -Number.MAX_VALUE;

        if (gl && shaderProgram && series.type === 'bubble') {
            zMin = pick(seriesOptions.zMin, Math.min(
                zMin,
                Math.max(
                    zCalcMin,
                    seriesOptions.displayNegative === false ?
                        seriesOptions.zThreshold : -Number.MAX_VALUE
                )
            ));

            zMax = pick(seriesOptions.zMax, Math.max(zMax, zCalcMax));

            gl.uniform1i(isBubbleUniform, 1);
            gl.uniform1i(isCircleUniform, 1);
            gl.uniform1i(
                bubbleSizeAreaUniform,
                series.options.sizeBy !== 'width'
            );
            gl.uniform1i(
                bubbleSizeAbsUniform,
                series.options.sizeByAbsoluteValue
            );

            setUniform('bubbleZMin', zMin);
            setUniform('bubbleZMax', zMax);
            setUniform('bubbleZThreshold', series.options.zThreshold);
            setUniform('bubbleMinSize', series.minPxSize);
            setUniform('bubbleMaxSize', series.maxPxSize);
        }
    }

    /*
     * Set the Color uniform.
     * @param color {Array<float>} - an array with RGBA values
     */
    function setColor(color) {
        if (gl && shaderProgram) {
            gl.uniform4f(
                fillColorUniform,
                color[0] / 255.0,
                color[1] / 255.0,
                color[2] / 255.0,
                color[3]
            );
        }
    }

    /*
     * Set skip translation
     */
    function setSkipTranslation(flag) {
        if (gl && shaderProgram) {
            gl.uniform1i(skipTranslationUniform, flag === true ? 1 : 0);
        }
    }

    /*
     * Set the perspective matrix
     * @param m {Matrix4x4} - the matrix
     */
    function setPMatrix(m) {
        if (gl && shaderProgram) {
            gl.uniformMatrix4fv(pUniform, false, m);
        }
    }

    /*
     * Set the point size.
     * @param p {float} - point size
     */
    function setPointSize(p) {
        if (gl && shaderProgram) {
            gl.uniform1f(psUniform, p);
        }
    }

    /*
     * Get the shader program handle
     * @returns {GLInt} - the handle for the program
     */
    function getProgram() {
        return shaderProgram;
    }

    if (gl) {
        if (!createShader()) {
            return false;
        }
    }

    return {
        psUniform: function () {
            return psUniform;
        },
        pUniform: function () {
            return pUniform;
        },
        fillColorUniform: function () {
            return fillColorUniform;
        },
        setPlotHeight: setPlotHeight,
        setBubbleUniforms: setBubbleUniforms,
        bind: bind,
        program: getProgram,
        create: createShader,
        setUniform: setUniform,
        setPMatrix: setPMatrix,
        setColor: setColor,
        setPointSize: setPointSize,
        setSkipTranslation: setSkipTranslation,
        setTexture: setTexture,
        setDrawAsCircle: setDrawAsCircle,
        reset: reset,
        setInverted: setInverted,
        destroy: destroy
    };
}

/**
 * Vertex Buffer abstraction.
 * A vertex buffer is a set of vertices which are passed to the GPU
 * in a single call.
 *
 * @private
 * @function GLVertexBuffer
 *
 * @param {WebGLContext} gl
 *        the context in which to create the buffer
 *
 * @param {GLShader} shader
 *        the shader to use
 *
 * @return {*}
 */
function GLVertexBuffer(gl, shader, dataComponents /* , type */) {
    var buffer = false,
        vertAttribute = false,
        components = dataComponents || 2,
        preAllocated = false,
        iterator = 0,
        // farray = false,
        data;

    // type = type || 'float';

    function destroy() {
        if (buffer) {
            gl.deleteBuffer(buffer);
            buffer = false;
            vertAttribute = false;
        }

        iterator = 0;
        components = dataComponents || 2;
        data = [];
    }

    /*
     * Build the buffer
      * @param dataIn {Array<float>} - a 0 padded array of indices
      * @param attrib {String} - the name of the Attribute to bind the buffer to
      * @param dataComponents {Integer} - the number of components per. indice
     */
    function build(dataIn, attrib, dataComponents) {
        var farray;

        data = dataIn || [];

        if ((!data || data.length === 0) && !preAllocated) {
            // console.error('trying to render empty vbuffer');
            destroy();
            return false;
        }

        components = dataComponents || components;

        if (buffer) {
            gl.deleteBuffer(buffer);
        }

        if (!preAllocated) {
            farray = new Float32Array(data);
        }

        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            preAllocated || farray,
            gl.STATIC_DRAW
        );

        // gl.bindAttribLocation(shader.program(), 0, 'aVertexPosition');
        vertAttribute = gl.getAttribLocation(shader.program(), attrib);
        gl.enableVertexAttribArray(vertAttribute);

        // Trigger cleanup
        farray = false;

        return true;
    }

    /*
     * Bind the buffer
     */
    function bind() {
        if (!buffer) {
            return false;
        }

        // gl.bindAttribLocation(shader.program(), 0, 'aVertexPosition');
        // gl.enableVertexAttribArray(vertAttribute);
        // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(
            vertAttribute, components, gl.FLOAT, false, 0, 0
        );
        // gl.enableVertexAttribArray(vertAttribute);
    }

    /*
     * Render the buffer
     * @param from {Integer} - the start indice
     * @param to {Integer} - the end indice
     * @param drawMode {String} - the draw mode
     */
    function render(from, to, drawMode) {
        var length = preAllocated ? preAllocated.length : data.length;

        if (!buffer) {
            return false;
        }

        if (!length) {
            return false;
        }

        if (!from || from > length || from < 0) {
            from = 0;
        }

        if (!to || to > length) {
            to = length;
        }

        drawMode = drawMode || 'points';

        gl.drawArrays(
            gl[drawMode.toUpperCase()],
            from / components,
            (to - from) / components
        );

        return true;
    }

    function push(x, y, a, b) {
        if (preAllocated) { // && iterator <= preAllocated.length - 4) {
            preAllocated[++iterator] = x;
            preAllocated[++iterator] = y;
            preAllocated[++iterator] = a;
            preAllocated[++iterator] = b;
        }
    }

    /*
     * Note about pre-allocated buffers:
     *     - This is slower for charts with many series
     */
    function allocate(size) {
        size *= 4;
        iterator = -1;

        preAllocated = new Float32Array(size);
    }

    // /////////////////////////////////////////////////////////////////////////
    return {
        destroy: destroy,
        bind: bind,
        data: data,
        build: build,
        render: render,
        allocate: allocate,
        push: push
    };
}

/**
 * Main renderer. Used to render series.
 *
 * Notes to self:
 * - May be able to build a point map by rendering to a separate canvas and
 *   encoding values in the color data.
 * - Need to figure out a way to transform the data quicker
 *
 * @private
 * @function GLRenderer
 *
 * @param {Function} postRenderCallback
 *
 * @return {*}
 */
function GLRenderer(postRenderCallback) {
    var // Shader
        shader = false,
        // Vertex buffers - keyed on shader attribute name
        vbuffer = false,
        // Opengl context
        gl = false,
        // Width of our viewport in pixels
        width = 0,
        // Height of our viewport in pixels
        height = 0,
        // The data to render - array of coordinates
        data = false,
        // The marker data
        markerData = false,
        // Exports
        exports = {},
        // Is it inited?
        isInited = false,
        // The series stack
        series = [],

        // Texture handles
        textureHandles = {},

        // Things to draw as "rectangles" (i.e lines)
        asBar = {
            'column': true,
            'columnrange': true,
            'bar': true,
            'area': true,
            'arearange': true
        },
        asCircle = {
            'scatter': true,
            'bubble': true
        },
        // Render settings
        settings = {
            pointSize: 1,
            lineWidth: 1,
            fillColor: '#AA00AA',
            useAlpha: true,
            usePreallocated: false,
            useGPUTranslations: false,
            debug: {
                timeRendering: false,
                timeSeriesProcessing: false,
                timeSetup: false,
                timeBufferCopy: false,
                timeKDTree: false,
                showSkipSummary: false
            }
        };

    // /////////////////////////////////////////////////////////////////////////

    function setOptions(options) {
        merge(true, settings, options);
    }

    function seriesPointCount(series) {
        var isStacked,
            xData,
            s;

        if (series.isSeriesBoosting) {
            isStacked = !!series.options.stacking;
            xData = (
                series.xData ||
                series.options.xData ||
                series.processedXData
            );
            s = (isStacked ? series.data : (xData || series.options.data))
                .length;

            if (series.type === 'treemap') {
                s *= 12;
            } else if (series.type === 'heatmap') {
                s *= 6;
            } else if (asBar[series.type]) {
                s *= 2;
            }

            return s;
        }

        return 0;
    }

    /* Allocate a float buffer to fit all series */
    function allocateBuffer(chart) {
        var s = 0;

        if (!settings.usePreallocated) {
            return;
        }

        chart.series.forEach(function (series) {
            if (series.isSeriesBoosting) {
                s += seriesPointCount(series);
            }
        });

        vbuffer.allocate(s);
    }

    function allocateBufferForSingleSeries(series) {
        var s = 0;

        if (!settings.usePreallocated) {
            return;
        }

        if (series.isSeriesBoosting) {
            s = seriesPointCount(series);
        }

        vbuffer.allocate(s);
    }

    /*
     * Returns an orthographic perspective matrix
     * @param {number} width - the width of the viewport in pixels
     * @param {number} height - the height of the viewport in pixels
     */
    function orthoMatrix(width, height) {
        var near = 0,
            far = 1;

        return [
            2 / width, 0, 0, 0,
            0, -(2 / height), 0, 0,
            0, 0, -2 / (far - near), 0,
            -1, 1, -(far + near) / (far - near), 1
        ];
    }

    /*
     * Clear the depth and color buffer
     */
    function clear() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    /*
     * Get the WebGL context
     * @returns {WebGLContext} - the context
     */
    function getGL() {
        return gl;
    }

    /*
     * Push data for a single series
     * This calculates additional vertices and transforms the data to be
     * aligned correctly in memory
     */
    function pushSeriesData(series, inst) {
        var isRange = series.pointArrayMap &&
                        series.pointArrayMap.join(',') === 'low,high',
            chart = series.chart,
            options = series.options,
            isStacked = !!options.stacking,
            rawData = options.data,
            xExtremes = series.xAxis.getExtremes(),
            xMin = xExtremes.min,
            xMax = xExtremes.max,
            yExtremes = series.yAxis.getExtremes(),
            yMin = yExtremes.min,
            yMax = yExtremes.max,
            xData = series.xData || options.xData || series.processedXData,
            yData = series.yData || options.yData || series.processedYData,
            zData = series.zData || options.zData || series.processedZData,
            yAxis = series.yAxis,
            xAxis = series.xAxis,
            plotHeight = series.chart.plotHeight,
            plotWidth = series.chart.plotWidth,
            useRaw = !xData || xData.length === 0,
            // threshold = options.threshold,
            // yBottom = chart.yAxis[0].getThreshold(threshold),
            // hasThreshold = isNumber(threshold),
            // colorByPoint = series.options.colorByPoint,
            // This is required for color by point, so make sure this is
            // uncommented if enabling that
            // colorIndex = 0,
            // Required for color axis support
            // caxis,
            connectNulls = options.connectNulls,
            // For some reason eslint doesn't pick up that this is actually used
            maxVal, // eslint-disable-line no-unused-vars
            points = series.points || false,
            lastX = false,
            lastY = false,
            minVal,
            color,
            scolor,
            sdata = isStacked ? series.data : (xData || rawData),
            closestLeft = { x: Number.MAX_VALUE, y: 0 },
            closestRight = { x: -Number.MAX_VALUE, y: 0 },

            skipped = 0,
            hadPoints = false,

            cullXThreshold = 1,
            cullYThreshold = 1,

            // The following are used in the builder while loop
            x,
            y,
            d,
            z,
            i = -1,
            px = false,
            nx = false,
            // This is in fact used.
            low, // eslint-disable-line no-unused-vars
            chartDestroyed = typeof chart.index === 'undefined',
            nextInside = false,
            prevInside = false,
            pcolor = false,
            drawAsBar = asBar[series.type],
            isXInside = false,
            isYInside = true,
            firstPoint = true,
            threshold = options.threshold;

        if (options.boostData && options.boostData.length > 0) {
            return;
        }

        if (chart.inverted) {
            plotHeight = series.chart.plotWidth;
            plotWidth = series.chart.plotHeight;
        }

        series.closestPointRangePx = Number.MAX_VALUE;

        // Push color to color buffer - need to do this per. vertex
        function pushColor(color) {
            if (color) {
                inst.colorData.push(color[0]);
                inst.colorData.push(color[1]);
                inst.colorData.push(color[2]);
                inst.colorData.push(color[3]);
            }
        }

        // Push a vertice to the data buffer
        function vertice(x, y, checkTreshold, pointSize, color) {
            pushColor(color);
            if (settings.usePreallocated) {
                vbuffer.push(x, y, checkTreshold ? 1 : 0, pointSize || 1);
            } else {
                data.push(x);
                data.push(y);
                data.push(checkTreshold ? 1 : 0);
                data.push(pointSize || 1);
            }
        }

        function closeSegment() {
            if (inst.segments.length) {
                inst.segments[inst.segments.length - 1].to = data.length;
            }
        }

        // Create a new segment for the current set
        function beginSegment() {
            // Insert a segment on the series.
            // A segment is just a start indice.
            // When adding a segment, if one exists from before, it should
            // set the previous segment's end

            if (inst.segments.length &&
                inst.segments[inst.segments.length - 1].from === data.length
            ) {
                return;
            }

            closeSegment();

            inst.segments.push({
                from: data.length
            });

        }

        // Push a rectangle to the data buffer
        function pushRect(x, y, w, h, color) {
            pushColor(color);
            vertice(x + w, y);
            pushColor(color);
            vertice(x, y);
            pushColor(color);
            vertice(x, y + h);

            pushColor(color);
            vertice(x, y + h);
            pushColor(color);
            vertice(x + w, y + h);
            pushColor(color);
            vertice(x + w, y);
        }

        // Create the first segment
        beginSegment();

        // Special case for point shapes
        if (points && points.length > 0) {

            // If we're doing points, we assume that the points are already
            // translated, so we skip the shader translation.
            inst.skipTranslation = true;
            // Force triangle draw mode
            inst.drawMode = 'triangles';

            // We don't have a z component in the shader, so we need to sort.
            if (points[0].node && points[0].node.levelDynamic) {
                points.sort(function (a, b) {
                    if (a.node) {
                        if (a.node.levelDynamic > b.node.levelDynamic) {
                            return 1;
                        }
                        if (a.node.levelDynamic < b.node.levelDynamic) {
                            return -1;
                        }
                    }
                    return 0;
                });
            }

            points.forEach(function (point) {
                var plotY = point.plotY,
                    shapeArgs,
                    swidth,
                    pointAttr;

                if (
                    typeof plotY !== 'undefined' &&
                    !isNaN(plotY) &&
                    point.y !== null
                ) {
                    shapeArgs = point.shapeArgs;

                    pointAttr = chart.styledMode ?
                        point.series.colorAttribs(point) :
                        pointAttr = point.series.pointAttribs(point);

                    swidth = pointAttr['stroke-width'] || 0;

                    // Handle point colors
                    color = H.color(pointAttr.fill).rgba;
                    color[0] /= 255.0;
                    color[1] /= 255.0;
                    color[2] /= 255.0;

                    // So there are two ways of doing this. Either we can
                    // create a rectangle of two triangles, or we can do a
                    // point and use point size. Latter is faster, but
                    // only supports squares. So we're doing triangles.
                    // We could also use one color per. vertice to get
                    // better color interpolation.

                    // If there's stroking, we do an additional rect
                    if (series.type === 'treemap') {
                        swidth = swidth || 1;
                        scolor = H.color(pointAttr.stroke).rgba;

                        scolor[0] /= 255.0;
                        scolor[1] /= 255.0;
                        scolor[2] /= 255.0;

                        pushRect(
                            shapeArgs.x,
                            shapeArgs.y,
                            shapeArgs.width,
                            shapeArgs.height,
                            scolor
                        );

                        swidth /= 2;
                    }
                    // } else {
                    //     swidth = 0;
                    // }

                    // Fixes issues with inverted heatmaps (see #6981)
                    // The root cause is that the coordinate system is flipped.
                    // In other words, instead of [0,0] being top-left, it's
                    // bottom-right. This causes a vertical and horizontal flip
                    // in the resulting image, making it rotated 180 degrees.
                    if (series.type === 'heatmap' && chart.inverted) {
                        shapeArgs.x = xAxis.len - shapeArgs.x;
                        shapeArgs.y = yAxis.len - shapeArgs.y;
                        shapeArgs.width = -shapeArgs.width;
                        shapeArgs.height = -shapeArgs.height;
                    }

                    pushRect(
                        shapeArgs.x + swidth,
                        shapeArgs.y + swidth,
                        shapeArgs.width - (swidth * 2),
                        shapeArgs.height - (swidth * 2),
                        color
                    );
                }
            });

            closeSegment();

            return;
        }

        // Extract color axis
        // (chart.axes || []).forEach(function (a) {
        //     if (H.ColorAxis && a instanceof H.ColorAxis) {
        //         caxis = a;
        //     }
        // });

        while (i < sdata.length - 1) {
            d = sdata[++i];

            // px = x = y = z = nx = low = false;
            // chartDestroyed = typeof chart.index === 'undefined';
            // nextInside = prevInside = pcolor = isXInside = isYInside = false;
            // drawAsBar = asBar[series.type];

            if (chartDestroyed) {
                break;
            }

            // Uncomment this to enable color by point.
            // This currently left disabled as the charts look really ugly
            // when enabled and there's a lot of points.
            // Leaving in for the future (tm).
            // if (colorByPoint) {
            //     colorIndex = ++colorIndex %
            //         series.chart.options.colors.length;
            //     pcolor = toRGBAFast(series.chart.options.colors[colorIndex]);
            //     pcolor[0] /= 255.0;
            //     pcolor[1] /= 255.0;
            //     pcolor[2] /= 255.0;
            // }

            if (useRaw) {
                x = d[0];
                y = d[1];

                if (sdata[i + 1]) {
                    nx = sdata[i + 1][0];
                }

                if (sdata[i - 1]) {
                    px = sdata[i - 1][0];
                }

                if (d.length >= 3) {
                    z = d[2];

                    if (d[2] > inst.zMax) {
                        inst.zMax = d[2];
                    }

                    if (d[2] < inst.zMin) {
                        inst.zMin = d[2];
                    }
                }

            } else {
                x = d;
                y = yData[i];

                if (sdata[i + 1]) {
                    nx = sdata[i + 1];
                }

                if (sdata[i - 1]) {
                    px = sdata[i - 1];
                }

                if (zData && zData.length) {
                    z = zData[i];

                    if (zData[i] > inst.zMax) {
                        inst.zMax = zData[i];
                    }

                    if (zData[i] < inst.zMin) {
                        inst.zMin = zData[i];
                    }
                }
            }

            if (!connectNulls && (x === null || y === null)) {
                beginSegment();
                continue;
            }

            if (nx && nx >= xMin && nx <= xMax) {
                nextInside = true;
            }

            if (px && px >= xMin && px <= xMax) {
                prevInside = true;
            }

            if (isRange) {
                if (useRaw) {
                    y = d.slice(1, 3);
                }

                low = y[0];
                y = y[1];

            } else if (isStacked) {
                x = d.x;
                y = d.stackY;
                low = y - d.y;
            }

            if (yMin !== null &&
                typeof yMin !== 'undefined' &&
                yMax !== null &&
                typeof yMax !== 'undefined'
            ) {
                isYInside = y >= yMin && y <= yMax;
            }

            if (x > xMax && closestRight.x < xMax) {
                closestRight.x = x;
                closestRight.y = y;
            }

            if (x < xMin && closestLeft.x > xMin) {
                closestLeft.x = x;
                closestLeft.y = y;
            }

            if (y === null && connectNulls) {
                continue;
            }

            // Cull points outside the extremes
            if (y === null || (!isYInside && !nextInside && !prevInside)) {
                beginSegment();
                continue;
            }

            if (x >= xMin && x <= xMax) {
                isXInside = true;
            }

            if (!isXInside && !nextInside && !prevInside) {
                continue;
            }

            // Skip translations - temporary floating point fix
            if (!settings.useGPUTranslations) {
                inst.skipTranslation = true;
                x = xAxis.toPixels(x, true);
                y = yAxis.toPixels(y, true);

                // Make sure we're not drawing outside of the chart area.
                // See #6594.
                if (y > plotHeight) {
                    y = plotHeight;
                }

                if (x > plotWidth) {
                    // If this is  rendered as a point, just skip drawing it
                    // entirely, as we're not dependandt on lineTo'ing to it.
                    // See #8197
                    if (inst.drawMode === 'points') {
                        continue;
                    }

                    // Having this here will clamp markers and make the angle
                    // of the last line wrong. See 9166.
                    // x = plotWidth;

                }

            }

            if (drawAsBar) {

                maxVal = y;
                minVal = low;

                if (low === false || typeof low === 'undefined') {
                    if (y < 0) {
                        minVal = y;
                    } else {
                        minVal = 0;
                    }
                }

                if (!isRange && !isStacked) {
                    minVal = Math.max(threshold, yMin); // #8731
                }
                if (!settings.useGPUTranslations) {
                    minVal = yAxis.toPixels(minVal, true);
                }

                // Need to add an extra point here
                vertice(x, minVal, 0, 0, pcolor);
            }

            // No markers on out of bounds things.
            // Out of bound things are shown if and only if the next
            // or previous point is inside the rect.
            if (inst.hasMarkers && isXInside) {
                // x = H.correctFloat(
                //     Math.min(Math.max(-1e5, xAxis.translate(
                //         x,
                //         0,
                //         0,
                //         0,
                //         1,
                //         0.5,
                //         false
                //     )), 1e5)
                // );

                if (lastX !== false) {
                    series.closestPointRangePx = Math.min(
                        series.closestPointRangePx,
                        Math.abs(x - lastX)
                    );
                }
            }

            // If the last _drawn_ point is closer to this point than the
            // threshold, skip it. Shaves off 20-100ms in processing.

            if (!settings.useGPUTranslations &&
                !settings.usePreallocated &&
                (lastX && Math.abs(x - lastX) < cullXThreshold) &&
                (lastY && Math.abs(y - lastY) < cullYThreshold)
            ) {
                if (settings.debug.showSkipSummary) {
                    ++skipped;
                }

                continue;
            }

            // Do step line if enabled.
            // Draws an additional point at the old Y at the new X.
            // See #6976.

            if (options.step && !firstPoint) {
                vertice(
                    x,
                    lastY,
                    0,
                    2,
                    pcolor
                );
            }

            vertice(
                x,
                y,
                0,
                series.type === 'bubble' ? (z || 1) : 2,
                pcolor
            );

            // Uncomment this to support color axis.
            // if (caxis) {
            //     color = H.color(caxis.toColor(y)).rgba;

            //     inst.colorData.push(color[0] / 255.0);
            //     inst.colorData.push(color[1] / 255.0);
            //     inst.colorData.push(color[2] / 255.0);
            //     inst.colorData.push(color[3]);
            // }

            lastX = x;
            lastY = y;

            hadPoints = true;
            firstPoint = false;
        }

        if (settings.debug.showSkipSummary) {
            console.log('skipped points:', skipped); // eslint-disable-line no-console
        }

        function pushSupplementPoint(point, atStart) {
            if (!settings.useGPUTranslations) {
                inst.skipTranslation = true;
                point.x = xAxis.toPixels(point.x, true);
                point.y = yAxis.toPixels(point.y, true);
            }

            // We should only do this for lines, and we should ignore markers
            // since there's no point here that would have a marker.

            if (atStart) {
                data = [point.x, point.y, 0, 2].concat(data);
                return;
            }

            vertice(
                point.x,
                point.y,
                0,
                2
            );
        }

        if (
            !hadPoints &&
            connectNulls !== false &&
            series.drawMode === 'line_strip'
        ) {
            if (closestLeft.x < Number.MAX_VALUE) {
                // We actually need to push this *before* the complete buffer.
                pushSupplementPoint(closestLeft, true);
            }

            if (closestRight.x > -Number.MAX_VALUE) {
                pushSupplementPoint(closestRight);
            }
        }

        closeSegment();
    }

    /*
     * Push a series to the renderer
     * If we render the series immediatly, we don't have to loop later
     * @param s {Highchart.Series} - the series to push
     */
    function pushSeries(s) {
        if (series.length > 0) {
            // series[series.length - 1].to = data.length;
            if (series[series.length - 1].hasMarkers) {
                series[series.length - 1].markerTo = markerData.length;
            }
        }

        if (settings.debug.timeSeriesProcessing) {
            console.time('building ' + s.type + ' series'); // eslint-disable-line no-console
        }

        series.push({
            segments: [],
            // from: data.length,
            markerFrom: markerData.length,
            // Push RGBA values to this array to use per. point coloring.
            // It should be 0-padded, so each component should be pushed in
            // succession.
            colorData: [],
            series: s,
            zMin: Number.MAX_VALUE,
            zMax: -Number.MAX_VALUE,
            hasMarkers: s.options.marker ?
                s.options.marker.enabled !== false :
                false,
            showMarkers: true,
            drawMode: ({
                'area': 'lines',
                'arearange': 'lines',
                'areaspline': 'line_strip',
                'column': 'lines',
                'columnrange': 'lines',
                'bar': 'lines',
                'line': 'line_strip',
                'scatter': 'points',
                'heatmap': 'triangles',
                'treemap': 'triangles',
                'bubble': 'points'
            })[s.type] || 'line_strip'
        });

        // Add the series data to our buffer(s)
        pushSeriesData(s, series[series.length - 1]);

        if (settings.debug.timeSeriesProcessing) {
            console.timeEnd('building ' + s.type + ' series'); // eslint-disable-line no-console
        }
    }

    /*
     * Flush the renderer.
     * This removes pushed series and vertices.
     * Should be called after clearing and before rendering
     */
    function flush() {
        series = [];
        exports.data = data = [];
        markerData = [];

        if (vbuffer) {
            vbuffer.destroy();
        }
    }

    /*
     * Pass x-axis to shader
     * @param axis {Highcharts.Axis} - the x-axis
     */
    function setXAxis(axis) {
        if (!shader) {
            return;
        }

        shader.setUniform('xAxisTrans', axis.transA);
        shader.setUniform('xAxisMin', axis.min);
        shader.setUniform('xAxisMinPad', axis.minPixelPadding);
        shader.setUniform('xAxisPointRange', axis.pointRange);
        shader.setUniform('xAxisLen', axis.len);
        shader.setUniform('xAxisPos', axis.pos);
        shader.setUniform('xAxisCVSCoord', !axis.horiz);
    }

    /*
     * Pass y-axis to shader
     * @param axis {Highcharts.Axis} - the y-axis
     */
    function setYAxis(axis) {
        if (!shader) {
            return;
        }

        shader.setUniform('yAxisTrans', axis.transA);
        shader.setUniform('yAxisMin', axis.min);
        shader.setUniform('yAxisMinPad', axis.minPixelPadding);
        shader.setUniform('yAxisPointRange', axis.pointRange);
        shader.setUniform('yAxisLen', axis.len);
        shader.setUniform('yAxisPos', axis.pos);
        shader.setUniform('yAxisCVSCoord', !axis.horiz);
    }

    /*
     * Set the translation threshold
     * @param has {boolean} - has threshold flag
     * @param translation {Float} - the threshold
     */
    function setThreshold(has, translation) {
        shader.setUniform('hasThreshold', has);
        shader.setUniform('translatedThreshold', translation);
    }

    /*
     * Render the data
     * This renders all pushed series.
     */
    function render(chart) {

        if (chart) {
            if (!chart.chartHeight || !chart.chartWidth) {
                // chart.setChartSize();
            }

            width = chart.chartWidth || 800;
            height = chart.chartHeight || 400;
        } else {
            return false;
        }

        if (!gl || !width || !height || !shader) {
            return false;
        }

        if (settings.debug.timeRendering) {
            console.time('gl rendering'); // eslint-disable-line no-console
        }

        gl.canvas.width = width;
        gl.canvas.height = height;

        shader.bind();

        gl.viewport(0, 0, width, height);
        shader.setPMatrix(orthoMatrix(width, height));
        shader.setPlotHeight(chart.plotHeight);

        if (settings.lineWidth > 1 && !H.isMS) {
            gl.lineWidth(settings.lineWidth);
        }

        vbuffer.build(exports.data, 'aVertexPosition', 4);
        vbuffer.bind();

        shader.setInverted(chart.inverted);

        // Render the series
        series.forEach(function (s, si) {
            var options = s.series.options,
                shapeOptions = options.marker,
                sindex,
                lineWidth = typeof options.lineWidth !== 'undefined' ?
                    options.lineWidth :
                    1,
                threshold = options.threshold,
                hasThreshold = isNumber(threshold),
                yBottom = s.series.yAxis.getThreshold(threshold),
                translatedThreshold = yBottom,
                cbuffer,
                showMarkers = pick(
                    options.marker ? options.marker.enabled : null,
                    s.series.xAxis.isRadial ? true : null,
                    s.series.closestPointRangePx >
                        2 * ((
                            options.marker ?
                                options.marker.radius :
                                10
                        ) || 10)
                ),
                fillColor,
                shapeTexture = textureHandles[
                    (shapeOptions && shapeOptions.symbol) || s.series.symbol
                ] || textureHandles.circle,
                color;

            if (
                s.segments.length === 0 ||
                (s.segmentslength && s.segments[0].from === s.segments[0].to)
            ) {
                return;
            }

            if (shapeTexture.isReady) {
                gl.bindTexture(gl.TEXTURE_2D, shapeTexture.handle);
                shader.setTexture(shapeTexture.handle);
            }

            if (chart.styledMode) {
                fillColor = (
                    s.series.markerGroup &&
                    s.series.markerGroup.getStyle('fill')
                );

            } else {
                fillColor =
                    (s.series.pointAttribs && s.series.pointAttribs().fill) ||
                    s.series.color;

                if (options.colorByPoint) {
                    fillColor = s.series.chart.options.colors[si];
                }
            }

            if (s.series.fillOpacity && options.fillOpacity) {
                fillColor = new Color(fillColor).setOpacity(
                    pick(options.fillOpacity, 1.0)
                ).get();
            }

            color = H.color(fillColor).rgba;

            if (!settings.useAlpha) {
                color[3] = 1.0;
            }

            // This is very much temporary
            if (s.drawMode === 'lines' && settings.useAlpha && color[3] < 1) {
                color[3] /= 10;
            }

            // Blending
            if (options.boostBlending === 'add') {
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                gl.blendEquation(gl.FUNC_ADD);

            } else if (options.boostBlending === 'mult' ||
                options.boostBlending === 'multiply'
            ) {
                gl.blendFunc(gl.DST_COLOR, gl.ZERO);

            } else if (options.boostBlending === 'darken') {
                gl.blendFunc(gl.ONE, gl.ONE);
                gl.blendEquation(gl.FUNC_MIN);

            } else {
                // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                // gl.blendEquation(gl.FUNC_ADD);
                gl.blendFuncSeparate(
                    gl.SRC_ALPHA,
                    gl.ONE_MINUS_SRC_ALPHA,
                    gl.ONE,
                    gl.ONE_MINUS_SRC_ALPHA
                );
            }

            shader.reset();

            // If there are entries in the colorData buffer, build and bind it.
            if (s.colorData.length > 0) {
                shader.setUniform('hasColor', 1.0);
                cbuffer = GLVertexBuffer(gl, shader); // eslint-disable-line new-cap
                cbuffer.build(s.colorData, 'aColor', 4);
                cbuffer.bind();
            }

            // Set series specific uniforms
            shader.setColor(color);
            setXAxis(s.series.xAxis);
            setYAxis(s.series.yAxis);
            setThreshold(hasThreshold, translatedThreshold);

            if (s.drawMode === 'points') {
                if (options.marker && options.marker.radius) {
                    shader.setPointSize(options.marker.radius * 2.0);
                } else {
                    shader.setPointSize(1);
                }
            }

            // If set to true, the toPixels translations in the shader
            // is skipped, i.e it's assumed that the value is a pixel coord.
            shader.setSkipTranslation(s.skipTranslation);

            if (s.series.type === 'bubble') {
                shader.setBubbleUniforms(s.series, s.zMin, s.zMax);
            }

            shader.setDrawAsCircle(
                asCircle[s.series.type] || false
            );

            // Do the actual rendering
            // If the line width is < 0, skip rendering of the lines. See #7833.
            if (lineWidth > 0 || s.drawMode !== 'line_strip') {
                for (sindex = 0; sindex < s.segments.length; sindex++) {
                    // if (s.segments[sindex].from < s.segments[sindex].to) {
                    vbuffer.render(
                        s.segments[sindex].from,
                        s.segments[sindex].to,
                        s.drawMode
                    );
                    // }
                }
            }

            if (s.hasMarkers && showMarkers) {
                if (options.marker && options.marker.radius) {
                    shader.setPointSize(options.marker.radius * 2.0);
                } else {
                    shader.setPointSize(10);
                }
                shader.setDrawAsCircle(true);
                for (sindex = 0; sindex < s.segments.length; sindex++) {
                    // if (s.segments[sindex].from < s.segments[sindex].to) {
                    vbuffer.render(
                        s.segments[sindex].from,
                        s.segments[sindex].to,
                        'POINTS'
                    );
                    // }
                }
            }
        });

        if (settings.debug.timeRendering) {
            console.timeEnd('gl rendering'); // eslint-disable-line no-console
        }

        if (postRenderCallback) {
            postRenderCallback();
        }

        flush();
    }

    /*
     * Render the data when ready
     */
    function renderWhenReady(chart) {
        clear();

        if (chart.renderer.forExport) {
            return render(chart);
        }

        if (isInited) {
            render(chart);
        } else {
            setTimeout(function () {
                renderWhenReady(chart);
            }, 1);
        }
    }

    /*
     * Set the viewport size in pixels
     * Creates an orthographic perspective matrix and applies it.
     * @param w {Integer} - the width of the viewport
     * @param h {Integer} - the height of the viewport
     */
    function setSize(w, h) {
        // Skip if there's no change, or if we have no valid shader
        if ((width === w && height === h) || !shader) {
            return;
        }

        width = w;
        height = h;

        shader.bind();
        shader.setPMatrix(orthoMatrix(width, height));
    }

    /*
     * Init OpenGL
     * @param canvas {HTMLCanvas} - the canvas to render to
     */
    function init(canvas, noFlush) {
        var i = 0,
            contexts = [
                'webgl',
                'experimental-webgl',
                'moz-webgl',
                'webkit-3d'
            ];

        isInited = false;

        if (!canvas) {
            return false;
        }

        if (settings.debug.timeSetup) {
            console.time('gl setup'); // eslint-disable-line no-console
        }

        for (; i < contexts.length; i++) {
            gl = canvas.getContext(contexts[i], {
            //    premultipliedAlpha: false
            });
            if (gl) {
                break;
            }
        }

        if (gl) {
            if (!noFlush) {
                flush();
            }
        } else {
            return false;
        }

        gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.DEPTH_TEST);
        // gl.depthMask(gl.FALSE);
        gl.depthFunc(gl.LESS);

        shader = GLShader(gl); // eslint-disable-line new-cap

        if (!shader) {
            // We need to abort, there's no shader context
            return false;
        }

        vbuffer = GLVertexBuffer(gl, shader); // eslint-disable-line new-cap

        function createTexture(name, fn) {
            var props = {
                    isReady: false,
                    texture: doc.createElement('canvas'),
                    handle: gl.createTexture()
                },
                ctx = props.texture.getContext('2d');

            textureHandles[name] = props;

            props.texture.width = 512;
            props.texture.height = 512;

            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;

            ctx.strokeStyle = 'rgba(255, 255, 255, 0)';
            ctx.fillStyle = '#FFF';

            fn(ctx);

            try {

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, props.handle);
                // gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGBA,
                    gl.RGBA,
                    gl.UNSIGNED_BYTE,
                    props.texture
                );

                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_WRAP_S,
                    gl.CLAMP_TO_EDGE
                );

                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_WRAP_T,
                    gl.CLAMP_TO_EDGE
                );

                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_MAG_FILTER,
                    gl.LINEAR
                );

                gl.texParameteri(
                    gl.TEXTURE_2D,
                    gl.TEXTURE_MIN_FILTER,
                    gl.LINEAR
                );

                // gl.generateMipmap(gl.TEXTURE_2D);

                gl.bindTexture(gl.TEXTURE_2D, null);

                props.isReady = true;
            } catch (e) {}
        }

        // Circle shape
        createTexture('circle', function (ctx) {
            ctx.beginPath();
            ctx.arc(256, 256, 256, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        });

        // Square shape
        createTexture('square', function (ctx) {
            ctx.fillRect(0, 0, 512, 512);
        });

        // Diamond shape
        createTexture('diamond', function (ctx) {
            ctx.beginPath();
            ctx.moveTo(256, 0);
            ctx.lineTo(512, 256);
            ctx.lineTo(256, 512);
            ctx.lineTo(0, 256);
            ctx.lineTo(256, 0);
            ctx.fill();
        });

        // Triangle shape
        createTexture('triangle', function (ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 512);
            ctx.lineTo(256, 0);
            ctx.lineTo(512, 512);
            ctx.lineTo(0, 512);
            ctx.fill();
        });

        // Triangle shape (rotated)
        createTexture('triangle-down', function (ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(256, 512);
            ctx.lineTo(512, 0);
            ctx.lineTo(0, 0);
            ctx.fill();
        });

        isInited = true;

        if (settings.debug.timeSetup) {
            console.timeEnd('gl setup'); // eslint-disable-line no-console
        }

        return true;
    }

    /*
     * Check if we have a valid OGL context
     * @returns {Boolean} - true if the context is valid
     */
    function valid() {
        return gl !== false;
    }

    /*
     * Check if the renderer has been initialized
     * @returns {Boolean} - true if it has, false if not
     */
    function inited() {
        return isInited;
    }

    function destroy() {
        flush();
        vbuffer.destroy();
        shader.destroy();
        if (gl) {

            objEach(textureHandles, function (key) {
                if (textureHandles[key].handle) {
                    gl.deleteTexture(textureHandles[key].handle);
                }
            });

            gl.canvas.width = 1;
            gl.canvas.height = 1;
        }
    }

    // /////////////////////////////////////////////////////////////////////////
    exports = {
        allocateBufferForSingleSeries: allocateBufferForSingleSeries,
        pushSeries: pushSeries,
        setSize: setSize,
        inited: inited,
        setThreshold: setThreshold,
        init: init,
        render: renderWhenReady,
        settings: settings,
        valid: valid,
        clear: clear,
        flush: flush,
        setXAxis: setXAxis,
        setYAxis: setYAxis,
        data: data,
        gl: getGL,
        allocateBuffer: allocateBuffer,
        destroy: destroy,
        setOptions: setOptions
    };

    return exports;
}

// END OF WEBGL ABSTRACTIONS
// /////////////////////////////////////////////////////////////////////////////

/**
 * Create a canvas + context and attach it to the target
 *
 * @private
 * @function createAndAttachRenderer
 *
 * @param {Highcharts.Chart|Highcharts.Series} target
 *        the canvas target
 *
 * @param {Highcharts.Chart} chart
 *        the chart
 *
 * @return {*}
 */
function createAndAttachRenderer(chart, series) {
    var width = chart.chartWidth,
        height = chart.chartHeight,
        target = chart,
        targetGroup = chart.seriesGroup || series.group,
        alpha = 1,
        foSupported = doc.implementation.hasFeature(
            'www.http://w3.org/TR/SVG11/feature#Extensibility',
            '1.1'
        );

    if (chart.isChartSeriesBoosting()) {
        target = chart;
    } else {
        target = series;
    }

    // Support for foreignObject is flimsy as best.
    // IE does not support it, and Chrome has a bug which messes up
    // the canvas draw order.
    // As such, we force the Image fallback for now, but leaving the
    // actual Canvas path in-place in case this changes in the future.
    foSupported = false;

    if (!target.renderTarget) {
        target.canvas = mainCanvas;

        // Fall back to image tag if foreignObject isn't supported,
        // or if we're exporting.
        if (chart.renderer.forExport || !foSupported) {
            target.renderTarget = chart.renderer.image(
                '',
                0,
                0,
                width,
                height
            )
                .addClass('highcharts-boost-canvas')
                .add(targetGroup);

            target.boostClear = function () {
                target.renderTarget.attr({ href: '' });
            };

            target.boostCopy = function () {
                target.boostResizeTarget();
                target.renderTarget.attr({
                    href: target.canvas.toDataURL('image/png')
                });
            };

        } else {
            target.renderTargetFo = chart.renderer
                .createElement('foreignObject')
                .add(targetGroup);

            target.renderTarget = doc.createElement('canvas');
            target.renderTargetCtx = target.renderTarget.getContext('2d');

            target.renderTargetFo.element.appendChild(target.renderTarget);

            target.boostClear = function () {
                target.renderTarget.width = target.canvas.width;
                target.renderTarget.height = target.canvas.height;
            };

            target.boostCopy = function () {
                target.renderTarget.width = target.canvas.width;
                target.renderTarget.height = target.canvas.height;

                target.renderTargetCtx.drawImage(target.canvas, 0, 0);
            };
        }

        target.boostResizeTarget = function () {
            width = chart.chartWidth;
            height = chart.chartHeight;

            (target.renderTargetFo || target.renderTarget)
                .attr({
                    x: 0,
                    y: 0,
                    width: width,
                    height: height
                })
                .css({
                    pointerEvents: 'none',
                    mixedBlendMode: 'normal',
                    opacity: alpha
                });

            if (target instanceof H.Chart) {
                target.markerGroup.translate(
                    chart.plotLeft,
                    chart.plotTop
                );
            }
        };

        target.boostClipRect = chart.renderer.clipRect();

        (target.renderTargetFo || target.renderTarget)
            .clip(target.boostClipRect);

        if (target instanceof H.Chart) {
            target.markerGroup = target.renderer.g().add(targetGroup);

            target.markerGroup.translate(series.xAxis.pos, series.yAxis.pos);
        }
    }

    target.canvas.width = width;
    target.canvas.height = height;

    target.boostClipRect.attr(chart.getBoostClipRect(target));

    target.boostResizeTarget();
    target.boostClear();

    if (!target.ogl) {
        target.ogl = GLRenderer(function () { // eslint-disable-line new-cap
            if (target.ogl.settings.debug.timeBufferCopy) {
                console.time('buffer copy'); // eslint-disable-line no-console
            }

            target.boostCopy();

            if (target.ogl.settings.debug.timeBufferCopy) {
                console.timeEnd('buffer copy'); // eslint-disable-line no-console
            }

        }); // eslint-disable-line new-cap

        if (!target.ogl.init(target.canvas)) {
            // The OGL renderer couldn't be inited.
            // This likely means a shader error as we wouldn't get to this point
            // if there was no WebGL support.
            H.error('[highcharts boost] - unable to init WebGL renderer');
        }

        // target.ogl.clear();
        target.ogl.setOptions(chart.options.boost || {});

        if (target instanceof H.Chart) {
            target.ogl.allocateBuffer(chart);
        }
    }

    target.ogl.setSize(width, height);

    return target.ogl;
}

/*
 * Performs the actual render if the renderer is
 * attached to the series.
 * @param renderer {OGLRenderer} - the renderer
 * @param series {Highcharts.Series} - the series
 */
function renderIfNotSeriesBoosting(renderer, series, chart) {
    if (renderer &&
        series.renderTarget &&
        series.canvas &&
        !(chart || series.chart).isChartSeriesBoosting()
    ) {
        renderer.render(chart || series.chart);
    }
}

function allocateIfNotSeriesBoosting(renderer, series) {
    if (renderer &&
        series.renderTarget &&
        series.canvas &&
        !series.chart.isChartSeriesBoosting()
    ) {
        renderer.allocateBufferForSingleSeries(series);
    }
}

/*
 * An "async" foreach loop. Uses a setTimeout to keep the loop from blocking the
 * UI thread.
 *
 * @param arr {Array} - the array to loop through
 * @param fn {Function} - the callback to call for each item
 * @param finalFunc {Function} - the callback to call when done
 * @param chunkSize {Number} - the number of iterations per timeout
 * @param i {Number} - the current index
 * @param noTimeout {Boolean} - set to true to skip timeouts
 */
H.eachAsync = function (arr, fn, finalFunc, chunkSize, i, noTimeout) {
    i = i || 0;
    chunkSize = chunkSize || CHUNK_SIZE;

    var threshold = i + chunkSize,
        proceed = true;

    while (proceed && i < threshold && i < arr.length) {
        proceed = fn(arr[i], i);
        ++i;
    }

    if (proceed) {
        if (i < arr.length) {

            if (noTimeout) {
                H.eachAsync(arr, fn, finalFunc, chunkSize, i, noTimeout);
            } else if (win.requestAnimationFrame) {
                // If available, do requestAnimationFrame - shaves off a few ms
                win.requestAnimationFrame(function () {
                    H.eachAsync(arr, fn, finalFunc, chunkSize, i);
                });
            } else {
                setTimeout(function () {
                    H.eachAsync(arr, fn, finalFunc, chunkSize, i);
                });
            }

        } else if (finalFunc) {
            finalFunc();
        }
    }
};

// /////////////////////////////////////////////////////////////////////////////
// Following is the parts of the boost that's common between OGL/Legacy

/**
 * Return a full Point object based on the index.
 * The boost module uses stripped point objects for performance reasons.
 *
 * @function Highcharts.Series#getPoint
 *
 * @param {object|Highcharts.Point} boostPoint
 *        A stripped-down point object
 *
 * @return {object}
 *         A Point object as per http://api.highcharts.com/highcharts#Point
 */
Series.prototype.getPoint = function (boostPoint) {
    var point = boostPoint,
        xData = (
            this.xData || this.options.xData || this.processedXData || false
        );

    if (boostPoint && !(boostPoint instanceof this.pointClass)) {
        point = (new this.pointClass()).init( // eslint-disable-line new-cap
            this,
            this.options.data[boostPoint.i],
            xData ? xData[boostPoint.i] : undefined
        );

        point.category = point.x;

        point.dist = boostPoint.dist;
        point.distX = boostPoint.distX;
        point.plotX = boostPoint.plotX;
        point.plotY = boostPoint.plotY;
        point.index = boostPoint.i;
    }

    return point;
};

/**
 * Return a point instance from the k-d-tree
 */
wrap(Series.prototype, 'searchPoint', function (proceed) {
    return this.getPoint(
        proceed.apply(this, [].slice.call(arguments, 1))
    );
});

/**
 * Extend series.destroy to also remove the fake k-d-tree points (#5137).
 * Normally this is handled by Series.destroy that calls Point.destroy,
 * but the fake search points are not registered like that.
 */
addEvent(Series, 'destroy', function () {
    var series = this,
        chart = series.chart;

    if (chart.markerGroup === series.markerGroup) {
        series.markerGroup = null;
    }

    if (chart.hoverPoints) {
        chart.hoverPoints = chart.hoverPoints.filter(function (point) {
            return point.series === series;
        });
    }

    if (chart.hoverPoint && chart.hoverPoint.series === series) {
        chart.hoverPoint = null;
    }
});

/**
 * Do not compute extremes when min and max are set.
 * If we use this in the core, we can add the hook
 * to hasExtremes to the methods directly.
 */
wrap(Series.prototype, 'getExtremes', function (proceed) {
    if (!this.isSeriesBoosting || (!this.hasExtremes || !this.hasExtremes())) {
        return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});

// Set default options
boostable.forEach(
    function (type) {
        if (plotOptions[type]) {
            plotOptions[type].boostThreshold = 5000;
            plotOptions[type].boostData = [];

            seriesTypes[type].prototype.fillOpacity = true;
        }
    }
);

/**
 * Override a bunch of methods the same way. If the number of points is
 * below the threshold, run the original method. If not, check for a
 * canvas version or do nothing.
 *
 * Note that we're not overriding any of these for heatmaps.
 */
[
    'translate',
    'generatePoints',
    'drawTracker',
    'drawPoints',
    'render'
].forEach(function (method) {
    function branch(proceed) {
        var letItPass = this.options.stacking &&
            (method === 'translate' || method === 'generatePoints');

        if (
            !this.isSeriesBoosting ||
            letItPass ||
            !boostEnabled(this.chart) ||
            this.type === 'heatmap' ||
            this.type === 'treemap' ||
            !boostableMap[this.type] ||
            this.options.boostThreshold === 0
        ) {

            proceed.call(this);

        // If a canvas version of the method exists, like renderCanvas(), run
        } else if (this[method + 'Canvas']) {
            this[method + 'Canvas']();
        }
    }

    wrap(Series.prototype, method, branch);

    // A special case for some types - their translate method is already wrapped
    if (method === 'translate') {
        [
            'column',
            'bar',
            'arearange',
            'columnrange',
            'heatmap',
            'treemap'
        ].forEach(
            function (type) {
                if (seriesTypes[type]) {
                    wrap(seriesTypes[type].prototype, method, branch);
                }
            }
        );
    }
});

/** If the series is a heatmap or treemap, or if the series is not boosting
 *  do the default behaviour. Otherwise, process if the series has no
 *  extremes.
 */
wrap(Series.prototype, 'processData', function (proceed) {

    var series = this,
        dataToMeasure = this.options.data;

    // Used twice in this function, first on this.options.data, the second
    // time it runs the check again after processedXData is built.
    // @todo Check what happens with data grouping
    function getSeriesBoosting(data) {
        return series.chart.isChartSeriesBoosting() || (
            (data ? data.length : 0) >=
            (series.options.boostThreshold || Number.MAX_VALUE)
        );
    }

    if (boostEnabled(this.chart) && boostableMap[this.type]) {

        // If there are no extremes given in the options, we also need to
        // process the data to read the data extremes. If this is a heatmap, do
        // default behaviour.
        if (
            !getSeriesBoosting(dataToMeasure) || // First pass with options.data
            this.type === 'heatmap' ||
            this.type === 'treemap' ||
            this.options.stacking || // processedYData for the stack (#7481)
            !this.hasExtremes ||
            !this.hasExtremes(true)
        ) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            dataToMeasure = this.processedXData;
        }

        // Set the isBoosting flag, second pass with processedXData to see if we
        // have zoomed.
        this.isSeriesBoosting = getSeriesBoosting(dataToMeasure);

        // Enter or exit boost mode
        if (this.isSeriesBoosting) {
            this.enterBoost();
        } else if (this.exitBoost) {
            this.exitBoost();
        }

    // The series type is not boostable
    } else {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});

addEvent(Series, 'hide', function () {
    if (this.canvas && this.renderTarget) {
        if (this.ogl) {
            this.ogl.clear();
        }
        this.boostClear();
    }

});

/**
 * Enter boost mode and apply boost-specific properties.
 *
 * @function Highcharts.Series#enterBoost
 */
Series.prototype.enterBoost = function () {

    this.alteredByBoost = [];

    // Save the original values, including whether it was an own property or
    // inherited from the prototype.
    ['allowDG', 'directTouch', 'stickyTracking'].forEach(function (prop) {
        this.alteredByBoost.push({
            prop: prop,
            val: this[prop],
            own: this.hasOwnProperty(prop)
        });
    }, this);

    this.allowDG = false;
    this.directTouch = false;
    this.stickyTracking = true;

    // Once we've been in boost mode, we don't want animation when returning to
    // vanilla mode.
    this.animate = null;

    // Hide series label if any
    if (this.labelBySeries) {
        this.labelBySeries = this.labelBySeries.destroy();
    }
};

/**
 * Exit from boost mode and restore non-boost properties.
 *
 * @function Highcharts.Series#exitBoost
 */
Series.prototype.exitBoost = function () {
    // Reset instance properties and/or delete instance properties and go back
    // to prototype
    (this.alteredByBoost || []).forEach(function (setting) {
        if (setting.own) {
            this[setting.prop] = setting.val;
        } else {
            // Revert to prototype
            delete this[setting.prop];
        }
    }, this);

    // Clear previous run
    if (this.boostClear) {
        this.boostClear();
    }

};

/**
 * @private
 * @function Highcharts.Series#hasExtremes
 *
 * @param {boolean} checkX
 *
 * @return {boolean}
 */
Series.prototype.hasExtremes = function (checkX) {
    var options = this.options,
        data = options.data,
        xAxis = this.xAxis && this.xAxis.options,
        yAxis = this.yAxis && this.yAxis.options;

    return data.length > (options.boostThreshold || Number.MAX_VALUE) &&
            isNumber(yAxis.min) && isNumber(yAxis.max) &&
            (!checkX || (isNumber(xAxis.min) && isNumber(xAxis.max)));
};

/**
 * If implemented in the core, parts of this can probably be
 * shared with other similar methods in Highcharts.
 *
 * @function Highcharts.Series#destroyGraphics
 */
Series.prototype.destroyGraphics = function () {
    var series = this,
        points = this.points,
        point,
        i;

    if (points) {
        for (i = 0; i < points.length; i = i + 1) {
            point = points[i];
            if (point && point.destroyElements) {
                point.destroyElements(); // #7557
            }
        }
    }

    ['graph', 'area', 'tracker'].forEach(function (prop) {
        if (series[prop]) {
            series[prop] = series[prop].destroy();
        }
    });
};


/**
 * Returns true if the current browser supports webgl
 *
 * @private
 * @function Highcharts.hasWebGLSupport
 *
 * @return {boolean}
 */
H.hasWebGLSupport = function () {
    var i = 0,
        canvas,
        contexts = ['webgl', 'experimental-webgl', 'moz-webgl', 'webkit-3d'],
        context = false;

    if (typeof win.WebGLRenderingContext !== 'undefined') {
        canvas = doc.createElement('canvas');

        for (; i < contexts.length; i++) {
            try {
                context = canvas.getContext(contexts[i]);
                if (typeof context !== 'undefined' && context !== null) {
                    return true;
                }
            } catch (e) {

            }
        }
    }

    return false;
};

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
    var enabled = true,
        renderer;

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

// /////////////////////////////////////////////////////////////////////////////
// We're wrapped in a closure, so just return if there's no webgl support

if (!H.hasWebGLSupport()) {
    if (typeof H.initCanvasBoost !== 'undefined') {
        // Fallback to canvas boost
        H.initCanvasBoost();
    } else {
        H.error(26);
    }
} else {

    // /////////////////////////////////////////////////////////////////////////
    // GL-SPECIFIC WRAPPINGS FOLLOWS


    H.extend(Series.prototype, {

        /**
         * @private
         * @function Highcharts.Series#renderCanvas
         */
        renderCanvas: function () {
            var series = this,
                options = series.options || {},
                renderer = false,
                chart = series.chart,
                xAxis = this.xAxis,
                yAxis = this.yAxis,
                xData = options.xData || series.processedXData,
                yData = options.yData || series.processedYData,
                rawData = options.data,
                xExtremes = xAxis.getExtremes(),
                xMin = xExtremes.min,
                xMax = xExtremes.max,
                yExtremes = yAxis.getExtremes(),
                yMin = yExtremes.min,
                yMax = yExtremes.max,
                pointTaken = {},
                lastClientX,
                sampling = !!series.sampling,
                points,
                enableMouseTracking = options.enableMouseTracking !== false,
                threshold = options.threshold,
                yBottom = yAxis.getThreshold(threshold),
                isRange = series.pointArrayMap &&
                    series.pointArrayMap.join(',') === 'low,high',
                isStacked = !!options.stacking,
                cropStart = series.cropStart || 0,
                requireSorting = series.requireSorting,
                useRaw = !xData,
                minVal,
                maxVal,
                minI,
                maxI,
                boostOptions,
                compareX = options.findNearestPointBy === 'x',

                xDataFull = (
                    this.xData ||
                    this.options.xData ||
                    this.processedXData ||
                    false
                ),

                addKDPoint = function (clientX, plotY, i) {

                    // We need to do ceil on the clientX to make things
                    // snap to pixel values. The renderer will frequently
                    // draw stuff on "sub-pixels".
                    clientX = Math.ceil(clientX);

                    // Shaves off about 60ms compared to repeated concatenation
                    index = compareX ? clientX : clientX + ',' + plotY;

                    // The k-d tree requires series points.
                    // Reduce the amount of points, since the time to build the
                    // tree increases exponentially.
                    if (enableMouseTracking && !pointTaken[index]) {
                        pointTaken[index] = true;

                        if (chart.inverted) {
                            clientX = xAxis.len - clientX;
                            plotY = yAxis.len - plotY;
                        }

                        points.push({
                            x: xDataFull ? xDataFull[cropStart + i] : false,
                            clientX: clientX,
                            plotX: clientX,
                            plotY: plotY,
                            i: cropStart + i
                        });
                    }
                };

            // Get or create the renderer
            renderer = createAndAttachRenderer(chart, series);

            chart.isBoosting = true;

            boostOptions = renderer.settings;

            if (!this.visible) {
                return;
            }

            // If we are zooming out from SVG mode, destroy the graphics
            if (this.points || this.graph) {

                this.animate = null;
                this.destroyGraphics();
            }

            // If we're rendering per. series we should create the marker groups
            // as usual.
            if (!chart.isChartSeriesBoosting()) {
                this.markerGroup = series.plotGroup(
                    'markerGroup',
                    'markers',
                    true,
                    1,
                    chart.seriesGroup
                );
            } else {
                // Use a single group for the markers
                this.markerGroup = chart.markerGroup;

                // When switching from chart boosting mode, destroy redundant
                // series boosting targets
                if (this.renderTarget) {
                    this.renderTarget = this.renderTarget.destroy();
                }
            }

            points = this.points = [];

            // Do not start building while drawing
            series.buildKDTree = noop;

            if (renderer) {
                allocateIfNotSeriesBoosting(renderer, this);
                renderer.pushSeries(series);
                // Perform the actual renderer if we're on series level
                renderIfNotSeriesBoosting(renderer, this, chart);
            }

            /* This builds the KD-tree */
            function processPoint(d, i) {
                var x,
                    y,
                    clientX,
                    plotY,
                    isNull,
                    low = false,
                    chartDestroyed = typeof chart.index === 'undefined',
                    isYInside = true;

                if (!chartDestroyed) {
                    if (useRaw) {
                        x = d[0];
                        y = d[1];
                    } else {
                        x = d;
                        y = yData[i];
                    }

                    // Resolve low and high for range series
                    if (isRange) {
                        if (useRaw) {
                            y = d.slice(1, 3);
                        }
                        low = y[0];
                        y = y[1];
                    } else if (isStacked) {
                        x = d.x;
                        y = d.stackY;
                        low = y - d.y;
                    }

                    isNull = y === null;

                    // Optimize for scatter zooming
                    if (!requireSorting) {
                        isYInside = y >= yMin && y <= yMax;
                    }

                    if (!isNull && x >= xMin && x <= xMax && isYInside) {

                        clientX = xAxis.toPixels(x, true);

                        if (sampling) {
                            if (minI === undefined || clientX === lastClientX) {
                                if (!isRange) {
                                    low = y;
                                }
                                if (maxI === undefined || y > maxVal) {
                                    maxVal = y;
                                    maxI = i;
                                }
                                if (minI === undefined || low < minVal) {
                                    minVal = low;
                                    minI = i;
                                }

                            }
                            // Add points and reset
                            if (clientX !== lastClientX) {
                                if (minI !== undefined) { // maxI is number too
                                    plotY = yAxis.toPixels(maxVal, true);
                                    yBottom = yAxis.toPixels(minVal, true);

                                    addKDPoint(clientX, plotY, maxI);
                                    if (yBottom !== plotY) {
                                        addKDPoint(clientX, yBottom, minI);
                                    }
                                }

                                minI = maxI = undefined;
                                lastClientX = clientX;
                            }
                        } else {
                            plotY = Math.ceil(yAxis.toPixels(y, true));
                            addKDPoint(clientX, plotY, i);
                        }
                    }
                }

                return !chartDestroyed;
            }

            function doneProcessing() {
                fireEvent(series, 'renderedCanvas');

                // Go back to prototype, ready to build
                delete series.buildKDTree;
                series.buildKDTree();

                if (boostOptions.debug.timeKDTree) {
                    console.timeEnd('kd tree building'); // eslint-disable-line no-console
                }
            }

            // Loop over the points to build the k-d tree - skip this if
            // exporting
            if (!chart.renderer.forExport) {
                if (boostOptions.debug.timeKDTree) {
                    console.time('kd tree building'); // eslint-disable-line no-console
                }

                H.eachAsync(
                    isStacked ? series.data : (xData || rawData),
                    processPoint,
                    doneProcessing
                );
            }
        }
    });

    /* *
     * We need to handle heatmaps separatly, since we can't perform the
     * size/color calculations in the shader easily.
     *
     * This likely needs future optimization.
     */
    ['heatmap', 'treemap'].forEach(
        function (t) {
            if (seriesTypes[t]) {
                wrap(seriesTypes[t].prototype, 'drawPoints', pointDrawHandler);
            }
        }
    );

    if (seriesTypes.bubble) {
        // By default, the bubble series does not use the KD-tree, so force it
        // to.
        delete seriesTypes.bubble.prototype.buildKDTree;
        // seriesTypes.bubble.prototype.directTouch = false;

        // Needed for markers to work correctly
        wrap(
            seriesTypes.bubble.prototype,
            'markerAttribs',
            function (proceed) {
                if (this.isSeriesBoosting) {
                    return false;
                }
                return proceed.apply(this, [].slice.call(arguments, 1));
            }
        );
    }

    seriesTypes.scatter.prototype.fill = true;

    extend(seriesTypes.area.prototype, {
        fill: true,
        fillOpacity: true,
        sampling: true
    });


    extend(seriesTypes.column.prototype, {
        fill: true,
        sampling: true
    });

    // Take care of the canvas blitting
    H.Chart.prototype.callbacks.push(function (chart) {

        /* Convert chart-level canvas to image */
        function canvasToSVG() {
            if (chart.ogl && chart.isChartSeriesBoosting()) {
                chart.ogl.render(chart);
            }
        }

        /* Clear chart-level canvas */
        function preRender() {
            // Reset force state
            chart.boostForceChartBoost = undefined;
            chart.boostForceChartBoost = shouldForceChartSeriesBoosting(chart);
            chart.isBoosting = false;

            if (!chart.isChartSeriesBoosting() && chart.didBoost) {
                chart.didBoost = false;
            }

            // Clear the canvas
            if (chart.boostClear) {
                chart.boostClear();
            }

            if (chart.canvas && chart.ogl && chart.isChartSeriesBoosting()) {
                chart.didBoost = true;

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

    });
} // if hasCanvasSupport
