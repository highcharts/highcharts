/* *
 *
 *  Wind barb series module
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type WindbarbSeriesOptions from './WindbarbSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * Wind barbs are a convenient way to represent wind speed and direction in
 * one graphical form. Wind direction is given by the stem direction, and
 * wind speed by the number and shape of barbs.
 *
 * @sample {highcharts|highstock} highcharts/demo/windbarb-series/
 *         Wind barb series
 *
 * @extends      plotOptions.column
 * @excluding    boostThreshold, marker, connectEnds, connectNulls,
 *               cropThreshold, dashStyle, dragDrop, gapSize, gapUnit,
 *               linecap, shadow, stacking, step, boostBlending
 * @since        6.0.0
 * @product      highcharts highstock
 * @requires     modules/windbarb
 * @optionparent plotOptions.windbarb
 */
const WindbarbSeriesDefaults: WindbarbSeriesOptions = {

    /**
     * Data grouping options for the wind barbs. In Highcharts, this
     * requires the `modules/datagrouping.js` module to be loaded. In
     * Highcharts Stock, data grouping is included.
     *
     * @sample  highcharts/plotoptions/windbarb-datagrouping
     *          Wind barb with data grouping
     *
     * @since   7.1.0
     * @product highcharts highstock
     */
    dataGrouping: {

        /**
         * Whether to enable data grouping.
         *
         * @product highcharts highstock
         */
        enabled: true,

        /**
         * Approximation function for the data grouping. The default
         * returns an average of wind speed and a vector average direction
         * weighted by wind speed.
         *
         * @product highcharts highstock
         *
         * @type {string|Function}
         */
        approximation: 'windbarb',

        /**
         * The approximate data group width.
         *
         * @product highcharts highstock
         */
        groupPixelWidth: 30

    },

    /**
     * The line width of the wind barb symbols.
     */
    lineWidth: 2,

    /**
     * The id of another series in the chart that the wind barbs are
     * projected on. When `null`, the wind symbols are drawn on the X axis,
     * but offset up or down by the `yOffset` setting.
     *
     * @sample {highcharts|highstock} highcharts/plotoptions/windbarb-onseries
     *         Projected on area series
     *
     * @type {string|null}
     */
    onSeries: null,

    states: {

        hover: {

            lineWidthPlus: 0

        }

    },

    tooltip: {

        /**
         * The default point format for the wind barb tooltip. Note the
         * `point.beaufort` property that refers to the Beaufort wind scale.
         * The names can be internationalized by modifying
         * `Highcharts.seriesTypes.windbarb.prototype.beaufortNames`.
         */
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.value}</b> ({point.beaufort})<br/>'

    },

    /**
     * Pixel length of the stems.
     */
    vectorLength: 20,

    /**
     * @default   value
     */
    colorKey: 'value',

    /**
     * Vertical offset from the cartesian position, in pixels. The default
     * value makes sure the symbols don't overlap the X axis when `onSeries`
     * is `null`, and that they don't overlap the linked series when
     * `onSeries` is given.
     */
    yOffset: -20,

    /**
     * Horizontal offset from the cartesian position, in pixels. When the
     * chart is inverted, this option allows translation like
     * [yOffset](#plotOptions.windbarb.yOffset) in non inverted charts.
     *
     * @since 6.1.0
     */
    xOffset: 0

};

/**
 * A `windbarb` series. If the [type](#series.windbarb.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.windbarb
 * @excluding dataParser, dataURL, boostThreshold, boostBlending
 * @product   highcharts highstock
 * @requires  modules/windbarb
 * @apioption series.windbarb
 */

/**
 * An array of data points for the series. For the `windbarb` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 3 values. In this case, the values correspond to
 *    `x,value,direction`. If the first value is a string, it is applied as the
 *    name of the point, and the `x` value is inferred.
 *    ```js
 *       data: [
 *           [Date.UTC(2017, 0, 1, 0), 3.3, 90],
 *           [Date.UTC(2017, 0, 1, 1), 12.1, 180],
 *           [Date.UTC(2017, 0, 1, 2), 11.1, 270]
 *       ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.area.turboThreshold), this option is not
 *    available.
 *    ```js
 *       data: [{
 *           x: Date.UTC(2017, 0, 1, 0),
 *           value: 12.1,
 *           direction: 90
 *       }, {
 *           x: Date.UTC(2017, 0, 1, 1),
 *           value: 11.1,
 *           direction: 270
 *       }]
 *    ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<Array<(number|string),number,number>|*>}
 * @extends   series.line.data
 * @product   highcharts highstock
 * @apioption series.windbarb.data
 */

/**
 * The wind speed in meters per second.
 *
 * @type      {number|null}
 * @product   highcharts highstock
 * @apioption series.windbarb.data.value
 */

/**
 * The wind direction in degrees, where 0 is north (pointing towards south).
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.windbarb.data.direction
 */

''; // adds doclets above to transpiled file

/* *
 *
 *  Default Export
 *
 * */

export default WindbarbSeriesDefaults;
