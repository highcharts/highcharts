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

/* *
 *
 *  Default Export
 *
 * */

export default BoxPlotSeriesDefaults;
