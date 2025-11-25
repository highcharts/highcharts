/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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

import type ContourSeriesOptions from './ContourSeriesOptions';


/* *
 *
 *  Definitions
 *
 * */

/**
 * A contour plot is a graphical representation of three-dimensional data
 *
 * @productdesc {highcharts}
 * Requires `modules/contour`.
 *
 * @sample highcharts/demo/contour/
 *
 * @extends      plotOptions.scatter
 * @excluding    animationLimit, cluster, connectEnds, connectNulls,
 *               cropThreshold, dashStyle, dragDrop, findNearestPointBy,
 *               getExtremesFromAll, jitter, legendSymbolColor, linecap,
 *               lineWidth, pointInterval, pointIntervalUnit, pointRange,
 *               pointStart, shadow, softThreshold, stacking, step, threshold
 *
 * @product      highcharts highmaps
 * @optionparent plotOptions.contour
 */
const ContourSeriesDefaults: ContourSeriesOptions = {

    /**
     * The offset of the contour lines.
     */
    contourOffset: 0,

    /**
     * This must be set to 'value' to make the colorAxis track with the contour
     * plot.
     */
    colorKey: 'value',

    clip: false,

    findNearestPointBy: 'xy',

    /**
     * Whether to use smooth color transitions.
     *
     * @type      {boolean}
     * @default   true
     * @apioption plotOptions.contour.smoothColoring
     */

    /**
     * The interval between contour lines.
     *
     * @type      {number}
     * @default   1
     * @apioption plotOptions.contour.contourInterval
     */

    /**
     * Whether to display contour lines.
     *
     * @type      {boolean}
     * @default   true
     * @apioption plotOptions.contour.showContourLines
     */

    /**
     * Whether to render the series on the background, so that it is visible
     * behind axes and grid lines. It will be also visible behind series that
     * are rendered before it.
     *
     * @type      {boolean}
     * @default   true
     * @apioption plotOptions.contour.renderOnBackground
     */

    /**
     * @excluding radius, enabledThreshold
     */
    marker: {
        /**
         * A predefined shape or symbol for the marker. When undefined, the
         * symbol is pulled from options.symbols. Other possible values are
         * `'circle'`, `'square'`,`'diamond'`, `'triangle'`,
         * `'triangle-down'`, `'rect'`, `'ellipse'`, and `'cross'`.
         *
         * Additionally, the URL to a graphic can be given on this form:
         * `'url(graphic.png)'`. Note that for the image to be applied to
         * exported charts, its URL needs to be accessible by the export
         * server.
         *
         * Custom callbacks for symbol path generation can also be added to
         * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
         * used by its method name, as shown in the demo.
         *
         * @sample {highcharts} highcharts/plotoptions/series-marker-symbol/
         *         Predefined, graphic and custom markers
         * @sample {highstock} highcharts/plotoptions/series-marker-symbol/
         *         Predefined, graphic and custom markers
         */
        symbol: 'cross',
        /** @ignore-option */
        lineColor: void 0,
        states: {
            /**
             * @excluding radius, radiusPlus
             */
            hover: {
                /**
                 * Color of the cross marker. Defaults to `'black'`.
                 *
                 * @type    {string}
                 *
                 * @default black
                 *
                 * @apioption plotOptions.contour.marker.states.hover.lineColor
                 */
                lineColor: 'black',

                /**
                 * Fill of the cross marker. Defaults to `'transparent'`.
                 *
                 * @type    {string}
                 *
                 * @default transparent
                 *
                 * @apioption plotOptions.contour.marker.states.hover.fillColor
                 */
                fillColor: 'transparent'
            }
        }
    },

    /**
     * Whether to render the series on the background, so that it is visible
     * behind axes and grid lines. It will be also visible behind series that
     * are rendered before it.
     *
     * @type      {boolean}
     *
     * @default   true
     *
     * @apioption plotOptions.contour.renderOnBackground
     */
    renderOnBackground: true,

    states: {
        hover: {
            /** @ignore-option */
            halo: void 0
        }
    },

    tooltip: {
        pointFormat: '{point.x}, {point.y}: {point.value}<br/>'
    },

    zIndex: 0

};


/**
 * A contour plot is a graphical representation of three-dimensional data
 * in two dimensions using contour lines or color-coded regions.
 *
 * @productdesc {highcharts}
 * Requires `modules/contour`.
 *
 * @sample highcharts/demo/contour/
 *         Simple contour
 *
 * @extends      series,plotOptions.contour
 * @excluding    cropThreshold, dataParser, dataURL, dragDrop ,pointRange,
 *               stack, allowPointSelect, boostBlending, boostThreshold, color,
 *               colorIndex, connectEnds, connectNulls, crisp, dashStyle,
 *               inactiveOtherPoints, jitter, linecap, negativeColor,
 *               pointInterval, pointStart, pointIntervalUnit, lineWidth,
 *               onPoint, pointPlacement, shadow, stacking, step, threshold,
 *               zoneAxis, zones, onPoint
 *
 *
 * @product      highcharts highmaps
 * @apioption    series.contour
 */

/**
 * An array of data points for the series. For the `contour` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,y,value`. If the first value is a string, it is
 * applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 *
 *  ```js
 *     data: [
 *         [0, 9, 7],
 *         [1, 10, 4],
 *         [2, 6, 3]
 *     ]
 *  ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.contour.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 3,
 *         value: 10,
 *         name: "Point2"
 *     }, {
 *         x: 1,
 *         y: 7,
 *         value: 10,
 *         name: "Point1"
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
 * @type      {Array<Array<number>|*>}
 * @extends   series.line.data
 * @product   highcharts highmaps
 * @apioption series.contour.data
 */

/**
 * The value of the point, resulting in a color controlled by options
 * as set in the [colorAxis](#colorAxis) configuration.
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.contour.data.value
 */

/**
 * The x value of the point. For datetime axes,
 * the X value is the timestamp in milliseconds since 1970.
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.contour.data.x
 */

/**
 * The y value of the point.
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.contour.data.y
 */


''; // Keeps doclets above separate

export default ContourSeriesDefaults;
