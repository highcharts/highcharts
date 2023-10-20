/* *
 *
 *  (c) 2010-2023 Hubert Kozik, Kamil Musiałowski
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

import type TiledWebMapSeriesOptions from './TiledWebMapSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A tiledwebmap series allows user to display dynamically joined individual
 * images (tiles) and join them together to create a map.
 *
 * @sample maps/series-tiledwebmap/simple-demo-norway
 *         Simple demo of data for Norway on TiledWebMap
 * @sample maps/series-tiledwebmap/only-twm
 *         OpenStreetMap demo
 *
 * @extends      plotOptions.map
 * @excluding    affectsMapView, allAreas, allowPointSelect, animation,
 * animationLimit, boostBlending, boostThreshold, borderColor, borderWidth,
 * clip, color, colorAxis, colorByPoint, colorIndex, colorKey, colors,
 * cursor, dashStyle, dataLabels, dataParser, dataURL, dragDrop,
 * enableMouseTracking, findNearestPointBy, joinBy, keys, marker,
 * negativeColor, nullColor, nullInteraction, onPoint, point,
 * pointDescriptionFormatter, selected, shadow, showCheckbox,
 * sonification, stickyTracking, tooltip, type
 * @product      highmaps
 * @optionparent plotOptions.tiledwebmap
 */
const TiledWebMapSeriesDefaults: TiledWebMapSeriesOptions = {
    states: {
        inactive: {
            enabled: false
        }
    }
};

/* *
 *
 *  API options
 *
 * */

/**
 * A `tiledwebmap` series. The [type](#series.tiledwebmap.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample maps/series-tiledwebmap/simple-demo-norway
 *         Simple demo of data for Norway on TiledWebMap
 * @sample maps/series-tiledwebmap/only-twm
 *         OpenStreetMap demo
 *
 * @extends   series,plotOptions.tiledwebmap
 * @excluding affectsMapView, allAreas, allowPointSelect, animation,
 * animationLimit, boostBlending, boostThreshold, borderColor, borderWidth,
 * clip, color, colorAxis, colorByPoint, colorIndex, colorKey, colors, cursor,
 * dashStyle, dataLabels, dataParser, dataURL, dragDrop, enableMouseTracking,
 * findNearestPointBy, joinBy, keys, marker, negativeColor, nullColor,
 * nullInteraction, onPoint, point, pointDescriptionFormatter, selected, shadow,
 * showCheckbox, stickyTracking, tooltip, type
 * @product   highmaps
 * @apioption series.tiledwebmap
 */

/**
 * Provider options for the series.
 *
 * @sample maps/series-tiledwebmap/human-anatomy
 *         Human Anatomy Explorer - Custom TiledWebMap Provider
 *
 * @since 11.1.0
 * @product   highmaps
 * @apioption plotOptions.tiledwebmap.provider
 */

/**
 * Provider type to pull data (tiles) from.
 *
 * @sample maps/series-tiledwebmap/basic-configuration
 *         Basic configuration for TiledWebMap
 *
 * @type      {string}
 * @since 11.1.0
 * @product   highmaps
 * @apioption plotOptions.tiledwebmap.provider.type
 */

/**
 * Set a tiles theme. Check the [providers documentation](https://www.highcharts.com/docs/maps/tiledwebmap)
 * for official list of available themes.
 *
 * @sample maps/series-tiledwebmap/europe-timezones
 *         Imagery basemap for Europe
 * @sample maps/series-tiledwebmap/hiking-trail
 *         Topo basemap and MapLine
 *
 * @type      {string}
 * @since 11.1.0
 * @product   highmaps
 * @apioption plotOptions.tiledwebmap.provider.theme
 */

/**
 * Subdomain required by each provider. Check the [providers documentation](https://www.highcharts.com/docs/maps/tiledwebmap)
 * for available subdomains.
 *
 * @sample maps/series-tiledwebmap/basic-configuration
 *         Basic configuration for TiledWebMap
 *
 * @type      {string}
 * @since 11.1.0
 * @product   highmaps
 * @apioption plotOptions.tiledwebmap.provider.subdomain
 */

/**
 * API key for providers that require using one.
 *
 * @type      {string}
 * @since 11.1.0
 * @product   highmaps
 * @apioption plotOptions.tiledwebmap.provider.apiKey
 */

/**
 * Custom URL for providers not specified in [providers type](#series.
 * tiledwebmap.provider.type). Available variables to use in URL are: `{x}`,
 * `{y}`, `{z}` or `{zoom}`. Remember to always specify a projection, when
 * using a custom URL.
 *
 * @sample maps/series-tiledwebmap/custom-url
 *         Custom URL with projection in TiledWebMap configuration
 *
 * @type      {string}
 * @since 11.1.0
 * @product   highmaps
 * @apioption plotOptions.tiledwebmap.provider.url
 */

''; // keeps doclets above detached

/* *
 *
 *  Default Export
 *
 * */

export default TiledWebMapSeriesDefaults;
