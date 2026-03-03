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

import type ColorType from '../Core/Color/ColorType';
import type ProjectionOptions from './ProjectionOptions';
import type {
    GeoJSONGeometryMultiPoint,
    MultiLineString,
    Polygon
} from './GeoJSON';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Options' {
    interface Options {

        /**
         * The `mapView` options control the initial view of the chart, and how
         * projection is set up for raw geoJSON maps (beta as of v9.3).
         *
         * To set the view dynamically after chart generation, see
         * [mapView.setView](/class-reference/Highcharts.MapView#setView).
         *
         * @since        9.3.0
         * @product      highmaps
         */
        mapView?: MapViewOptions;
    }
}

/**
 * An array of longitude, latitude.
 *
 * @typedef {Array<number>} Highcharts.LonLatArray
 */
export type LonLatArray = [number, number];

/**
 * The padding of the map view. Can be either a number of pixels, a percentage
 * string, or an array of either. If an array is given, it sets the top, right,
 * bottom, left paddings respectively.
 *
 * @interface Highcharts.MapViewPaddingType
 * @typedef {number|string|Array<number|string>} Highcharts.MapViewPaddingType
 */
export type MapViewPaddingType = (
    number|
    string|
    [number|string, number|string, number|string, number|string]
);

/**
 * An array of longitude, latitude.
 *
 * @interface Highcharts.ProjectedXYArray
 * @typedef {Array<number> & { outside?: boolean }} Highcharts.ProjectedXYArray
 */
export type ProjectedXYArray = [number, number] & { outside?: boolean };

/**
 * Result object of a map transformation.
 *
 * @interface Highcharts.ProjectedXY
 */
export interface ProjectedXY {
    /**
     * X coordinate in projected units.
     * @name Highcharts.ProjectedXY#x
     */
    x: number;
    /**
     * Y coordinate in projected units
     * @name Highcharts.ProjectedXY#y
     */
    y: number;
}

/**
 * Object containing the bounds of the map.
 * All coordinates are in projected units.
 *
 * @interface Highcharts.MapBounds
 */
export interface MapBounds {
    /**
     * The center of the bounding box.
     * @name Highcharts.MapBounds#midX
     */
    midX?: number;
    /**
     * The center of the bounding box.
     * @name Highcharts.MapBounds#midY
     */
    midY?: number;
    /**
     * First point's X of the bounding box.
     * @name Highcharts.MapBounds#x1
     */
    x1: number;
    /**
     * First point's Y of the bounding box.
     * @name Highcharts.MapBounds#y1
     */
    y1: number;
    /**
     * Second point's X of the bounding box.
     * @name Highcharts.MapBounds#x2
     */
    x2: number;
    /**
     * Second point's Y of the bounding box.
     * @name Highcharts.MapBounds#y2
     */
    y2: number;
}

/**
 * Generic options for the placement and appearance of map insets like
 * non-contiguous territories.
 *
 * @since        10.0.0
 * @product      highmaps
 * @optionparent mapView.insetOptions
 */
export interface MapViewInsetOptions {
    /**
     * The border color of the insets.
     *
     * @sample maps/mapview/insetoptions-border
     *         Inset border options
     *
     * @type {Highcharts.ColorType}
     */
    borderColor: ColorType;

    /**
     * The pixel border width of the insets.
     *
     * @sample maps/mapview/insetoptions-border
     *         Inset border options
     */
    borderWidth: number;

    /**
     * The padding of the insets. Can be either a number of pixels, a
     * percentage string, or an array of either. If an array is given, it
     * sets the top, right, bottom, left paddings respectively.
     *
     * @type {Highcharts.MapViewPaddingType}
     */
    padding: MapViewPaddingType;

    /**
     * What coordinate system the `field` and `borderPath` should relate to.
     *
     * If `plotBox`, they will be fixed to the plot box and responsively move
     * in relation to the main map.
     *
     * If `mapBoundingBox`, they will be fixed to the map bounding box, which is
     * constant and centered in different chart sizes and ratios.
     *
     * @default mapBoundingBox
     */
    relativeTo: MapViewInsetOptionsRelativeToValue;

    /**
     * What units to use for the `field` and `borderPath` geometries. If
     * `percent` (default), they relate to the box given in `relativeTo`. If
     * `pixels`, they are absolute values.
     */
    units: ('percent'|'pixels');
}

/**
 * Possible values for the specific `relativeTo` option.
 *
 * @typedef {"mapBoundingBox"|"plotBox"} Highcharts.MapViewInsetOptionsRelativeToValue
 */
export type MapViewInsetOptionsRelativeToValue = 'mapBoundingBox' | 'plotBox';

/**
 * Options for each individual inset.
 *
 * @extends mapView.insetOptions
 */
export interface MapViewInsetsOptions extends MapViewInsetOptions {
    /**
     * A geometry object of type `MultiLineString` defining the border path
     * of the inset in terms of `units`. If undefined, a border is rendered
     * around the `field` geometry. It is recommended that the `borderPath`
     * partly follows the outline of the `field` in order to make pointer
     * positioning consistent.
     *
     * @sample    maps/mapview/insets-complete
     *            Complete inset config with `borderPath`
     */
    borderPath?: MultiLineString;

    /**
     * The center of the inset in terms of longitude and latitude.
     */
    center: LonLatArray;

