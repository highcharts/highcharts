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

import type {
    AnimationOptions,
    AnimationStepCallbackFunction
} from '../../Core/Animation/AnimationOptions';
import TiledWebMapSeriesOptions from './TiledWebMapSeriesOptions.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import type PositionObject from '../../Core/Renderer/PositionObject';
import TilesProvidersRegistry from '../../Maps/TilesProviders/TilesProvidersRegistry.js';
import MapView from '../../Maps/MapView.js';

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
     * @product      highmaps
     * @optionparent plotOptions.tiledwebmap
     */

    public static defaultOptions: TiledWebMapSeriesOptions = merge(MapSeries.defaultOptions, {
        states: {
            inactive: {
                enabled: true
            }
        }
    });

    /* *
     *
     * Properties
     *
     * */

    public options: TiledWebMapSeriesOptions = void 0 as any;
    tiles: any;
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

    public drawPoints(): any {
        if (!this.tiles) {
            this.tiles = {};
        }
        if (!this.transformGroups) {
            this.transformGroups = [];
        }
        if (!this.chart.mapView) {
            return;
        }

        const {
                chart,
                tiles,
                transformGroups
            } = this,
            options = this.options,
            provider = options.provider,
            mapView: any = chart.mapView,
            { zoom } = mapView,
            zoomFloor = zoom < 0 ? 0 : Math.floor(zoom),
            maxTile = Math.pow(2, zoomFloor),
            worldSize = 400.979322,
            tileSize = 256,
            scale = ((tileSize / worldSize) * Math.pow(2, zoom)) /
                ((tileSize / worldSize) * Math.pow(2, zoomFloor)),
            scaledTileSize = scale * 256;

        if (provider && (provider.type || provider.url)) {
            if (provider.type) {
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
                    providerProjection = def.getProjectionName();

                // Add as credits.text, to prevent changing the default mapText
                const creditsText = pick(
                    (chart.userOptions.credits as any).text,
                    'Highcharts.com ' + def.getCredits(provider.theme)
                );

                chart.addCredits({
                    text: creditsText
                });

                provider.url = def.getURL(
                    provider.subdomain,
                    provider.theme,
                    provider.apiKey
                );

                if (
                    mapView.projection.options.name !== providerProjection
                ) {
                    error(
                        'The set projection is different than supported by ' +
                        'provider.',
                        false
                    );
                }
            }

            if (mapView.projection) {
                // Always true for tile maps
                mapView.projection.hasCoordinates = true;
            }

            if (!transformGroups[zoomFloor]) {
                transformGroups[zoomFloor] = chart.renderer.g().add(this.group);
            }
            const origin = mapView.lonLatToPixels({
                lon: -180,
                lat: 85.0511287798
            });
            transformGroups[zoomFloor].attr({
                translateX: origin.x,
                translateY: origin.y
            });

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

            const addTile = (x: number, y: number, zoom: number): void => {
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
                            x * scaledTileSize,
                            y * scaledTileSize,
                            scaledTileSize,
                            scaledTileSize
                        )
                            .attr({
                                zIndex: 2
                            })
                            .on('load', function (this: SVGElement): void {
                                if (provider.onload) {
                                    provider.onload.apply(this);
                                }
                            })
                            .add(transformGroups[zoomFloor]);

                        tiles[`${zoom},${x},${y}`].originalURL = url;
                        tiles[`${zoom},${x},${y}`].posX = x;
                        tiles[`${zoom},${x},${y}`].posY = y;
                    }
                }
                tiles[`${zoom},${x},${y}`].isActive = true;
            };

            const topLeft = mapView.pixelsToLonLat({
                    x: 0,
                    y: 0
                }),
                bottomRight = mapView.pixelsToLonLat({
                    x: chart.plotWidth,
                    y: chart.plotHeight
                });

            // increase range when plotbox is bigger than mappbox
            // and for support for rotation and center
            // e.g. rotation: [100], center: [100, 0] and negatives
            if (
                topLeft.lon > bottomRight.lon ||
                Math.abs(topLeft.lon - bottomRight.lon) < 180
            ) {
                topLeft.lon -= 360;
                bottomRight.lon += 360;
            }

            // support for rotation - looping tiles for Lambda
            if (
                mapView &&
                defined(mapView.projection.options.rotation) &&
                (mapView.projection.options.rotation[0] > 360 ||
                mapView.projection.options.rotation[0] < 0)
            ) {
                let count = mapView.projection.options.rotation[0] / 360;

                if (
                    mapView.projection.options.rotation[0] > 360 &&
                    count % 1 === 0
                ) {
                    count--;
                }

                topLeft.lon += Math.floor(count) * 360;
                bottomRight.lon += Math.floor(count) * 360;
            }

            // do not support vertical looping
            if (
                topLeft.lat > mapView.projection.maxLatitude ||
                bottomRight.lat < -1 * mapView.projection.maxLatitude
            ) {
                topLeft.lat = topLeft.lat % mapView.projection.maxLatitude;
                bottomRight.lat =
                    bottomRight.lat % mapView.projection.maxLatitude;
            }

            const startPos = this.lonLatToTile(topLeft, zoomFloor),
                endPos = this.lonLatToTile(bottomRight, zoomFloor);

            for (let x = startPos.x; x <= endPos.x; x++) {
                for (let y = startPos.y; y <= endPos.y; y++) {
                    addTile(x, y, zoomFloor);
                }
            }

            // Destroy old and unused
            Object.keys(tiles).forEach((key): any => {
                if (tiles[key].isActive) {
                    tiles[key].isActive = false;
                    const { posX, posY } = tiles[key];
                    tiles[key].attr({
                        x: posX * scaledTileSize,
                        y: posY * scaledTileSize,
                        width: scaledTileSize,
                        height: scaledTileSize
                    });
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

    public update(): any {
        const series = this,
            chart = this.chart,
            mapView = chart.mapView,
            provider = series.options.provider;

        super.update.apply(series, arguments);

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
                    providerProjectionName = def.getProjectionName();

                mapView.update({
                    projection: {
                        name: providerProjectionName
                    }
                });
            }
        }
    }
}

addEvent(MapView, 'beforeMapViewInit', function (e: any): boolean {
    const twm: TiledWebMapSeriesOptions =
        (e.seriesOptions || []).filter(
            (s: any): boolean => s.type === 'tiledwebmap')[0];

    if (twm && twm.provider && twm.provider.type) {
        const ProviderDefinition =
            TilesProvidersRegistry[twm.provider.type],
            def = new ProviderDefinition(),
            providerProjectionName: string = def.getProjectionName();

        this.recommendedProjection = {
            name: providerProjectionName
        };
        return false;
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
 * @excluding dataParser, dataURL, marker
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
 * @type      {string}
 * @since     next
 * @product   highmaps
 * @apioption plotOptions.tiledwebmap.provider.type
 */

/**
 * Set a tiles theme. Check the providers documentation for official
 * list of available themes.
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
 * `{y}`, `{z}` or `{zoom}`.
 *
 * @type      {string}
 * @since     next
 * @product   highmaps
 * @apioption plotOptions.tiledwebmap.provider.url
 */

''; // adds doclets above to transpiled file
