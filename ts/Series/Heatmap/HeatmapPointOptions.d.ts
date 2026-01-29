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

/* *
 *
 *  Imports
 *
 * */

import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type ScatterPointOptions from '../Scatter/ScatterPointOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * @extends series.scatter.data.marker
 * @optionparent series.heatmap.data.marker
 */
export interface HeatmapPointMarkerOptions extends PointMarkerOptions {

    /**
     * @excluding radius, radiusPlus
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.data.marker.states.hover
     */

    /**
     * The number of pixels to increase the height of the hovered point.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
     *         One day
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highstock
     *
     * @apioption series.heatmap.data.marker.states.hover.heightPlus
     */

    /**
     * The number of pixels to increase the width of the hovered point.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
     *         One day
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highstock
     *
     * @apioption series.heatmap.data.marker.states.hover.widthPlus
     */

    /**
     * Set the marker's fixed height on hover state.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
     *         70px fixed marker's width and height on hover
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.data.marker.states.hover.height
     */

    /**
     * Set the marker's fixed width on hover state.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
     *         70px fixed marker's width and height on hover
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.data.marker.states.hover.width
     */

    /**
     * Set the marker's fixed width on hover state.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-linewidthplus
     *         5 pixels wider lineWidth on hover
     *
     * @type {number|undefined}
     *
     * @default 0
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.data.marker.states.hover.lineWidthPlus
     */

    /**
     * @excluding radius
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.data.marker.states.select
     */

    /**
     * Set the marker's fixed height on select state.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
     *         70px fixed marker's width and height on hover
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.data.marker.states.select.height
     */

    /**
     * The number of pixels to increase the height of the hovered point.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
     *         One day
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highstock
     *
     * @apioption series.heatmap.data.marker.states.select.heightPlus
     */

    /**
     * Set the marker's fixed width on select state.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
     *         70px fixed marker's width and height on hover
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.data.marker.states.select.width
     */

    /**
     * The number of pixels to increase the width of the hovered point.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
     *         One day
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highstock
     *
     * @apioption series.heatmap.data.marker.states.select.widthPlus
     */

    /**
     * @excluding radius, radiusPlus
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.marker.states.hover
     */

    /**
     * Set the marker's fixed height on hover state.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
     *         70px fixed marker's width and height on hover
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.marker.states.hover.height
     */

    /**
     * The number of pixels to increase the height of the hovered point.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
     *         One day
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.marker.states.hover.heightPlus
     */

    /**
     * Set the marker's fixed width on hover state.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-linewidthplus
     *         5 pixels wider lineWidth on hover
     *
     * @type {number|undefined}
     *
     * @default 0
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.marker.states.hover.lineWidthPlus
     */

    /**
     * Set the marker's fixed width on hover state.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-width
     *         70px fixed marker's width and height on hover
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.marker.states.hover.width
     */

    /**
     * The number of pixels to increase the width of the hovered point.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
     *         One day
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.marker.states.hover.widthPlus
     */

    /**
     * @excluding radius
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.marker.states.select
     */

    /**
     * The number of pixels to increase the height of the hovered point.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
     *         One day
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.marker.states.select.heightPlus
     */

    /**
     * The number of pixels to increase the width of the hovered point.
     *
     * @sample {highcharts} maps/plotoptions/heatmap-marker-states-hover-widthplus
     *         One day
     *
     * @type {number|undefined}
     *
     * @default undefined
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.marker.states.select.widthPlus
     */

    r?: number;

}

export interface HeatmapPointOptions extends ScatterPointOptions {

    borderWidth?: number;

    /**
     * The color of the point. In heat maps the point color is rarely set
     * explicitly, as we use the color to denote the `value`. Options for this
     * are set in the [colorAxis](#colorAxis) configuration.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.data.color
     */

    /**
     * @excluding radius, enabledThreshold
     *
     * @product highcharts highmaps
     *
     * @since 8.1
     *
     * @apioption series.heatmap.data.marker
     */
    marker?: HeatmapPointMarkerOptions;

    /**
     * Point padding for a single point.
     *
     * @sample maps/plotoptions/tilemap-pointpadding
     *         Point padding on tiles
     *
     * @type {number}
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.data.pointPadding
     */
    pointPadding?: number;

    /**
     * The x value of the point. For datetime axes, the X value is the timestamp
     * in milliseconds since 1970.
     *
     * @type {number}
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.data.x
     */

    /**
     * The y value of the point.
     *
     * @type {number}
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.data.y
     */

    /**
     * The value of the point, resulting in a color controlled by options as set
     * in the [colorAxis](#colorAxis) configuration.
     *
     * @type {number}
     *
     * @product highcharts highmaps
     *
     * @apioption series.heatmap.data.value
     */
    value?: (number|null);

}

/* *
 *
 *  Default Export
 *
 * */

export default HeatmapPointOptions;