    /**
     * A geometry object of type `Polygon` defining where in the chart the
     * inset should be rendered, in terms of `units` and relative to the
     * `relativeTo` setting. If a `borderPath` is omitted, a border is rendered
     * around the field. If undefined, the inset is rendered in the full plot
     * area.
     *
     * @sample    maps/mapview/insets-extended
     *            Border path emitted, field is rendered
     */
    field?: Polygon;

    /**
     * A geometry object of type `Polygon` encircling the shapes that should be
     * rendered in the inset, in terms of geographic coordinates. Geometries
     * within this geometry are removed from the default map view and rendered
     * in the inset.
     *
     * @sample    maps/mapview/insets-complete
     *            Complete inset config with `geoBounds`
     */
    geoBounds?: Polygon;

    /**
     * The id of the inset, used for internal reference.
     *
     * @sample    maps/mapview/insets-extended
     *            Extending recommended insets by id
     */
    id?: string;

    /**
     * The projection options for the inset.
     *
     * @extends   mapView.projection
     */
    projection?: ProjectionOptions;
}

/**
 * The `mapView` options control the initial view of the chart, and how
 * projection is set up for raw geoJSON maps (beta as of v9.3).
 *
 * To set the view dynamically after chart generation, see
 * [mapView.setView](/class-reference/Highcharts.MapView#setView).
 *
 * @since        9.3.0
 * @product      highmaps
 */
export interface MapViewOptions {
    /**
     * Fit the map to a geometry object consisting of individual points or
     * polygons. This is practical for responsive maps where we want to
     * focus on a specific area regardless of map size - unlike setting
     * `center` and `zoom`, where the view doesn't scale with different map
     * sizes.
     *
     * The geometry can be combined with the [padding](#mapView.padding)
     * option to avoid touching the edges of the chart.
     *
     * @sample maps/mapview/fittogeometry
     *         Fitting the view to geometries
     *
     * @since 10.3.3
     */
    fitToGeometry?: GeoJSONGeometryMultiPoint;

    /**
     * The center of the map in terms of longitude and latitude. For
     * preprojected maps (like the GeoJSON files in Map Collection v1.x),
     * the units are projected x and y units.
     *
     * @sample {highmaps} maps/mapview/center-zoom
     *         Custom view of a world map
     * @sample {highmaps} maps/mapview/get-view
     *         Report the current view of a preprojected map
     *
     * @type    {Highcharts.LonLatArray}
     * @default [0, 0]
     */
    center: LonLatArray;

    /**
     * Generic options for the placement and appearance of map insets like
     * non-contiguous territories.
     *
     * @since        10.0.0
     * @product      highmaps
     * @optionparent mapView.insetOptions
     */
    insetOptions?: MapViewInsetOptions;

    /**
     * The individual MapView insets, typically used for non-contiguous
     * areas of a country. Each item inherits from the generic
     * `insetOptions`.
     *
     * Some of the TopoJSON files of the Highcharts Map Collection include a
     * property called `hc-recommended-mapview`, and some of these include
     * insets. In order to override the recommended inset options, an inset
     * option with a matching id can be applied, and it will be merged into the
     * embedded settings.
     *
     * @sample      maps/mapview/insets-extended
     *              Extending the embedded insets
     * @sample      maps/mapview/insets-complete
     *              Complete inset config from scratch
     *
     * @extends     mapView.insetOptions
     * @type        Array<Object>
     * @product     highmaps
     */
    insets?: MapViewInsetsOptions[];

    /**
     * Prevents the end user from zooming too far in on the map. See
     * [zoom](#mapView.zoom).
     *
     * @sample {highmaps} maps/mapview/maxzoom
     *         Prevent zooming in too far
     */
    maxZoom?: number;

    /**
     * The padding inside the plot area when auto fitting to the map bounds.
     * A number signifies pixels, and a percentage is relative to the plot
     * area size.
     *
     * An array sets individual padding for the sides in the order [top,
     * right, bottom, left].
     *
     * @sample {highmaps} maps/chart/plotbackgroundcolor-color
     *         Visible plot area and percentage padding
     * @sample {highmaps} maps/demo/mappoint-mapmarker
     *         Padding for individual sides
     */
    padding: MapViewPaddingType;

    /**
     * The projection options allow applying client side projection to a map
     * given in geographic coordinates, typically from TopoJSON or GeoJSON.
     *
     * @sample maps/demo/projection-explorer
     *         Projection explorer
     * @sample maps/demo/topojson-projection
     *         Orthographic projection
     * @sample maps/mapview/projection-custom-proj4js
     *         Custom UTM projection definition
     * @sample maps/mapview/projection-custom-d3geo
     *         Custom Robinson projection definition
     */
    projection?: ProjectionOptions;

    /**
     * The zoom level of a map. Higher zoom levels means more zoomed in. An
     * increase of 1 zooms in to a quarter of the viewed area (half the
     * width and height). Defaults to fitting to the map bounds.
     *
     * In a `WebMercator` projection, a zoom level of 0 represents
     * the world in a 256x256 pixel square. This is a common concept for WMS
     * tiling software.
     *
     * @sample {highmaps} maps/mapview/center-zoom
     *         Custom view of a world map
     * @sample {highmaps} maps/mapview/get-view
     *         Report the current view of a preprojected map
     */
    zoom?: number;

    /** @internal */
    minZoom?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default MapViewOptions;
