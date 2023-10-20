/* *
 *
 *  Parallel coordinates module
 *
 *  (c) 2010-2021 Pawel Fus
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

import type AxisOptions from '../../Core/Axis/AxisOptions';
import type ParallelCoordinatesOptions from './ParallelCoordinatesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * @optionparent chart
 */
const chartDefaults: ParallelCoordinatesOptions = {
    /**
     * Flag to render charts as a parallel coordinates plot. In a parallel
     * coordinates plot (||-coords) by default all required yAxes are generated
     * and the legend is disabled. This feature requires
     * `modules/parallel-coordinates.js`.
     *
     * @sample {highcharts} /highcharts/demo/parallel-coordinates/
     *         Parallel coordinates demo
     * @sample {highcharts} highcharts/parallel-coordinates/polar/
     *         Star plot, multivariate data in a polar chart
     *
     * @since    6.0.0
     * @product  highcharts
     * @requires modules/parallel-coordinates
     */
    parallelCoordinates: false,
    /**
     * Common options for all yAxes rendered in a parallel coordinates plot.
     * This feature requires `modules/parallel-coordinates.js`.
     *
     * The default options are:
     * ```js
     * parallelAxes: {
     *    lineWidth: 1,       // classic mode only
     *    gridlinesWidth: 0,  // classic mode only
     *    title: {
     *        text: '',
     *        reserveSpace: false
     *    },
     *    labels: {
     *        x: 0,
     *        y: 0,
     *        align: 'center',
     *        reserveSpace: false
     *    },
     *    offset: 0
     * }
     * ```
     *
     * @sample {highcharts} highcharts/parallel-coordinates/parallelaxes/
     *         Set the same tickAmount for all yAxes
     *
     * @extends   yAxis
     * @since     6.0.0
     * @product   highcharts
     * @excluding alternateGridColor, breaks, id, gridLineColor,
     *            gridLineDashStyle, gridLineWidth, minorGridLineColor,
     *            minorGridLineDashStyle, minorGridLineWidth, plotBands,
     *            plotLines, angle, gridLineInterpolation, maxColor, maxZoom,
     *            minColor, scrollbar, stackLabels, stops,
     * @requires  modules/parallel-coordinates
     */
    parallelAxes: {
        lineWidth: 1,
        /**
         * Titles for yAxes are taken from
         * [xAxis.categories](#xAxis.categories). All options for `xAxis.labels`
         * applies to parallel coordinates titles. For example, to style
         * categories, use [xAxis.labels.style](#xAxis.labels.style).
         *
         * @excluding align, enabled, margin, offset, position3d, reserveSpace,
         *            rotation, skew3d, style, text, useHTML, x, y
         */
        title: {
            text: '',
            reserveSpace: false
        },
        labels: {
            x: 0,
            y: 4,
            align: 'center',
            reserveSpace: false
        },
        offset: 0
    }
};

const xAxisDefaults: Partial<AxisOptions> = {
    lineWidth: 0,
    tickLength: 0,
    opposite: true,
    type: 'category'
};


/**
 * Parallel coordinates only. Format that will be used for point.y
 * and available in [tooltip.pointFormat](#tooltip.pointFormat) as
 * `{point.formattedValue}`. If not set, `{point.formattedValue}`
 * will use other options, in this order:
 *
 * 1. [yAxis.labels.format](#yAxis.labels.format) will be used if
 *    set
 *
 * 2. If yAxis is a category, then category name will be displayed
 *
 * 3. If yAxis is a datetime, then value will use the same format as
 *    yAxis labels
 *
 * 4. If yAxis is linear/logarithmic type, then simple value will be
 *    used
 *
 * @sample {highcharts}
 *         /highcharts/parallel-coordinates/tooltipvalueformat/
 *         Different tooltipValueFormats's
 *
 * @type      {string}
 * @default   undefined
 * @since     6.0.0
 * @product   highcharts
 * @requires  modules/parallel-coordinates
 * @apioption yAxis.tooltipValueFormat
 */

''; // keeps doclets above separate in JS file

/* *
 *
 *  Default Options
 *
 * */

const ParallelCoordinatesDefaults = {
    chart: chartDefaults,
    xAxis: xAxisDefaults
};

export default ParallelCoordinatesDefaults;
