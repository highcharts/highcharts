/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Authors: Magdalena Gut, Piotr Madej
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

import type ColorType from '../../Core/Color/ColorType';
import type MapSeriesOptions from '../Map/MapSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface InterpolationObject {

    /**
     * Represents how much blur should be added to the interpolated
     * image. Works best in the range of 0-1, all higher values
     * would need a lot more performance of the machine to calculate
     * more detailed interpolation.
     *
     *  * **Note:** Useful, if the data is spread into wide range of
     *  longitude and latitude values.
     *
     * @sample maps/series-geoheatmap/turkey-fire-areas
     *         Simple demo of GeoHeatmap interpolation
     *
     * @since 11.2.0
     */
    blur: number;

    /**
     * Enable or disable the interpolation of the geoheatmap series.
     *
     * @since 11.2.0
     */
    enabled: boolean;
}

/**
 * A `geoheatmap` series is a variety of heatmap series, composed into
 * the map projection, where the units are expressed in the latitude
 * and longitude, and individual values contained in a matrix are
 * represented as colors.
 *
 * A `geoheatmap` series. If the [type](#series.map.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample maps/demo/geoheatmap-europe/
 *         GeoHeatmap Chart with interpolation on Europe map
 *
 * @sample maps/series-geoheatmap/geoheatmap-equalearth/
 *         GeoHeatmap Chart on the Equal Earth Projection
 *
 * @extends plotOptions.map
 *
 * @extends series,plotOptions.geoheatmap
 *
 * @since 11.0.0
 *
 * @excluding allAreas, dataParser, dataURL, dragDrop, findNearestPointBy,
 *            geometry, joinBy, mapData, marker, negativeColor, onPoint,
 *            shadow
 *
 * @product highmaps
 *
 * @requires modules/geoheatmap
 */
interface GeoHeatmapSeriesOptions extends MapSeriesOptions {

    /**
     * The border width of each geoheatmap tile.
     *
     * In styled mode, the border stroke width is given in the
     * `.highcharts-point` class.
     *
     * @sample maps/demo/geoheatmap-orthographic/
     *         borderWidth set to 1 to create a grid
     *
     * @default 0
     *
     * @product highmaps
     */
    borderWidth?: number;

    /**
     * The main color of the series. In heat maps this color is rarely
     * used, as we mostly use the color to denote the value of each
     * point. Unless options are set in the [colorAxis](#colorAxis), the
     * default value is pulled from the [options.colors](#colors) array.
     *
     * @product highmaps
     */
    color?: ColorType;

    /**
     * The column size - how many longitude units each column in the
     * geoheatmap should span.
     *
     * @sample maps/demo/geoheatmap-europe/
     *         1 by default, set to 5
     *
     * @product highmaps
     */
    colsize?: number;

    /**
     * Make the geoheatmap render its data points as an interpolated
     * image. It can be used to show a Temperature Map-like charts.
     *
     * @sample maps/demo/geoheatmap-earth-statistics
     *         Advanced demo of GeoHeatmap interpolation with multiple
     *         datasets
     *
     * @since 11.2.0
     *
     * @product highmaps
     */
    interpolation: boolean|InterpolationObject;

    /**
     * The rowsize size - how many latitude units each row in the
     * geoheatmap should span.
     *
     * @sample maps/demo/geoheatmap-europe/
     *         1 by default, set to 5
     *
     * @product highmaps
     */
    rowsize?: number;

    /* *
     *
     *  Excluded
     *
     * */

    allAreas?: undefined;
    dataParser?: undefined;
    dataURL?: undefined;
    dragDrop?: undefined;
    findNearestPointBy?: undefined;
    joinBy?: undefined;
    mapData?: undefined;
    marker?: undefined;
    negativeColor?: undefined;
    onPoint?: undefined;
    shadow?: undefined;
}

/* *
 *
 *  Default Export
 *
 * */

export default GeoHeatmapSeriesOptions;
