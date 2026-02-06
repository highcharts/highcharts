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


import type AreaSeriesOptions from './AreaSeriesOptions';


/* *
 *
 *  API Options
 *
 * */


/**
 * The area series type.
 *
 * @sample {highcharts} highcharts/demo/area-chart/
 *         Area chart
 * @sample {highstock} stock/demo/area/
 *         Area chart
 *
 * @extends      plotOptions.line
 * @excluding    useOhlcData
 * @product      highcharts highstock
 * @optionparent plotOptions.area
 */
const AreaSeriesDefaults: AreaSeriesOptions = {

    /**
     * @see [fillColor](#plotOptions.area.fillColor)
     * @see [fillOpacity](#plotOptions.area.fillOpacity)
     *
     * @apioption plotOptions.area.color
     */

    /**
     * Fill color or gradient for the area. When `undefined`, the series'
     * `color` is used with the series' `fillOpacity`.
     *
     * In styled mode, the fill color can be set with the `.highcharts-area`
     * class name.
     *
     * @see [color](#plotOptions.area.color)
     * @see [fillOpacity](#plotOptions.area.fillOpacity)
     *
     * @sample {highcharts} highcharts/plotoptions/area-fillcolor-default/
     *         Undefined by default
     * @sample {highcharts} highcharts/plotoptions/area-fillcolor-gradient/
     *         Gradient
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @product   highcharts highstock
     * @apioption plotOptions.area.fillColor
     */

    /**
     * Fill opacity for the area. When you set an explicit `fillColor`,
     * the `fillOpacity` is not applied. Instead, you should define the
     * opacity in the `fillColor` with an rgba color definition. The
     * `fillOpacity` setting, also the default setting, overrides the alpha
     * component of the `color` setting.
     *
     * In styled mode, the fill opacity can be set with the
     * `.highcharts-area` class name.
     *
     * @see [color](#plotOptions.area.color)
     * @see [fillColor](#plotOptions.area.fillColor)
     *
     * @sample {highcharts} highcharts/plotoptions/area-fillopacity/
     *         Automatic fill color and fill opacity of 0.1
     *
     * @type      {number}
     * @default   {highcharts} 0.75
     * @default   {highstock} 0.75
     * @product   highcharts highstock
     * @apioption plotOptions.area.fillOpacity
     */

    /**
     * A separate color for the graph line. By default the line takes the
     * `color` of the series, but the lineColor setting allows setting a
     * separate color for the line without altering the `fillColor`.
     *
     * In styled mode, the line stroke can be set with the
     * `.highcharts-graph` class name.
     *
     * @sample {highcharts} highcharts/plotoptions/area-linecolor/
     *         Dark gray line
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @product   highcharts highstock
     * @apioption plotOptions.area.lineColor
     */

    /**
     * A separate color for the negative part of the area. Note that `zones`
     * takes precedence over the negative fill color.
     *
     * In styled mode, a negative color is set with the
     * `.highcharts-negative` class name.
     *
     * @see [negativeColor](#plotOptions.area.negativeColor)
     *
     * @sample {highcharts} highcharts/css/series-negative-color/
     *         Negative color in styled mode
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since     3.0
     * @product   highcharts
     * @apioption plotOptions.area.negativeFillColor
     */

    /**
     * Whether the whole area or just the line should respond to mouseover
     * tooltips and other mouse or touch events.
     *
     * @sample {highcharts|highstock} highcharts/plotoptions/area-trackbyarea/
     *         Display the tooltip when the area is hovered
     *
     * @type      {boolean}
     * @default   false
     * @since     1.1.6
     * @product   highcharts highstock
     * @apioption plotOptions.area.trackByArea
     */

    /**
     * The Y axis value to serve as the base for the area, for
     * distinguishing between values above and below a threshold. The area
     * between the graph and the threshold is filled.
     *
     * * If a number is given, the Y axis will scale to the threshold.
     * * If `null`, the scaling behaves like a line series with fill between
     *   the graph and the Y axis minimum.
     * * If `Infinity` or `-Infinity`, the area between the graph and the
     *   corresponding Y axis extreme is filled (since v6.1.0).
     *
     * @sample {highcharts} highcharts/plotoptions/area-threshold/
     *         A threshold of 100
     * @sample {highcharts} highcharts/plotoptions/area-threshold-infinity/
     *         A threshold of Infinity
     *
     * @type    {number|null}
     * @since   2.0
     * @product highcharts highstock
     */
    threshold: 0,

    legendSymbol: 'areaMarker'

};

/**
 * A `area` series. If the [type](#series.area.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.area
 * @excluding dataParser, dataURL, useOhlcData
 * @product   highcharts highstock
 * @apioption series.area
 */

/**
 * @see [fillColor](#series.area.fillColor)
 * @see [fillOpacity](#series.area.fillOpacity)
 *
 * @apioption series.area.color
 */

/**
 * An array of data points for the series. For the `area` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` * and `pointInterval` given in the series options. If the
 *    axis has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *    data: [
 *        [0, 9],
 *        [1, 7],
 *        [2, 6]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.area.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 9,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 6,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
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
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @extends   series.line.data
 * @product   highcharts highstock
 * @apioption series.area.data
 */

/**
 * @see [color](#series.area.color)
 * @see [fillOpacity](#series.area.fillOpacity)
 *
 * @apioption series.area.fillColor
 */

/**
 * @see [color](#series.area.color)
 * @see [fillColor](#series.area.fillColor)
 *
 * @default   {highcharts} 0.75
 * @default   {highstock} 0.75
 * @apioption series.area.fillOpacity
 */

''; // Adds doclets above to transpiled

/* *
 *
 *  Default Export
 *
 * */

export default AreaSeriesDefaults;
