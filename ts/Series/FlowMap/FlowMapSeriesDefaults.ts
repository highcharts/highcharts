/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { FlowMapSeriesOptions } from './FlowMapSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A flowmap series is a series laid out on top of a map series allowing to
 * display route paths (e.g. flight or ship routes) or flows on a map. It
 * creates a link between two points on a map chart.
 *
 * @since 11.0.0
 * @extends      plotOptions.mapline
 * @excluding    affectsMapView, allAreas, allowPointSelect, boostBlending,
 * boostThreshold, borderColor, borderWidth, dashStyle, dataLabels,
 * dragDrop, joinBy, mapData, negativeColor, onPoint, shadow, showCheckbox
 * @product      highmaps
 * @requires     modules/flowmap
 * @optionparent plotOptions.flowmap
 */
const FlowMapSeriesDefaults: FlowMapSeriesOptions = {
    animation: true,

    /**
     * The `curveFactor` option for all links. Value higher than 0 will
     * curve the link clockwise. A negative value will curve it counter
     * clockwise. If the value is 0 the link will be a straight line. By
     * default undefined curveFactor get an automatic curve.
     *
     * @sample {highmaps} maps/series-flowmap/curve-factor Setting different
     *         values for curveFactor
     *
     * @type      {number}
     * @default   undefined
     * @apioption plotOptions.flowmap.curveFactor
     */

    /**
     * The fill color of all the links. If not set, the series color will be
     * used with the opacity set in
     * [fillOpacity](#plotOptions.flowmap.fillOpacity).
     *
     * @type      {Highcharts.ColorType}
     * @apioption plotOptions.flowmap.fillColor
     */

    /**
     * The opacity of the color fill for all links.
     *
     * @type   {number}
     * @sample {highmaps} maps/series-flowmap/fill-opacity
     *         Setting different values for fillOpacity
     */
    fillOpacity: 0.5,

    /**
     * The [id](#series.id) of another series to link to. Additionally, the
     * value can be ":previous" to link to the previous series. When two
     * series are linked, only the first one appears in the legend. Toggling
     * the visibility of this also toggles the linked series, which is
     * necessary for operations such as zoom or updates on the flowmap
     * series.
     *
     * @type      {string}
     * @apioption plotOptions.flowmap.linkedTo
     */

    /**
     * A `markerEnd` creates an arrow symbol indicating the direction of
     * flow at the destination. Specifying a `markerEnd` here will create
     * one for each link.
     *
     * @declare Highcharts.SeriesFlowMapSeriesOptionsObject
     */
    markerEnd: {
        /**
         * Enable or disable the `markerEnd`.
         *
         * @type   {boolean}
         * @sample {highmaps} maps/series-flowmap/marker-end
         *         Setting different markerType for markerEnd
         */
        enabled: true,
        /**
         * Height of the `markerEnd`. Can be a number in pixels or a
         * percentage based on the weight of the link.
         *
         * @type  {number|string}
         */
        height: '40%',
        /**
         * Width of the `markerEnd`. Can be a number in pixels or a
         * percentage based on the weight of the link.
         *
         * @type  {number|string}
         */
        width: '40%',
        /**
         * Change the shape of the `markerEnd`.
         * Can be `arrow` or `mushroom`.
         *
         * @type {string}
         */
        markerType: 'arrow'
    },

    /**
     * If no weight has previously been specified, this will set the width
     * of all the links without being compared to and scaled according to
     * other weights.
     *
     * @type  {number}
     */
    width: 1,

    /**
     * Maximum width of a link expressed in pixels. The weight of a link is
     * mapped between `maxWidth` and `minWidth`.
     *
     * @type  {number}
     */
    maxWidth: 25,

    /**
     * Minimum width of a link expressed in pixels. The weight of a link is
     * mapped between `maxWidth` and `minWidth`.
     *
     * @type  {number}
     */
    minWidth: 5,

    /**
     * Specify the `lineWidth` of the links if they are not specified.
     *
     * @type  {number}
     */
    lineWidth: void 0,

    /**
     * The opacity of all the links. Affects the opacity for the entire
     * link, including stroke. See also
     * [fillOpacity](#plotOptions.flowmap.fillOpacity), that affects the
     * opacity of only the fill color.
     *
     * @apioption plotOptions.flowmap.opacity
     */

    /**
     * The weight for all links with unspecified weights. The weight of a
     * link determines its thickness compared to other links.
     *
     * @sample {highmaps} maps/series-flowmap/ship-route/ Example ship route
     *
     * @type      {number}
     * @product   highmaps
     * @apioption plotOptions.flowmap.weight
     */

    tooltip: {
        /**
         * The HTML for the flowmaps' route description in the tooltip. It
         * consists of the `headerFormat` and `pointFormat`, which can be
         * edited. Variables are enclosed by curly brackets. Available
         * variables are `series.name`, `point.options.from`,
         * `point.options.to`, `point.options.weight` and other properties in
         * the same form.
         *
         * @product   highmaps
         */
        headerFormat: '<span style="font-size: 0.8em">{series.name}</span><br/>',
        pointFormat: '{point.options.from} \u2192 {point.options.to}: <b>{point.options.weight}</b>'
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default FlowMapSeriesDefaults;
