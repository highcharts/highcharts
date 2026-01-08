/* *
 *
 *  (c) 2010-2026
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

import type MapSeriesOptions from '../Map/MapSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type { TilesProviderRegistryName } from '../../Maps/TilesProviders/TilesProviderRegistry';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A tiledwebmap series allows user to display dynamically joined individual
 * images (tiles) and join them together to create a map.
 *
 * A `tiledwebmap` series. The [type](#series.tiledwebmap.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample maps/series-tiledwebmap/simple-demo-norway
 *         Simple demo of data for Norway on TiledWebMap
 *
 * @sample maps/series-tiledwebmap/only-twm
 *         OpenStreetMap demo
 *
 * @extends plotOptions.map
 *
 * @extends series,plotOptions.tiledwebmap
 *
 * @excluding affectsMapView, allAreas, allowPointSelect, animation,
 *            animationLimit, boostBlending, boostThreshold, borderColor,
 *  borderWidth,
 *            clip, color, colorAxis, colorByPoint, colorIndex, colorKey,
 *  colors,
 *            cursor, dashStyle, dataLabels, dataParser, dataURL, dragDrop,
 *            enableMouseTracking, findNearestPointBy, joinBy, keys, marker,
 *            negativeColor, nullColor, nullInteraction, onPoint, point,
 *            pointDescriptionFormatter, selected, shadow, showCheckbox,
 *            sonification, stickyTracking, tooltip, type
 *
 * @excluding affectsMapView, allAreas, allowPointSelect, animation,
 *            animationLimit, boostBlending, boostThreshold, borderColor,
 *  borderWidth,
 *            clip, color, colorAxis, colorByPoint, colorIndex, colorKey,
 *  colors, cursor,
 *            dashStyle, dataLabels, dataParser, dataURL, dragDrop,
 *  enableMouseTracking,
 *            findNearestPointBy, joinBy, keys, marker, negativeColor,
 *  nullColor,
 *            nullInteraction, onPoint, point, pointDescriptionFormatter,
 *  selected, shadow,
 *            showCheckbox, stickyTracking, tooltip, type
 *
 * @product highmaps
 */
interface TiledWebMapSeriesOptions extends MapSeriesOptions {

    /**
     * Provider options for the series.
     *
     * @sample maps/series-tiledwebmap/human-anatomy
     *         Human Anatomy Explorer - Custom TiledWebMap Provider
     *
     * @since 11.1.0
     *
     * @product highmaps
     */
    provider?: ProviderOptions;

    states?: SeriesStatesOptions<TiledWebMapSeriesOptions>;

}

/**
 * @optionparent plotOptions.tiledwebmap.provider
 */
interface ProviderOptions {

    /**
     * API key for providers that require using one.
     *
     * @since 11.1.0
     *
     * @product highmaps
     */
    apiKey?: string;

    onload?: Function

    /**
     * Subdomain required by each provider. Check the [providers
     *  documentation](https://www.highcharts.com/docs/maps/tiledwebmap)
     * for available subdomains.
     *
     * @sample maps/series-tiledwebmap/basic-configuration
     *         Basic configuration for TiledWebMap
     *
     * @since 11.1.0
     *
     * @product highmaps
     */
    subdomain?: string;

    /**
     * Set a tiles theme. Check the [providers
     *  documentation](https://www.highcharts.com/docs/maps/tiledwebmap)
     * for official list of available themes.
     *
     * @sample maps/series-tiledwebmap/europe-timezones
     *         Imagery basemap for Europe
     *
     * @sample maps/series-tiledwebmap/hiking-trail
     *         Topo basemap and MapLine
     *
     * @since 11.1.0
     *
     * @product highmaps
     */
    theme?: string;

    /**
     * Provider type to pull data (tiles) from.
     *
     * @sample maps/series-tiledwebmap/basic-configuration
     *         Basic configuration for TiledWebMap
     *
     * @since 11.1.0
     *
     * @product highmaps
     */
    type?: TilesProviderRegistryName;

    /**
     * Custom URL for providers not specified in [providers type](#series.
     * tiledwebmap.provider.type). Available variables to use in URL are: `{x}`,
     * `{y}`, `{z}` or `{zoom}`. Remember to always specify a projection, when
     * using a custom URL.
     *
     * @sample maps/series-tiledwebmap/custom-url
     *         Custom URL with projection in TiledWebMap configuration
     *
     * @since 11.1.0
     *
     * @product highmaps
     */
    url?: string;

}

/* *
 *
 *  Default Export
 *
 * */

export default TiledWebMapSeriesOptions;
