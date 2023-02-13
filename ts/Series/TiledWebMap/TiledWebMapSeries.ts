/* *
 *
 *  (c) 2010-2022
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *  Imports
 *
 * */

import TiledWebMapSeriesOptions from './TiledWebMapSeriesOptions.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import type PositionObject from '../../Core/Renderer/PositionObject';
import TilesProvidersRegistry from '../../Maps/TilesProviders/TilesProvidersRegistry.js';
import SVGElement from '../../Core/Renderer/SVG/SVGElement.js';
import Chart from '../../Core/Chart/Chart.js';

const {
    seriesTypes: {
        map: MapSeries
    }
} = SeriesRegistry;

import U from '../../Core/Utilities.js';

const {
    addEvent,
    defined,
    extend,
    error,
    merge,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesStateHoverOptions {

    }
}

interface TileItem extends SVGElement {
    posX?: number,
    posY?: number,
    originalURL?: string,
    isActive?: boolean
}

/**
 * The series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.tiledwebmap
 *
 * @augments Highcharts.Series
 */
class TiledWebMapSeries extends MapSeries {

    /* *
     *
     * Static properties
     *
     * */

    /**
     * A tiledwebmap series allows user to display dynamically joined individual
     * images (tiles) and join them together to create a map.
     *
     * @sample maps/demo/tiledwebmap/
     *         OpenStreetMap demo
     *
     * @extends      plotOptions.map
     * @excluding    affectsMapView, allAreas, allowPointSelect, animation,
     * animationLimit, boostBlending, boostThreshold, borderColor, borderWidth,
     * clip, color, colorAxis, colorByPoint, colorIndex, colorKey, colors,
     * cursor, dashStyle, dataLabels, dataParser, dataURL, dragDrop,
     * enableMouseTracking, findNearestPointBy, joinBy, keys, marker,
     * negativeColor, nullColor, nullInteraction, onPoint, point,
     * pointDescriptionFormatter, provider, selected, shadow, showCheckbox,
     * stickyTracking, tooltip, type
     * @product      highmaps
     * @optionparent plotOptions.tiledwebmap
     */

    public static defaultOptions: TiledWebMapSeriesOptions = merge(MapSeries.defaultOptions, {
        states: {
            inactive: {
                enabled: false
            }
        },
        zIndex: -1
    });

    /* *
     *
     * Properties
     *
     * */

    public options: TiledWebMapSeriesOptions = void 0 as any;
    tiles: Record<string, TileItem> = {};
    tilesOffsetX: number = 0;
    tilesOffsetY: number = 0;
    minZoom: number | undefined;
    maxZoom: number | undefined;
    public static TilesProvidersRegistry = TilesProvidersRegistry;

    /**
     *
     *  Functions
     *
     */

    /**
     * Convert map coordinates in longitude/latitude to tile
     *
     * @function Highcharts.MapView#lonLatToTile
     * @since  next
     * @param  {Highcharts.MapLonLatObject} lonLat
     *         The map coordinates
     * @return {Highcharts.PositionObject}
     *         Array of x and y positions of the tile
     */

    public lonLatToTile(
        lonLat: Highcharts.MapLonLatObject,
        zoom: number
    ): PositionObject {
        const { lon, lat } = lonLat,
            xTile = Math.floor(
                (lon + 180) / 360 * Math.pow(2, zoom)
            ),
            yTile = Math.floor(
                (
                    1 - Math.log(
                        Math.tan(lat * Math.PI / 180) +
                        1 / Math.cos(lat * Math.PI / 180)
                    ) / Math.PI
                ) /
                2 * Math.pow(2, zoom)
            );
        return { x: xTile, y: yTile };
    }

    /**
     * Convert tile to map coordinates in longitude/latitude
     *
     * @function Highcharts.MapView#tileToLonLat
     * @since  next
     * @param  xTile
     *         Position x of the tile
     * @param  yTile
     *         Position y of the tile
     * @param  zTile
     *         Zoom of the tile
     * @return {Highcharts.MapLonLatObject}
     *         The map coordinates
     */

    public tileToLonLat(
        xTile: number,
        yTile: number,
        zTile: number
    ): Highcharts.MapLonLatObject {
        const lon = xTile / Math.pow(2, zTile) * 360 - 180,
            n = Math.PI - 2 * Math.PI * yTile / Math.pow(2, zTile),
            lat = (
                180 /
                Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
            );
        return { lon, lat };
    }

