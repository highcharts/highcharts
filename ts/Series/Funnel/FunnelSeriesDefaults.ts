/* *
 *
 *  Highcharts funnel module
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

import type FunnelSeriesOptions from './FunnelSeriesOptions';

import { Palette } from '../../Core/Color/Palettes.js';

/* *
 *
 *  API Options
 *
 * */

/**
 * Funnel charts are a type of chart often used to visualize stages in a
 * sales project, where the top are the initial stages with the most
 * clients. It requires that the modules/funnel.js file is loaded.
 *
 * @sample highcharts/demo/funnel/
 *         Funnel demo
 *
 * @extends      plotOptions.pie
 * @excluding    innerSize,size,dataSorting
 * @product      highcharts
 * @requires     modules/funnel
 * @optionparent plotOptions.funnel
 */
const FunnelSeriesDefaults: FunnelSeriesOptions = {

    /**
     * Initial animation is by default disabled for the funnel chart.
     */
    animation: false,

    /**
     * The corner radius of the border surrounding all points or series. A
     * number signifies pixels. A percentage string, like for example `50%`,
     * signifies a size relative to the series width.
     *
     * @sample highcharts/plotoptions/funnel-border-radius
     *         Funnel and pyramid with rounded border
     */
    borderRadius: 0,

    /**
     * The center of the series. By default, it is centered in the middle
     * of the plot area, so it fills the plot area height.
     *
     * @type    {Array<number|string>}
     * @default ["50%", "50%"]
     * @since   3.0
     */
    center: ['50%', '50%'],

    /**
     * The width of the funnel compared to the width of the plot area,
     * or the pixel width if it is a number.
     *
     * @type  {number|string}
     * @since 3.0
     */
    width: '90%',

    /**
     * The width of the neck, the lower part of the funnel. A number defines
     * pixel width, a percentage string defines a percentage of the plot
     * area width.
     *
     * @sample {highcharts} highcharts/demo/funnel/
     *         Funnel demo
     *
     * @type  {number|string}
     * @since 3.0
     */
    neckWidth: '30%',

    /**
     * The height of the funnel or pyramid. If it is a number it defines
     * the pixel height, if it is a percentage string it is the percentage
     * of the plot area height.
     *
     * @sample {highcharts} highcharts/demo/funnel/
     *         Funnel demo
     *
     * @type  {number|string}
     * @since 3.0
     */
    height: '100%',

    /**
     * The height of the neck, the lower part of the funnel. A number
     * defines pixel width, a percentage string defines a percentage of the
     * plot area height.
     *
     * @type {number|string}
     */
    neckHeight: '25%',

    /**
     * A reversed funnel has the widest area down. A reversed funnel with
     * no neck width and neck height is a pyramid.
     *
     * @since 3.0.10
     */
    reversed: false,

    /**
     * To avoid adapting the data label size in Pie.drawDataLabels.
     * @ignore-option
     */
    size: true as any,

    dataLabels: {
        connectorWidth: 1,
        verticalAlign: 'middle'
    },

    /**
     * Options for the series states.
     */
    states: {

        /**
         * @excluding halo, marker, lineWidth, lineWidthPlus
         * @apioption plotOptions.funnel.states.hover
         */

        /**
         * Options for a selected funnel item.
         *
         * @excluding halo, marker, lineWidth, lineWidthPlus
         */
        select: {

            /**
             * A specific color for the selected point.
             *
             * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             */
            color: Palette.neutralColor20,

            /**
             * A specific border color for the selected point.
             *
             * @type {Highcharts.ColorString}
             */
            borderColor: Palette.neutralColor100

        }

    }

};

/**
 * A `funnel` series. If the [type](#series.funnel.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.funnel
 * @excluding dataParser, dataURL, stack, xAxis, yAxis, dataSorting,
 *            boostBlending, boostThreshold
 * @product   highcharts
 * @requires  modules/funnel
 * @apioption series.funnel
 */

/**
 * An array of data points for the series. For the `funnel` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of numerical values. In this case, the numerical values
 * will be interpreted as `y` options. Example:
 *
 *  ```js
 *  data: [0, 5, 3, 5]
 *  ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.funnel.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         y: 3,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         y: 1,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
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
 * @type      {Array<number|null|*>}
 * @extends   series.pie.data
 * @excluding sliced
 * @product   highcharts
 * @apioption series.funnel.data
 */

''; // keeps doclets above separate

/* *
 *
 *  Default Export
 *
 * */

export default FunnelSeriesDefaults;
