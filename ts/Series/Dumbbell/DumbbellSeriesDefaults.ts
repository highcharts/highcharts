/* *
 *
 *  (c) 2010-2021 Sebastian Bochan, Rafal Sebestjanski
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

import type DumbbellSeriesOptions from './DumbbellSeriesOptions';

import { Palette } from '../../Core/Color/Palettes.js';

/* *
 *
 *  API Options
 *
 * */

const DumbbellSeriesDefaults: DumbbellSeriesOptions = {

    /** @ignore-option */
    trackByArea: false,

    /** @ignore-option */
    fillColor: 'none',

    /** @ignore-option */
    lineWidth: 0,

    pointRange: 1,

    /**
     * Pixel width of the line that connects the dumbbell point's
     * values.
     *
     * @since 8.0.0
     * @product   highcharts highstock
     */
    connectorWidth: 1,

    /** @ignore-option */
    stickyTracking: false,

    groupPadding: 0.2,

    crisp: false,

    pointPadding: 0.1,

    /**
     * Color of the start markers in a dumbbell graph. This option takes
     * priority over the series color. To avoid this, set `lowColor` to
     * `undefined`.
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since 8.0.0
     * @product   highcharts highstock
     */
    lowColor: Palette.neutralColor80,

    /**
     * Color of the line that connects the dumbbell point's values.
     * By default it is the series' color.
     *
     * @type      {string}
     * @product   highcharts highstock
     * @since 8.0.0
     * @apioption plotOptions.dumbbell.connectorColor
     */

    /**
     *
     * @apioption plotOptions.series.lowMarker
     */
    states: {

        hover: {

            /** @ignore-option */
            lineWidthPlus: 0,

            /**
             * The additional connector line width for a hovered point.
             *
             * @since 8.0.0
             * @product   highcharts highstock
             */
            connectorWidthPlus: 1,

            /** @ignore-option */
            halo: false

        }

    }

};

/**
 * The `dumbbell` series. If the [type](#series.dumbbell.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.dumbbell
 * @excluding boostThreshold, boostBlending
 * @product   highcharts highstock
 * @requires  highcharts-more
 * @requires  modules/dumbbell
 * @apioption series.dumbbell
 */

/**
 * An array of data points for the series. For the `dumbbell` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 3 or 2 values. In this case, the values correspond
 *    to `x,low,high`. If the first value is a string, it is applied as the name
 *    of the point, and the `x` value is inferred. The `x` value can also be
 *    omitted, in which case the inner arrays should be of length 2\. Then the
 *    `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 4, 2],
 *        [1, 2, 1],
 *        [2, 9, 10]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.dumbbell.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        low: 0,
 *        high: 4,
 *        name: "Point2",
 *        color: "#00FF00",
 *        lowColor: "#00FFFF",
 *        connectorWidth: 3,
 *        connectorColor: "#FF00FF"
 *    }, {
 *        x: 1,
 *        low: 5,
 *        high: 3,
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
 * @type      {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
 * @extends   series.arearange.data
 * @product   highcharts highstock
 * @apioption series.dumbbell.data
 */

/**
 * Options for the lower markers of the dumbbell-like series. When `lowMarker`
 * is not defined, options inherit form the marker.
 *
 * @see [marker](#series.arearange.marker)
 *
 * @declare   Highcharts.PointMarkerOptionsObject
 * @extends   plotOptions.series.marker
 * @default   undefined
 * @product   highcharts highstock
 * @apioption plotOptions.dumbbell.lowMarker
 */

/**
 *
 * @sample {highcharts} highcharts/demo/dumbbell-markers
 *         Dumbbell chart with lowMarker option
 *
 * @declare   Highcharts.PointMarkerOptionsObject
 * @extends   plotOptions.series.marker.symbol
 * @product   highcharts highstock
 * @apioption plotOptions.dumbbell.lowMarker.symbol
 */

/**
 * Color of the line that connects the dumbbell point's values.
 * By default it is the series' color.
 *
 * @type        {string}
 * @since       8.0.0
 * @product     highcharts highstock
 * @apioption   series.dumbbell.data.connectorColor
 */

/**
 * Pixel width of the line that connects the dumbbell point's values.
 *
 * @type        {number}
 * @since       8.0.0
 * @default     1
 * @product     highcharts highstock
 * @apioption   series.dumbbell.data.connectorWidth
 */

/**
 * Color of the start markers in a dumbbell graph. This option takes
 * priority over the series color. To avoid this, set `lowColor` to
 * `undefined`.
 *
 * @type        {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @since       8.0.0
 * @default     ${palette.neutralColor80}
 * @product     highcharts highstock
 * @apioption   series.dumbbell.data.lowColor
 */

''; // keeps doclets above separate

/* *
 *
 *  Default Export
 *
 * */

export default DumbbellSeriesDefaults;