    public drawPoints(): void {
        const {
                chart
            } = this,
            mapView = chart.mapView;

        if (!this.tiles) {
            this.tiles = {};
        }
        if (!this.transformGroups) {
            this.transformGroups = [];
        }
        if (!mapView) {
            return;
        }

        const {
                tiles,
                transformGroups
            } = this,
            options = this.options,
            provider = options.provider,
            { zoom } = mapView,
            worldSize = 400.979322,
            tileSize = 256;
        let zoomFloor = zoom < 0 ? 0 : Math.floor(zoom),
            maxTile = Math.pow(2, zoomFloor),
            scale = ((tileSize / worldSize) * Math.pow(2, zoom)) /
                ((tileSize / worldSize) * Math.pow(2, zoomFloor)),
            scaledTileSize = scale * 256;

        if (provider && (provider.type || provider.url)) {
            if (provider.type && !provider.url) {
                const ProviderDefinition =
                TiledWebMapSeries.TilesProvidersRegistry[provider.type];

                if (!defined(ProviderDefinition)) {
                    error(
                        'Provider cannot be reached.',
                        false
                    );
                    return;
                }

                const def = new ProviderDefinition(),
                    { initialProjectionName: providerProjection } = def;
                let theme,
                    subdomain = '';

                if (provider.theme && defined(def.themes[provider.theme])) {
                    theme = def.themes[provider.theme];
                } else {
                    // if nothing set take first theme
                    theme = def.themes[Object.keys(def.themes)[0]];
                    error(
                        'Missing option: Tiles provider theme cannot be ' +
                        'reached, using standard provider theme.',
                        false
                    );
                }

                if (
                    provider.subdomain &&
                    def.subdomains &&
                    def.subdomains.indexOf(provider.subdomain) !== -1
                ) {
                    subdomain = provider.subdomain;
                } else if (defined(def.subdomains)) {
                    error(
                        'Missing option: Tiles provider subdomain cannot be ' +
                        'reached, using default provider subdomain.',
                        false
                    );
                    subdomain = pick(def.subdomains && def.subdomains[0], '');
                }

                if (def.requiresApiKey) {
                    if (provider.apiKey) {
                        theme.url =
                            theme.url.replace('{apikey}', provider.apiKey);
                    } else {
                        error(
                            'Missing option: Tiles provider requires API Key ' +
                            'to use tiles, use provider.apiKey to provide ' +
                            'token.',
                            false
                        );
                        theme.url = theme.url.replace('?apikey={apikey}', '');
                    }
                }

                provider.url = theme.url
                    .replace('{s}', subdomain);

                this.minZoom = theme.minZoom;
                this.maxZoom = theme.maxZoom;

                // Add as credits.text, to prevent changing the default mapText
                const creditsText = pick(
                    chart.userOptions.credits && chart.userOptions.credits.text,
                    'Highcharts.com ' + pick(theme.credits, def.defaultCredits)
                );

                if (chart.credits) {
                    chart.credits.update({
                        text: creditsText
                    });
                } else {
                    chart.addCredits({
                        text: creditsText
                    });
                }

                if (
                    mapView.projection.options.name !== providerProjection
                ) {
                    error(
                        'The set projection is different than supported by ' +
                        'provider.',
                        false
                    );
                }
            } else {
                if (!mapView.projection.options.name) {
                    error(
                        'Set the correct map projection supported by custom ' +
                        'provider.',
                        false
                    );
                }
            }

            // if zoom is smaller/higher than supported by provider
            if (this.minZoom && zoomFloor < this.minZoom) {
                zoomFloor = this.minZoom;
                maxTile = Math.pow(2, zoomFloor);
                scale = ((tileSize / worldSize) * Math.pow(2, zoom)) /
                    ((tileSize / worldSize) * Math.pow(2, zoomFloor));
                scaledTileSize = scale * 256;
            } else if (this.maxZoom && zoomFloor > this.maxZoom) {
                zoomFloor = this.maxZoom;
                maxTile = Math.pow(2, zoomFloor);
                scale = ((tileSize / worldSize) * Math.pow(2, zoom)) /
                    ((tileSize / worldSize) * Math.pow(2, zoomFloor));
                scaledTileSize = scale * 256;
            }

            if (mapView.projection && mapView.projection.def) {
                // Always true for tile maps
                mapView.projection.hasCoordinates = true;

                if (!transformGroups[zoomFloor]) {
                    transformGroups[zoomFloor] =
                        chart.renderer.g().add(this.group);
                }

                const replaceVariables = (
                    url: string,
                    x: number,
                    y: number,
                    zoom: number
                ): string => url
                    .replace('{x}', x.toString())
                    .replace('{y}', y.toString())
                    .replace('{zoom}', zoom.toString())
                    .replace('{z}', zoom.toString());

                const addTile = (
                    x: number,
                    y: number,
                    zoom: number,
                    translateX: number,
                    translateY: number
                ): void => {
                    const modX = x % maxTile,
                        modY = y % maxTile,
                        tileX = modX < 0 ? modX + maxTile : modX,
                        tileY = modY < 0 ? modY + maxTile : modY;

                    if (!tiles[`${zoom},${x},${y}`]) {
                        if (provider.url) {
                            const url = replaceVariables(
                                provider.url,
                                tileX,
                                tileY,
                                zoom
                            );

                            tiles[`${zoom},${x},${y}`] = chart.renderer.image(
                                url,
                                (x * scaledTileSize) - translateX,
                                (y * scaledTileSize) - translateY,
                                scaledTileSize,
                                scaledTileSize
                            )
                                .attr({
                                    zIndex: 2
                                })
                                .add(transformGroups[zoomFloor]);

                            tiles[`${zoom},${x},${y}`].posX = x;
                            tiles[`${zoom},${x},${y}`].posY = y;
                            tiles[`${zoom},${x},${y}`].originalURL = url;
                        }
                    }
                    tiles[`${zoom},${x},${y}`].isActive = true;
                };

                // calculate topLeft and bottomRight corners without normalize
                const lambda = pick(
                        (
                            mapView.projection.options.rotation &&
                            mapView.projection.options.rotation[0]
                        ), 0),
                    topLeftUnits = mapView.pixelsToProjectedUnits({
                        x: 0,
                        y: 0
                    }),
                    topLeftArr = mapView.projection.def.inverse(
                        [topLeftUnits.x, topLeftUnits.y]),
                    topLeft = {
                        lon: topLeftArr[0] - lambda,
                        lat: topLeftArr[1]
                    },
                    bottomRightUnits = mapView.pixelsToProjectedUnits({
                        x: chart.plotWidth,
                        y: chart.plotHeight
                    }),
                    bottomRightArr = mapView.projection.def.inverse(
                        [bottomRightUnits.x, bottomRightUnits.y]),
                    bottomRight = {
                        lon: bottomRightArr[0] - lambda,
                        lat: bottomRightArr[1]
                    };

                // do not support vertical looping
                if (
                    topLeft.lat > mapView.projection.maxLatitude ||
                    bottomRight.lat < -1 * mapView.projection.maxLatitude
                ) {
                    topLeft.lat = mapView.projection.maxLatitude;
                    bottomRight.lat = -1 * mapView.projection.maxLatitude;
                }

                const startPos = this.lonLatToTile(topLeft, zoomFloor),
                    endPos = this.lonLatToTile(bottomRight, zoomFloor);


                // calculate group translations based on first loaded tile
                const firstTileLonLat = this.tileToLonLat(
                        startPos.x,
                        startPos.y,
                        zoomFloor
                    ),
                    units = mapView.projection.def.forward([
                        firstTileLonLat.lon + lambda,
                        firstTileLonLat.lat
                    ]),
                    firstTilePx = mapView.projectedUnitsToPixels({
                        x: units[0], y: units[1]
                    }),
                    translateX = (startPos.x * scaledTileSize - firstTilePx.x),
                    translateY = (startPos.y * scaledTileSize - firstTilePx.y);
                this.tilesOffsetX = translateX;
                this.tilesOffsetY = translateY;

                for (let x = startPos.x; x <= endPos.x; x++) {
                    for (let y = startPos.y; y <= endPos.y; y++) {
                        addTile(x, y, zoomFloor, translateX, translateY);
                    }
                }
            }

            const {
                tilesOffsetX,
                tilesOffsetY
            } = this;
            // Destroy old and unused
            Object.keys(tiles).forEach((key): void => {
                if (tiles[key].isActive) {
                    tiles[key].isActive = false;
                    const { posX, posY } = tiles[key];
                    if (defined(posX) && defined(posY)) {
                        tiles[key].attr({
                            x: (posX * scaledTileSize) - tilesOffsetX,
                            y: (posY * scaledTileSize) - tilesOffsetY,
                            width: scaledTileSize,
                            height: scaledTileSize
                        });
                    }
                } else {
                    tiles[key].destroy();
                    delete tiles[key];
                }
            });
        } else {
            error(
                'Provider cannot be reached.',
                false
            );
        }
    }

