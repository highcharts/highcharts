/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import type PositionObject from '../Core/Renderer/PositionObject';

import AnimationOptionsObject from '../Core/Animation/AnimationOptions';
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
const {
    win
} = H;
import U from '../Core/Utilities.js';
const {
    isNumber,
    merge
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type ProjectedXY = { x: number; y: number };
        type MapBounds = {
            midX?: number;
            midY?: number;
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        };

        interface MapViewOptions {
            center: ProjectedXY; // @todo: LatLon object
            zoom: number;
            projection?: MapViewProjectionOptions;
        }

        interface MapViewProjectionOptions {
            crs?: string;
        }

        interface Options {
            mapView?: DeepPartial<MapViewOptions>;
        }

    }
}

class MapView {

    /* *
     * Return the composite bounding box of a collection of bounding boxes
     */
    public static compositeBounds = (
        arrayOfBounds: Highcharts.MapBounds[]
    ): Highcharts.MapBounds|undefined => {
        if (arrayOfBounds.length) {
            return arrayOfBounds
                .slice(1)
                .reduce((acc, cur): Highcharts.MapBounds => {
                    acc.x1 = Math.min(acc.x1, cur.x1);
                    acc.y1 = Math.min(acc.y1, cur.y1);
                    acc.x2 = Math.max(acc.x2, cur.x2);
                    acc.y2 = Math.max(acc.y2, cur.y2);
                    return acc;
                }, merge(arrayOfBounds[0]));
        }
        return;
    };

    /**
     * The world size equals meters in the Web Mercator projection, to match a
     * 256 square tile to zoom level 0
     */
    public static worldSize = 40097932.2;

    public static tileSize = 256;

    public constructor(
        chart: Chart,
        userOptions?: DeepPartial<Highcharts.MapViewOptions>
    ) {
        const options = merge(true, {
            center: { x: 0, y: 0 },
            zoom: 0
        }, userOptions);

        this.chart = chart;
        this.center = options.center;
        this.options = options;
        this.userOptions = userOptions || {};
        this.zoom = options.zoom;

        const proj = this.chart.options.chart.proj4 || win.proj4;
        if (proj && options.projection && options.projection.crs) {
            this.projection = proj(options.projection.crs);
        }
    }

    public center: Highcharts.ProjectedXY;
    public enabled?: boolean;
    public minZoom?: number;
    public options: Highcharts.MapViewOptions;
    public projection?: any;
    public userOptions: DeepPartial<Highcharts.MapViewOptions>;
    public zoom: number;

    private chart: Chart;

    public fitToBounds(
        bounds: Highcharts.MapBounds,
        redraw = true,
        animation?: boolean|Partial<AnimationOptionsObject>
    ): void {

        const { tileSize, worldSize } = MapView;
        const { plotWidth, plotHeight } = this.chart;

        const scaleToPlotArea = Math.max(
            (bounds.x2 - bounds.x1) / (plotWidth / tileSize),
            (bounds.y2 - bounds.y1) / (plotHeight / tileSize)
        );

        this.setView(
            { y: (bounds.y2 + bounds.y1) / 2, x: (bounds.x2 + bounds.x1) / 2 },
            (Math.log(worldSize / scaleToPlotArea) / Math.log(2)),
            redraw,
            animation
        );
    }

    public getProjectedBounds(): Highcharts.MapBounds|undefined {
        const allBounds = this.chart.series.reduce(
            (acc, s): Highcharts.MapBounds[] => {
                const bounds = s.getProjectedBounds && s.getProjectedBounds();
                if (bounds) {
                    acc.push(bounds);
                }
                return acc;
            },
            [] as Highcharts.MapBounds[]
        );
        return MapView.compositeBounds(allBounds);
    }

    public redraw(animation?: boolean|Partial<AnimationOptionsObject>): void {
        this.chart.series.forEach((s): void => {
            if (s.useMapGeometry) {
                s.isDirty = true;
            }
        });

        this.chart.redraw(animation);
    }

