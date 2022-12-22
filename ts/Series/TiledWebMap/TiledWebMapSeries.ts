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

const {
    seriesTypes: {
        map: MapSeries
    }
} = SeriesRegistry;

import U from '../../Core/Utilities.js';

const {
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

    // public static compose = MapBubbleSeries.compose;

    public static defaultOptions: TiledWebMapSeriesOptions = merge(MapSeries.defaultOptions, {
        states: {
            inactive: {
                enabled: true
            }
        },
        provider: {
            type: 'OpenStreetMap'
        }
    });

    /* *
     *
     * Properties
     *
     * */

    public options: TiledWebMapSeriesOptions = void 0 as any;
    tiles: any;
    providersData: any = {
        'OpenStreetMap': {
            subdomains: ['a', 'b', 'c'],
            'default': {
                url: 'https://{s}.tile.openstreetmap.org/{zoom}/{x}/{y}.png'
            },
            'bicycle': {
                url: 'http://{s}.tile.thunderforest.com/cycle/{zoom}/{x}/{y}.png'
            }
        },
        'Google': {
            subdomains: [''],
            'default': {
                url: 'https://www.google.com/maps/vt?pb=!1m5!1m4!1i{zoom}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2sen-US!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&token=32965'
            }
        },
        'Carto': {
            subdomains: ['a', 'b', 'c', 'd', 'e'],
            'default': {
                url: 'http://{s}.basemaps.cartocdn.com/light_all/{zoom}/{x}/{y}.png'
            },
            'dark': {
                url: 'http://{s}.basemaps.cartocdn.com/dark_all/{zoom}/{x}/{y}.png'
            }
        },
        'Gaode': {
            subdomains: ['01', '02', '03', '04'],
            'default': {
                url: 'http://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={zoom}'
            },
            'satelite': {
                url: 'http://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={zoom}'
            }
        }
    };

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

        const addTile = (x: number, y: number, zoom: any): void => {
            if (!tiles[`${zoom},${x},${y}`]) {
                const providersData = this.providersData;

                let url: string = providersData['OpenStreetMap']['default'].url,
                    s: string = '';

                if (provider.url) {
                    url = provider.url;
                    s = pick(provider.subdomain, '');
                } else if (provider.type) {
                    const chosenProvider = providersData[provider.type],
                        chosenTheme = pick(provider.theme, 'default');

                    url = chosenProvider[chosenTheme].url;

                    if (
                        provider.subdomain &&
                        chosenProvider.subdomains.inludes(provider.subdomain)
                    ) {
                        error(13); // TO DO add new error if subdomain is wrong
                    } else {
                        s = pick(provider.subdomain,
                            chosenProvider.subdomains[0]);
                    }
                }

                url = url.replace('{x}', x.toString())
                    .replace('{y}', y.toString())
                    .replace('{zoom}', zoom.toString())
                    .replace('{s}', s);

                tiles[`${zoom},${x},${y}`] = chart.renderer.image(
                    url,
                    x * 256,
                    y * 256,
                    void 0,
                    void 0
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
    }
}

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

''; // adds doclets above to transpiled file
