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
            zoomCeil = Math.ceil(zoom);

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

            if (!transformGroups[zoomCeil]) {
                transformGroups[zoomCeil] = chart.renderer.g().add(this.group);
            }
            const origin = mapView.lonLatToPixels({
                lon: -180,
                lat: 85.0511287798
            });
            transformGroups[zoomCeil].attr({
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
                if (!tiles[`${zoom},${x},${y}`]) {
                    if (provider.url) {
                        const url = replaceVariables(
                            provider.url,
                            x,
                            y,
                            zoom
                        );

                        tiles[`${zoom},${x},${y}`] = chart.renderer.image(
                            url,
                            x * 256,
                            y * 256
                        )
                            .attr({
                                zIndex: 2
                            })
                            .on('load', function (this: SVGElement): void {
                                if (provider.onload) {
                                    provider.onload.apply(this);
                                }
                            })
                            .add(transformGroups[zoomCeil]);

                        tiles[`${zoom},${x},${y}`].originalURL = url;
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

            const startPos = this.lonLatToTile(topLeft, zoom),
                endPos = this.lonLatToTile(bottomRight, zoom);

            for (let x = startPos.x; x <= endPos.x; x++) {
                for (let y = startPos.y; y <= endPos.y; y++) {
                    addTile(x, y, zoom);
                }
            }

            // Destroy old and unused
            Object.keys(tiles).forEach((key): any => {
                if (tiles[key].isActive) {
                    tiles[key].isActive = false;
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