    public update(): void {
        const series = this,
            { transformGroups } = series,
            chart = this.chart,
            mapView = chart.mapView,
            options = arguments[0],
            { provider } = options;

        if (transformGroups) {
            transformGroups.forEach((group): void => {
                if (Object.keys(group).length !== 0) {
                    group.destroy();
                }
            });
            this.transformGroups = [];
        }

        if (
            mapView &&
            !defined(mapView.options.projection) &&
            provider &&
            provider.type
        ) {
            const ProviderDefinition =
                TiledWebMapSeries.TilesProvidersRegistry[provider.type];

            if (ProviderDefinition) {
                const def = new ProviderDefinition(),
                    { initialProjectionName: providerProjectionName } = def;

                mapView.update({
                    projection: {
                        name: providerProjectionName
                    }
                });
            }
        }

        super.update.apply(series, arguments);
    }
}

addEvent(Chart, 'beforeMapViewInit', function (e: any): boolean {
    const twm: TiledWebMapSeriesOptions =
        (this.options.series || []).filter(
            (s: any): boolean => s.type === 'tiledwebmap')[0],
        { geoBounds } = e;

    if (twm && twm.provider && twm.provider.type && !twm.provider.url) {
        const ProviderDefinition =
            TilesProvidersRegistry[twm.provider.type];

        if (!defined(ProviderDefinition)) {
            error(
                'Provider cannot be reached.',
                false
            );
        } else {
            const def = new ProviderDefinition(),
                { initialProjectionName: providerProjectionName } = def;

            if (this.options.mapView) {
                if (geoBounds) {
                    const { x1, y1, x2, y2 } = geoBounds;
                    this.options.mapView.recommendedMapView = {
                        projection: {
                            name: providerProjectionName,
                            parallels: [y1, y2],
                            rotation: [-(x1 + x2) / 2]
                        }
                    };
                } else {
                    this.options.mapView.recommendedMapView = {
                        projection: {
                            name: providerProjectionName
                        }
                    };
                }
            }

            return false;
        }
    }

    return true;
});

