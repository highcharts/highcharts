/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type AreaSeriesOptions from './AreaSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * The area series type.
 *
 * @sample {highcharts} highcharts/demo/area-basic/
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
     * A separate color for the negative part of the area.
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

/* *
 *
 *  Default Export
 *
 * */

export default AreaSeriesDefaults;