    public setView(
        center?: Highcharts.ProjectedXY,
        zoom?: number,
        redraw = true,
        animation?: boolean|Partial<AnimationOptionsObject>
    ): void {
        if (center) {
            this.center = center;
        }
        if (typeof zoom === 'number') {
            if (typeof this.minZoom === 'number') {
                zoom = Math.max(zoom, this.minZoom);
            }
            this.zoom = zoom;
        }

        // Stay within the data bounds
        const bounds = this.getProjectedBounds();
        if (bounds) {
            const cntr = this.center;
            const { plotWidth, plotHeight } = this.chart;
            const scale = (MapView.tileSize / MapView.worldSize) *
                Math.pow(2, this.zoom);
            const topLeft = this.toPixels({ y: bounds.y1, x: bounds.x1 });
            const bottomRight = this.toPixels({ y: bounds.y2, x: bounds.x2 });

            // Off west
            if (topLeft.x < 0 && bottomRight.x < plotWidth) {
                // Adjust eastwards
                cntr.x += Math.max(topLeft.x, bottomRight.x - plotWidth) / scale;
            }
            // Off east
            if (bottomRight.x > plotWidth && topLeft.x > 0) {
                // Adjust westwards
                cntr.x += Math.min(bottomRight.x - plotWidth, topLeft.x) / scale;
            }
            // Off north
            if (topLeft.y < 0 && bottomRight.y < plotHeight) {
                // Adjust southwards
                cntr.y += Math.max(topLeft.y, bottomRight.y - plotHeight) / scale;
            }
            // Off south
            if (bottomRight.y > plotHeight && topLeft.y > 0) {
                // Adjust northwards
                cntr.y += Math.min(bottomRight.y - plotHeight, topLeft.y) / scale;
            }
        }

        if (redraw) {
            this.redraw(animation);
        }
    }

    public toPixels(pos: Highcharts.ProjectedXY): PositionObject {
        const scale = (MapView.tileSize / MapView.worldSize) *
            Math.pow(2, this.zoom);
        const centerPxX = this.chart.plotWidth / 2;
        const centerPxY = this.chart.plotHeight / 2;
        const x = centerPxX - scale * (this.center.x - pos.x);
        const y = centerPxY - scale * (this.center.y - pos.y);
        return { x, y };
    }

    public toValues(pos: PositionObject): Highcharts.ProjectedXY {
        const { x, y } = pos;
        const scale = (MapView.tileSize / MapView.worldSize) *
            Math.pow(2, this.zoom);
        const centerPxX = this.chart.plotWidth / 2;
        const centerPxY = this.chart.plotHeight / 2;

        const projectedY = this.center.x - ((centerPxX - x) / scale);
        const projectedX = this.center.y - ((centerPxY - y) / scale);
        return { y: projectedY, x: projectedX };
    }

    public update(
        userOptions: DeepPartial<Highcharts.MapViewOptions>,
        redraw: boolean = true
    ): void {
        const isDirtyProjection =
            (userOptions.projection && userOptions.projection.crs) !==
            (this.options.projection && this.options.projection.crs);
        merge(true, this.userOptions, userOptions);
        merge(true, this.options, userOptions);

        if (isDirtyProjection) {
            this.chart.series.forEach((series): void => {
                if (series.clearBounds) {
                    series.clearBounds();
                }
                series.isDirty = true;
                series.isDirtyData = true;
            });

            // @todo: This is repetetive, also happens in constructor
            const proj = this.chart.options.chart.proj4 || win.proj4;
            if (proj) {
                if (this.options.projection && this.options.projection.crs) {
                    this.projection = proj(this.options.projection.crs);
                } else {
                    this.projection = void 0;
                }
            }

            // Fit to bounds if center/zoom are not explicitly given
            if (!userOptions.center && !isNumber(userOptions.zoom)) {
                const bounds = this.getProjectedBounds();
                if (bounds) {
                    this.fitToBounds(bounds);
                }
            }
        }

        if (redraw) {
            this.chart.redraw();
        }

    }

    public zoomBy(
        howMuch?: number,
        coords?: Highcharts.ProjectedXY,
        chartCoords?: [number, number]
    ): void {
        const chart = this.chart;
        let { x, y } = coords || {};

        if (typeof howMuch === 'number') {
            const zoom = this.zoom + howMuch;

            let center: Highcharts.ProjectedXY|undefined;

            // Keep chartX and chartY stationary - convert to lat and lng
            if (chartCoords) {
                const [chartX, chartY] = chartCoords;
                const transA = (MapView.tileSize / MapView.worldSize) *
                    Math.pow(2, this.zoom);

                const offsetX = chartX - chart.plotLeft - chart.plotWidth / 2;
                const offsetY = chartY - chart.plotTop - chart.plotHeight / 2;
                y = this.center.y + offsetY / transA;
                x = this.center.x + offsetX / transA;
            }

            // Keep lat and lng stationary by adjusting the center
            if (typeof x === 'number' && typeof y === 'number') {
                const scale = 1 - Math.pow(2, this.zoom) / Math.pow(2, zoom);

                center = this.center;
                const offsetY = center.y - y;
                const offsetX = center.x - x;

                center.y -= offsetY * scale;
                center.x -= offsetX * scale;
            }

            this.setView(center, zoom);

        // Undefined howMuch => reset zoom
        } else {
            const bounds = this.getProjectedBounds();
            if (bounds) {
                this.fitToBounds(bounds);
            }
        }

    }
}
export default MapView;
