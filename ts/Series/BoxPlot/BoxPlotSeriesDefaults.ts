/* *
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

import type BoxPlotSeriesOptions from './BoxPlotSeriesOptions';

import { Palette } from '../../Core/Color/Palettes.js';

/* *
 *
 *  API Options
 *
 * */

/**
 * A box plot is a convenient way of depicting groups of data through their
 * five-number summaries: the smallest observation (sample minimum), lower
 * quartile (Q1), median (Q2), upper quartile (Q3), and largest observation
 * (sample maximum).
 *
 * @sample highcharts/demo/box-plot/
 *         Box plot
 *
 * @extends      plotOptions.column
 * @excluding    borderColor, borderRadius, borderWidth, groupZPadding,
 *               states, boostThreshold, boostBlending
 * @product      highcharts
 * @requires     highcharts-more
 * @optionparent plotOptions.boxplot
 */
const BoxPlotSeriesDefaults: BoxPlotSeriesOptions = {

    /**
     * @type {number|null}
     */
    threshold: null,

    tooltip: {
        pointFormat:
            '<span style="color:{point.color}">\u25CF</span> <b>' +
            '{series.name}</b><br/>' +
            'Maximum: {point.high}<br/>' +
            'Upper quartile: {point.q3}<br/>' +
            'Median: {point.median}<br/>' +
            'Lower quartile: {point.q1}<br/>' +
            'Minimum: {point.low}<br/>'
    },

    /**
     * The length of the whiskers, the horizontal lines marking low and
     * high values. It can be a numerical pixel value, or a percentage
     * value of the box width. Set `0` to disable whiskers.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         True by default
     *
     * @type    {number|string}
     * @since   3.0
     * @product highcharts
     */
    whiskerLength: '50%',

    /**
     * The fill color of the box.
     *
     * In styled mode, the fill color can be set with the
     * `.highcharts-boxplot-box` class.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     *
     * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @default #ffffff
     * @since   3.0
     * @product highcharts
     */
    fillColor: Palette.backgroundColor,

    /**
     * The width of the line surrounding the box. If any of
     * [stemWidth](#plotOptions.boxplot.stemWidth),
     * [medianWidth](#plotOptions.boxplot.medianWidth)
     * or [whiskerWidth](#plotOptions.boxplot.whiskerWidth) are `null`,
     * the lineWidth also applies to these lines.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @since   3.0
     * @product highcharts
     */
    lineWidth: 1,

    /**
     * The color of the median line. If `undefined`, the general series
     * color applies.
     *
     * In styled mode, the median stroke width can be set with the
     * `.highcharts-boxplot-median` class.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject}
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.medianColor
     */

    /**
     * The pixel width of the median line. If `null`, the
     * [lineWidth](#plotOptions.boxplot.lineWidth) is used.
     *
     * In styled mode, the median stroke width can be set with the
     * `.highcharts-boxplot-median` class.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @type    {number|null}
     * @since   3.0
     * @product highcharts
     */
    medianWidth: 2,

    /*
    // States are not working and are removed from docs.
    // Refer to: #2340
    states: {
        hover: {
            brightness: -0.3
        }
    },
    */

    /**
     * The color of the stem, the vertical line extending from the box to
     * the whiskers. If `undefined`, the series color is used.
     *
     * In styled mode, the stem stroke can be set with the
     * `.highcharts-boxplot-stem` class.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.stemColor
     */

    /**
     * The dash style of the box.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @type      {Highcharts.DashStyleValue}
     * @default   Solid
     * @since 8.1.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.boxDashStyle
     */

    /**
     * The dash style of the median.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @type      {Highcharts.DashStyleValue}
     * @default   Solid
     * @since 8.1.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.medianDashStyle
     */

    /**
     * The dash style of the stem, the vertical line extending from the
     * box to the whiskers.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @type      {Highcharts.DashStyleValue}
     * @default   Solid
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.stemDashStyle
     */

    /**
     * The dash style of the whiskers.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @type      {Highcharts.DashStyleValue}
     * @default   Solid
     * @since 8.1.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.whiskerDashStyle
     */

    /**
     * The width of the stem, the vertical line extending from the box to
     * the whiskers. If `undefined`, the width is inherited from the
     * [lineWidth](#plotOptions.boxplot.lineWidth) option.
     *
     * In styled mode, the stem stroke width can be set with the
     * `.highcharts-boxplot-stem` class.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     * @sample {highcharts} highcharts/plotoptions/error-bar-styling/
     *         Error bar styling
     *
     * @type      {number}
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.stemWidth
     */

    /**
     * @default   high
     * @apioption plotOptions.boxplot.colorKey
     */

    /**
     * The color of the whiskers, the horizontal lines marking low and high
     * values. When `undefined`, the general series color is used.
     *
     * In styled mode, the whisker stroke can be set with the
     * `.highcharts-boxplot-whisker` class .
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.boxplot.whiskerColor
     */

    /**
     * The line width of the whiskers, the horizontal lines marking low and
     * high values. When `undefined`, the general
     * [lineWidth](#plotOptions.boxplot.lineWidth) applies.
     *
     * In styled mode, the whisker stroke width can be set with the
     * `.highcharts-boxplot-whisker` class.
     *
     * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
     *         Box plot styling
     * @sample {highcharts} highcharts/css/boxplot/
     *         Box plot in styled mode
     *
     * @since   3.0
     * @product highcharts
     */
    whiskerWidth: 2

};

