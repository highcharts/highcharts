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

import type TiledwebMapSeriesOptions from './TiledwebMapSeriesOptions';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';

const {
    seriesTypes: {
        map: MapSeries
    }
} = SeriesRegistry;

import U from '../../Core/Utilities.js';

const {
    merge,
    extend
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
class TiledwebMapSeries extends MapSeries {

    /* *
     *
     * Static properties
     *
     * */

    // public static compose = MapBubbleSeries.compose;

    public static defaultOptions: TiledwebMapSeriesOptions = MapSeries.defaultOptions;

    /* *
     *
     * Properties
     *
     * */

    public options: TiledwebMapSeriesOptions = void 0 as any;
    tiles: any;


    /**
     *
     *  Functions
     *
     */

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
        } = this;

        const mapView: any = chart.mapView,
            { zoom } = mapView,
            zoomCeil = Math.ceil(zoom);

        if (!transformGroups[zoomCeil]) {
            transformGroups[zoomCeil] =
            chart.renderer.g().add(this.group);
        }
        const origin = mapView.lonLatToPixels({
            lon: -180,
            lat: 85.0511287798
        });
        transformGroups[zoomCeil].attr({
            translateX: origin.x,
            translateY: origin.y
        });

        const lon2tile = (lon: any, zoom: any): any => Math.floor(
            (lon + 180) / 360 * Math.pow(2, zoom)
        );
        const lat2tile = (lat: any, zoom: any): any => Math.floor(
            (
                1 - Math.log(
                    Math.tan(lat * Math.PI / 180) +
                    1 / Math.cos(lat * Math.PI / 180)
                ) / Math.PI
            ) /
            2 * Math.pow(2, zoom)
        );

        const tile2lon = (x: number, z: number): number =>
            x / Math.pow(2, z) * 360 - 180;
        const tile2lat = (y: number, z: number): number => {
            const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
            return (
                180 /
                Math.PI * Math.atan(
                    0.5 * (Math.exp(n) - Math.exp(-n))
                )
            );
        };

        const topLeft = mapView.pixelsToLonLat({
            x: 0,
            y: 0
        });

        let x = lon2tile(topLeft.lon, zoom) - 1,
            pos;

        while (x++) {

            const lon = tile2lon(x, zoom);
            pos = mapView.lonLatToPixels({
                lon,
                lat: 0
            });

            if (pos.x > chart.plotLeft + chart.plotWidth) {
                break;
            }

            let y: number | boolean = lat2tile(topLeft.lat, zoom) - 1;

            // TO DO: Should allow 0
            while (y++) {

                const lat = tile2lat(y, zoom);
                pos = mapView.lonLatToPixels({
                    lon,
                    lat
                });

                if (
                    !pos ||
                    pos.y > chart.plotTop + chart.plotHeight
                ) {
                    break;
                }

                // OSM
                const src = (
                    `https://a.tile.openstreetmap.org/${zoom}/${x}/${y}.png`
                    // `https://a.tile.opentopomap.org/${zoom}/${tileX}/${tileY}.png`
                );

                // WMS Tile service
                /*
                const topLeft = chart.mapView.lonLatToProjectedUnits({
                        lon,
                        lat
                    }),
                    bottomRight = chart.mapView.lonLatToProjectedUnits({
                        lon: tile2lon(x + 1, zoom),
                        lat: tile2lat(y + 1, zoom)
                    }),
                    bbox = [
                        topLeft.x, bottomRight.y, bottomRight.x, topLeft.y
                    ].map(n => 100000 * n).join(','),
                    src = 'https://opencache.statkart.no/gatekeeper/gk/gk.open?service=WMS&request=GetMap&layers=topo4&styles=&format=image%2Fpng&transparent=false&version=1.0&height=256&width=256&srs=EPSG%3A3857&bbox=' + bbox;
                */

                if (!tiles[`${zoom},${x},${y}`]) {
                    tiles[`${zoom},${x},${y}`] = chart.renderer.image(
                        src,
                        x * 256,
                        y * 256
                    )
                        .attr({
                            zIndex: 2
                        })
                        .add(transformGroups[zoomCeil]);
                }
                tiles[`${zoom},${x},${y}`].isActive = true;
            }
        }

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

interface TiledwebMapSeries {
    // type: string;
}

/* *
 *
 *  Registry
 *
 * */
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        tiledwebmap: typeof TiledwebMapSeries;
    }
}

SeriesRegistry.registerSeriesType('tiledwebmap', TiledwebMapSeries);

/* *
 *
 *  Default export
 *
 * */

export default TiledwebMapSeries;

/* *
 *
 *  API options
 *
 * */

''; // adds doclets above to transpiled file