/* *
 *
 *  Prototype properties
 *
 * */

interface TiledWebMapSeries {
    // type: string;
}

/* *
 *
 *  Registry
 *
 * */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        tiledwebmap: typeof TiledWebMapSeries;
    }
}

SeriesRegistry.registerSeriesType('tiledwebmap', TiledWebMapSeries);

/* *
 *
 *  Default export
 *
 * */

export default TiledWebMapSeries;

/* *
 *
 *  API options
 *
 * */

/**
 * A `tiledwebmap` series. The [type](#series.tiledwebmap.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
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
 * @since     next
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
 * @since     next
 * @product   highmaps
 * @apioption plotOptions.tiledwebmap.provider.type
 */

/**
 * Set a tiles theme. Check the providers documentation for official
 * list of available themes.
 *
 * @sample maps/series-tiledwebmap/basic-configuration
 *         Basic configuration for TiledWebMap
 *
 * @type      {string}
 * @since     next
 * @product   highmaps
 * @apioption plotOptions.tiledwebmap.provider.theme
 */

/**
 * Subdomain required by each provider. Check the providers documentation for
 * available subdomains.
 *
 * @sample maps/series-tiledwebmap/basic-configuration
 *         Basic configuration for TiledWebMap
 *
 * @type      {string}
 * @since     next
 * @product   highmaps
 * @apioption plotOptions.tiledwebmap.provider.subdomain
 */

/**
 * API key for providers that require using one.
 *
 * @type      {string}
 * @since     next
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
 * @since     next
 * @product   highmaps
 * @apioption plotOptions.tiledwebmap.provider.url
 */

''; // adds doclets above to transpiled file