/**
 * A `boxplot` series. If the [type](#series.boxplot.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.boxplot
 * @excluding dataParser, dataURL, marker, stack, stacking, states,
 *            boostThreshold, boostBlending
 * @product   highcharts
 * @requires  highcharts-more
 * @apioption series.boxplot
 */

/**
 * An array of data points for the series. For the `boxplot` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 6 or 5 values. In this case, the values correspond
 *    to `x,low,q1,median,q3,high`. If the first value is a string, it is
 *    applied as the name of the point, and the `x` value is inferred. The `x`
 *    value can also be omitted, in which case the inner arrays should be of
 *    length 5. Then the `x` value is automatically calculated, either starting
 *    at 0 and incremented by 1, or from `pointStart` and `pointInterval` given
 *    in the series options.
 *    ```js
 *    data: [
 *        [0, 3, 0, 10, 3, 5],
 *        [1, 7, 8, 7, 2, 9],
 *        [2, 6, 9, 5, 1, 3]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.boxplot.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        low: 4,
 *        q1: 9,
 *        median: 9,
 *        q3: 1,
 *        high: 10,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        low: 5,
 *        q1: 7,
 *        median: 3,
 *        q3: 6,
 *        high: 2,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<Array<(number|string),number,number,number,number>|Array<(number|string),number,number,number,number,number>|*>}
 * @extends   series.line.data
 * @excluding marker
 * @product   highcharts
 * @apioption series.boxplot.data
 */

/**
 * The `high` value for each data point, signifying the highest value
 * in the sample set. The top whisker is drawn here.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.boxplot.data.high
 */

/**
 * The `low` value for each data point, signifying the lowest value
 * in the sample set. The bottom whisker is drawn here.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.boxplot.data.low
 */

/**
 * The median for each data point. This is drawn as a line through the
 * middle area of the box.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.boxplot.data.median
 */

/**
 * The lower quartile for each data point. This is the bottom of the
 * box.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.boxplot.data.q1
 */

/**
 * The higher quartile for each data point. This is the top of the box.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.boxplot.data.q3
 */

/**
 * The dash style of the box.
 *
 * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
 *         Box plot styling
 * @sample {highcharts} highcharts/css/boxplot/
 *         Box plot in styled mode
 *
 * @type      {Highcharts.DashStyleValue}
 * @default   Solid
 * @since 8.1.0
 * @product   highcharts
 * @apioption series.boxplot.data.boxDashStyle
 */

/**
 * The dash style of the median.
 *
 * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
 *         Box plot styling
 * @sample {highcharts} highcharts/css/boxplot/
 *         Box plot in styled mode
 *
 * @type      {Highcharts.DashStyleValue}
 * @default   Solid
 * @since 8.1.0
 * @product   highcharts
 * @apioption series.boxplot.data.medianDashStyle
 */

/**
 * The dash style of the stem.
 *
 * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
 *         Box plot styling
 * @sample {highcharts} highcharts/css/boxplot/
 *         Box plot in styled mode
 *
 * @type      {Highcharts.DashStyleValue}
 * @default   Solid
 * @since 8.1.0
 * @product   highcharts
 * @apioption series.boxplot.data.stemDashStyle
 */

/**
 * The dash style of the whiskers.
 *
 * @sample {highcharts} highcharts/plotoptions/box-plot-styling/
 *         Box plot styling
 * @sample {highcharts} highcharts/css/boxplot/
 *         Box plot in styled mode
 *
 * @type      {Highcharts.DashStyleValue}
 * @default   Solid
 * @since 8.1.0
 * @product   highcharts
 * @apioption series.boxplot.data.whiskerDashStyle
 */

''; // keeps doclets above separate

/* *
 *
 *  Default Export
 *
 * */

export default BoxPlotSeriesDefaults;
