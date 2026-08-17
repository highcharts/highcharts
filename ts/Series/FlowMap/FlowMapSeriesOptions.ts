/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Askel Eirik Johansson
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { ColorType } from '../../Core/Color/ColorType';
import type { MapSeriesTooltipOptions } from '../Map/MapSeriesOptions';
import type { MapLineSeriesOptions } from '../MapLine/MapLineSeriesOptions';
import type { FlowMapPointOptions, MarkerEndOptions } from './FlowMapPointOptions';


/* *
 *
 *  Declarations
 *
 * */

/**
 * A flowmap series is a series laid out on top of a map series allowing to
 * display route paths (e.g. flight or ship routes) or flows on a map. It
 * creates a link between two points on a map chart.
 *
 * @since 11.0.0
 * @excluding affectsMapView, allAreas, allowPointSelect, boostBlending,
 * boostThreshold, borderColor, borderWidth, dashStyle, dataLabels,
 * dragDrop, joinBy, mapData, negativeColor, onPoint, shadow, showCheckbox
 * @product highmaps
 * @requires modules/flowmap
 */
export interface FlowMapSeriesOptions extends MapLineSeriesOptions {
    /** @default true */
    animation?: boolean;

    /**
     * The `curveFactor` option for all links. Value higher than 0 will
     * curve the link clockwise. A negative value will curve it counter
     * clockwise. If the value is 0 the link will be a straight line. By
     * default undefined curveFactor get an automatic curve.
     *
     * @sample {highmaps} maps/series-flowmap/curve-factor Setting different
     *         values for curveFactor
     */
    curveFactor?: number;

    /**
     * An array of data points for the series. For the `flowmap` series
     * type, points can be given in the following ways:
     *
     * 1.  An array of arrays with options as values. In this case,
     *     the values correspond to `from, to, weight`. Example:
     *     ```js
     *     data: [
     *         ['Point 1', 'Point 2', 4]
     *     ]
     *     ```
     *
     * 2.  An array of objects with named values. The following snippet shows
     *     only a few settings, see the complete options set below.
     *
     *     ```js
     *     data: [{
     *         from: 'Point 1',
     *         to: 'Point 2',
     *         curveFactor: 0.4,
     *         weight: 5,
     *         growTowards: true,
     *         markerEnd: {
     *             enabled: true,
     *             height: 15,
     *             width: 8
     *         }
     *     }]
     *     ```
     *
     * 3.   For objects with named values, instead of using the `mappoint` `id`,
     *      you can use `[longitude, latitude]` arrays.
     *
     *      ```js
     *      data: [{
     *          from: [longitude, latitude],
     *          to: [longitude, latitude]
     *      }]
     *      ```
     *
     * @basic
     */
    data?: Array<(number|null|FlowMapPointOptions)>;

    /**
     * The fill color of all the links. If not set, the series color will be
     * used with the opacity set in
     * [fillOpacity](#plotOptions.flowmap.fillOpacity).
     */
    fillColor?: ColorType;

    /**
     * The opacity of the color fill for all links.
     *
     * @sample {highmaps} maps/series-flowmap/fill-opacity
     *         Setting different values for fillOpacity
     *
     * @default 0.5
     */
    fillOpacity?: number;

    growTowards?: boolean;

    /**
     * The [id](#series.id) of another series to link to. Additionally, the
     * value can be ":previous" to link to the previous series. When two
     * series are linked, only the first one appears in the legend. Toggling
     * the visibility of this also toggles the linked series, which is
     * necessary for operations such as zoom or updates on the flowmap
     * series.
     */
    linkedTo?: string;

    /**
     * Specify the `lineWidth` of the links if they are not specified.
     */
    lineWidth?: number;

    /**
     * A `markerEnd` creates an arrow symbol indicating the direction of
     * flow at the destination. Specifying a `markerEnd` here will create
     * one for each link.
     */
    markerEnd?: MarkerEndOptions;

    /**
     * Maximum width of a link expressed in pixels. The weight of a link is
     * mapped between `maxWidth` and `minWidth`.
     *
     * @default 25
     */
    maxWidth: number;

    /**
     * Minimum width of a link expressed in pixels. The weight of a link is
     * mapped between `maxWidth` and `minWidth`.
     *
     * @default 5
     */
    minWidth: number;

    /**
     * The opacity of all the links. Affects the opacity for the entire
     * link, including stroke. See also
     * [fillOpacity](#plotOptions.flowmap.fillOpacity), that affects the
     * opacity of only the fill color.
     */
    opacity?: number;

    tooltip?: FlowMapSeriesTooltipOptions;

    /**
     * The weight for all links with unspecified weights. The weight of a
     * link determines its thickness compared to other links.
     *
     * @sample {highmaps} maps/series-flowmap/ship-route/
     *         Example ship route
     */
    weight?: number;

    /**
     * If no weight has previously been specified, this will set the width
     * of all the links without being compared to and scaled according to
     * other weights.
     *
     * @default 1
     */
    width?: number;

    /* *
     *
     *  Excluded
     *
     * */

    affectsMapView?: undefined;
    allAreas?: undefined;
    allowPointSelect?: undefined;
    boostBlending?: undefined;
    boostThreshold?: undefined;
    borderColor?: undefined;
    borderWidth?: undefined;
    dashStyle?: undefined;
    dataLabels?: undefined;
    dragDrop?: undefined;
    joinBy?: undefined;
    mapData?: undefined;
    negativeColor?: undefined;
    onPoint?: undefined;
    shadow?: undefined;
    showCheckbox?: undefined;
}

export interface FlowMapSeriesTooltipOptions extends MapSeriesTooltipOptions {
    /**
     * The HTML for the flowmaps' route description in the tooltip. It
     * consists of the `headerFormat` and `pointFormat`, which can be
     * edited. Variables are enclosed by curly brackets. Available
     * variables are `series.name`, `point.options.from`,
     * `point.options.to`, `point.options.weight` and other properties in
     * the same form.
     *
     * @default '<span style="font-size: 0.8em">{series.name}</span><br/>'
     */
    headerFormat?: string;

    /**
     * @default '{point.options.from} \u2192 {point.options.to}: <b>{point.options.weight}</b>'
     */
    pointFormat?: string;
}

/* *
 *
 *  Default export
 *
 * */

export default FlowMapSeriesOptions;
