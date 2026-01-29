/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AreaRangeSeriesOptions from './AreaRangeSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * The area range series is a carteseian series with higher and lower values for
 * each point along an X axis, where the area between the values is shaded.
 *
 * @sample {highcharts} highcharts/demo/arearange/
 *         Area range chart
 * @sample {highstock} stock/demo/arearange/
 *         Area range chart
 *
 * @extends      plotOptions.area
 * @product      highcharts highstock
 * @excluding    stack, stacking
 * @requires     highcharts-more
 * @optionparent plotOptions.arearange
 *
 * @private
 */
const AreaRangeSeriesDefaults: AreaRangeSeriesOptions = {

    /**
     * @see [fillColor](#plotOptions.arearange.fillColor)
     * @see [fillOpacity](#plotOptions.arearange.fillOpacity)
     *
     * @apioption plotOptions.arearange.color
     */

    /**
     * @default   low
     * @apioption plotOptions.arearange.colorKey
     */

    /**
     * @see [color](#plotOptions.arearange.color)
     * @see [fillOpacity](#plotOptions.arearange.fillOpacity)
     *
     * @apioption plotOptions.arearange.fillColor
     */

    /**
     * @see [color](#plotOptions.arearange.color)
     * @see [fillColor](#plotOptions.arearange.fillColor)
     *
     * @default   {highcharts} 0.75
     * @default   {highstock} 0.75
     * @apioption plotOptions.arearange.fillOpacity
     */


    /**
     * Whether to apply a drop shadow to the graph line. Since 2.3 the
     * shadow can be an object configuration containing `color`, `offsetX`,
     * `offsetY`, `opacity` and `width`.
     *
     * @type      {boolean|Highcharts.ShadowOptionsObject}
     * @product   highcharts
     * @apioption plotOptions.arearange.shadow
     */

    /**
     * Pixel width of the arearange graph line.
     *
     * @since 2.3.0
     *
     * @private
     */
    lineWidth: 1,

    /**
     * @type {number|null}
     */
    threshold: null,

    tooltip: {
        pointFormat: '<span style="color:{series.color}">\u25CF</span> ' +
            '{series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
    },

    /**
     * Whether the whole area or just the line should respond to mouseover
     * tooltips and other mouse or touch events.
     *
     * @since 2.3.0
     *
     * @private
     */
    trackByArea: true,

    /**
     * Extended data labels for range series types. Range series data
     * labels use no `x` and `y` options. Instead, they have `xLow`,
     * `xHigh`, `yLow` and `yHigh` options to allow the higher and lower
     * data label sets individually.
     *
     * @declare Highcharts.SeriesAreaRangeDataLabelsOptionsObject
     * @exclude x, y
     * @since   2.3.0
     * @product highcharts highstock
     *
     * @private
     */
    dataLabels: {

        align: void 0,

        verticalAlign: void 0,

        /**
         * X offset of the lower data labels relative to the point value.
         *
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         */
        xLow: 0,

        /**
         * X offset of the higher data labels relative to the point value.
         *
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         */
        xHigh: 0,

        /**
         * Y offset of the lower data labels relative to the point value.
         *
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         */
        yLow: 0,

        /**
         * Y offset of the higher data labels relative to the point value.
         *
         * @sample highcharts/plotoptions/arearange-datalabels/
         *         Data labels on range series
         */
        yHigh: 0

    }

};

/**
 * A `arearange` series. If the [type](#series.arearange.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 *
 * @extends   series,plotOptions.arearange
 * @excluding dataParser, dataURL, stack, stacking
 * @product   highcharts highstock
 * @requires  highcharts-more
 * @apioption series.arearange
 */

/**
 * @see [fillColor](#series.arearange.fillColor)
 * @see [fillOpacity](#series.arearange.fillOpacity)
 *
 * @apioption series.arearange.color
 */

/**
 * An array of data points for the series. For the `arearange` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 *     correspond to `x,low,high`. If the first value is a string, it is
 *     applied as the name of the point, and the `x` value is inferred.
 *     The `x` value can also be omitted, in which case the inner arrays
 *     should be of length 2\. Then the `x` value is automatically calculated,
 *     either starting at 0 and incremented by 1, or from `pointStart`
 *     and `pointInterval` given in the series options.
 *     ```js
 *     data: [
 *         [0, 8, 3],
 *         [1, 1, 1],
 *         [2, 6, 8]
 *     ]
 *     ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 *     few settings, see the complete options set below. If the total number of
 *     data points exceeds the series'
 *     [turboThreshold](#series.arearange.turboThreshold),
 *     this option is not available.
 *     ```js
 *     data: [{
 *         x: 1,
 *         low: 9,
 *         high: 0,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         low: 3,
 *         high: 4,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *     ```
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
 * @extends   series.line.data
 * @excluding marker, y
 * @product   highcharts highstock
 * @apioption series.arearange.data
 */

/**
 * @extends   series.arearange.dataLabels
 * @product   highcharts highstock
 * @apioption series.arearange.data.dataLabels
 */

/**
 * @see [color](#series.arearange.color)
 * @see [fillOpacity](#series.arearange.fillOpacity)
 *
 * @apioption series.arearange.fillColor
 */

/**
 * @see [color](#series.arearange.color)
 * @see [fillColor](#series.arearange.fillColor)
 *
 * @default   {highcharts} 0.75
 * @default   {highstock} 0.75
 * @apioption series.arearange.fillOpacity
 */

/**
 * Options for the lower markers of the arearange-like series. When `lowMarker`
 * is not defined, options inherit form the marker.
 *
 * @see [marker](#series.arearange.marker)
 *
 * @declare   Highcharts.PointMarkerOptionsObject
 * @extends   plotOptions.series.marker
 * @default   undefined
 * @product   highcharts highstock
 * @apioption plotOptions.arearange.lowMarker
 */

/**
 *
 * @sample {highcharts} highcharts/series-arearange/lowmarker/
 *         Area range chart with `lowMarker` option
 *
 * @declare   Highcharts.PointMarkerOptionsObject
 * @extends   plotOptions.series.marker.symbol
 * @product   highcharts highstock
 * @apioption plotOptions.arearange.lowMarker.symbol
 */

/**
 * The high or maximum value for each data point.
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.arearange.data.high
 */

/**
 * The low or minimum value for each data point.
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.arearange.data.low
 */

''; // Adds doclets above to transpiled file

/* *
 *
 *  Default Export
 *
 * */

export default AreaRangeSeriesDefaults;
