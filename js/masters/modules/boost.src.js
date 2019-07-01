/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/boost
 * @requires highcharts
 *
 * Boost module
 *
 * (c) 2010-2019 Highsoft AS
 * Author: Torstein Honsi
 *
 * License: www.highcharts.com/license
 *
 * This is a Highcharts module that draws long data series on a canvas in order
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

/* *
 * Options for the Boost module. The Boost module allows certain series types
 * to be rendered by WebGL instead of the default SVG. This allows hundreds of
 * thousands of data points to be rendered in milliseconds. In addition to the
 * WebGL rendering it saves time by skipping processing and inspection of the
 * data wherever possible. This introduces some limitations to what features are
 * available in boost mode. See [the docs](
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
 * */

'use strict';
import '../../modules/boost/boost.js';
