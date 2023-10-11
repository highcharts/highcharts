/* *
 *
 *  Imports
 *
 * */

import type BulletSeriesOptions from './BulletSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A bullet graph is a variation of a bar graph. The bullet graph features
 * a single measure, compares it to a target, and displays it in the context
 * of qualitative ranges of performance that could be set using
 * [plotBands](#yAxis.plotBands) on [yAxis](#yAxis).
 *
 * @sample {highcharts} highcharts/demo/bullet-graph/
 *         Bullet graph
 *
 * @extends      plotOptions.column
 * @since        6.0.0
 * @product      highcharts
 * @excluding    allAreas, boostThreshold, colorAxis, compare, compareBase,
 *               dataSorting, boostBlending
 * @requires     modules/bullet
 * @optionparent plotOptions.bullet
 */
const BulletSeriesDefaults: BulletSeriesOptions = {

    /**
     * All options related with look and positiong of targets.
     *
     * @since 6.0.0
     */
    targetOptions: {

        /**
         * The width of the rectangle representing the target. Could be set
         * as a pixel value or as a percentage of a column width.
         *
         * @type  {number|string}
         * @since 6.0.0
         */
        width: '140%',

        /**
         * The height of the rectangle representing the target.
         *
         * @since 6.0.0
         */
        height: 3,

        /**
         * The border color of the rectangle representing the target. When
         * not set, the  point's border color is used.
         *
         * In styled mode, use class `highcharts-bullet-target` instead.
         *
         * @type      {Highcharts.ColorString}
         * @since     6.0.0
         * @product   highcharts
         * @apioption plotOptions.bullet.targetOptions.borderColor
         */

        /**
         * The color of the rectangle representing the target. When not set,
         * point's color (if set in point's options -
         * [`color`](#series.bullet.data.color)) or zone of the target value
         * (if [`zones`](#plotOptions.bullet.zones) or
         * [`negativeColor`](#plotOptions.bullet.negativeColor) are set)
         * or the same color as the point has is used.
         *
         * In styled mode, use class `highcharts-bullet-target` instead.
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since     6.0.0
         * @product   highcharts
         * @apioption plotOptions.bullet.targetOptions.color
         */

        /**
         * The border width of the rectangle representing the target.
         *
         * In styled mode, use class `highcharts-bullet-target` instead.
         *
         * @since   6.0.0
         */
        borderWidth: 0,

        /**
         * The border radius of the rectangle representing the target.
         */
        borderRadius: 0

    },

    tooltip: {
        pointFormat: '<span style="color:{series.color}">\u25CF</span>' +
        ' {series.name}: <b>{point.y}</b>. Target: <b>{point.target}' +
        '</b><br/>'
    }

};

/**
 * A `bullet` series. If the [type](#series.bullet.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.bullet
 * @since     6.0.0
 * @product   highcharts
 * @excluding dataParser, dataURL, marker, dataSorting, boostThreshold,
 *            boostBlending
 * @requires  modules/bullet
 * @apioption series.bullet
 */

/**
 * An array of data points for the series. For the `bullet` series type,
 * points can be given in the following ways:
 *
 * 1. An array of arrays with 3 or 2 values. In this case, the values correspond
 *    to `x,y,target`. If the first value is a string, it is applied as the name
 *    of the point, and the `x` value is inferred. The `x` value can also be
 *    omitted, in which case the inner arrays should be of length 2\. Then the
 *    `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 40, 75],
 *        [1, 50, 50],
 *        [2, 60, 40]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.bullet.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 0,
 *        y: 40,
 *        target: 75,
 *        name: "Point1",
 *        color: "#00FF00"
 *    }, {
 *         x: 1,
 *        y: 60,
 *        target: 40,
 *        name: "Point2",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
 * @extends   series.column.data
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.bullet.data
 */

/**
 * The target value of a point.
 *
 * @type      {number}
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.bullet.data.target
 */

/**
 * Individual target options for each point.
 *
 * @extends   plotOptions.bullet.targetOptions
 * @product   highcharts
 * @apioption series.bullet.data.targetOptions
 */

/**
 * @product   highcharts
 * @excluding halo, lineWidth, lineWidthPlus, marker
 * @apioption series.bullet.states.hover
 */

/**
 * @product   highcharts
 * @excluding halo, lineWidth, lineWidthPlus, marker
 * @apioption series.bullet.states.select
 */

''; // keeps doclets above separate

/* *
 *
 *  Default Export
 *
 * */

export default BulletSeriesDefaults;
