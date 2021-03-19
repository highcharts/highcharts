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
import U from '../Core/Utilities.js';
const {
    isNumber
} = U;


/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type LatLng = [number, number];
        type MapBounds = { n: number; e: number; s: number; w: number };

    }
}
declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        mapView?: MapView;
    }
}

class MapView {

    public constructor(
        chart: Chart
    ) {
        this.chart = chart;
        this.center = [0, 0];
        this.zoom = 0;
    }
    public center: Highcharts.LatLng;
    public minZoom?: number;
    public zoom: number;

    private chart: Chart;

    public fitToBounds(
        bounds: Highcharts.MapBounds,
        redraw = true,
        animation?: boolean|Partial<AnimationOptionsObject>
    ): void {

        const { plotWidth, plotHeight } = this.chart;
        // 256 is the magic number where a world tile is rendered to a 256/256
        // px square.
        const scaleToPlotArea = Math.max(
            (bounds.e - bounds.w) / (plotWidth / 256),
            (bounds.s - bounds.n) / (plotHeight / 256)
        );

        this.setView(
            [(bounds.s + bounds.n) / 2, (bounds.e + bounds.w) / 2],
            (Math.log(360 / scaleToPlotArea) / Math.log(2)),
            redraw,
            animation
        );
    }

    public getDataBounds(): Highcharts.MapBounds|undefined {
        const bounds: Highcharts.MapBounds = {
            n: Number.MAX_VALUE,
            e: -Number.MAX_VALUE,
            s: -Number.MAX_VALUE,
            w: Number.MAX_VALUE
        };
        let hasBounds = false;
        this.chart.series.forEach((s): void => {
            if (
                (s as any).useMapGeometry &&
                isNumber((s as any).minY) &&
                isNumber((s as any).maxX) &&
                isNumber((s as any).maxY) &&
                isNumber((s as any).minX)
            ) {
                bounds.n = Math.min(bounds.n, (s as any).minY);
                bounds.e = Math.max(bounds.e, (s as any).maxX);
                bounds.s = Math.max(bounds.s, (s as any).maxY);
                bounds.w = Math.min(bounds.w, (s as any).minX);
                hasBounds = true;
            }
        });
        return hasBounds ? bounds : void 0;
    }

    public redraw(animation?: boolean|Partial<AnimationOptionsObject>): void {
        this.chart.series.forEach((s): void => {
            if ((s as any).useMapGeometry) {
                s.isDirty = true;
            }
        });

        this.chart.redraw(animation);
    }

    public setView(
        center?: Highcharts.LatLng,
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
        const bounds = this.getDataBounds();
        if (bounds) {
            const cntr = this.center;
            const { plotWidth, plotHeight } = this.chart;
            const scale = (256 / 360) * Math.pow(2, this.zoom);
            const nw = this.toPixels([bounds.n, bounds.w]);
            const se = this.toPixels([bounds.s, bounds.e]);

            // Off west
            if (nw.x < 0 && se.x < plotWidth) {
                // Adjust eastwards
                cntr[1] += Math.max(nw.x, se.x - plotWidth) / scale;
            }
            // Off east
            if (se.x > plotWidth && nw.x > 0) {
                // Adjust westwards
                cntr[1] += Math.min(se.x - plotWidth, nw.x) / scale;
            }
            // Off north
            if (nw.y < 0 && se.y < plotHeight) {
                // Adjust southwards
                cntr[0] += Math.max(nw.y, se.y - plotHeight) / scale;
            }
            // Off south
            if (se.y > plotHeight && nw.y > 0) {
                // Adjust northwards
                cntr[0] += Math.min(se.y - plotHeight, nw.y) / scale;
            }
        }

        if (redraw) {
            this.redraw(animation);
        }
    }

    public toPixels(pos: Highcharts.LatLng): PositionObject {
        const [lat, lng] = pos;
        const scale = (256 / 360) * Math.pow(2, this.zoom);
        const centerPxX = this.chart.plotWidth / 2;
        const centerPxY = this.chart.plotHeight / 2;
        const x = centerPxX - scale * (this.center[1] - lng);
        const y = centerPxY - scale * (this.center[0] - lat);
        return { x, y };
    }

    public toValues(pos: PositionObject): Highcharts.LatLng {
        const { x, y } = pos;
        const scale = (256 / 360) * Math.pow(2, this.zoom);
        const centerPxX = this.chart.plotWidth / 2;
        const centerPxY = this.chart.plotHeight / 2;

        const lng = this.center[1] - ((centerPxX - x) / scale);
        const lat = this.center[0] - ((centerPxY - y) / scale);
        return [lat, lng];
    }

    public zoomBy(
        howMuch?: number,
        coords?: Highcharts.LatLng,
        chartCoords?: [number, number]
    ): void {
        const chart = this.chart;
        let [lat, lng] = coords || [];

        if (typeof howMuch === 'number') {
            const zoom = this.zoom + howMuch;

            let center: Highcharts.LatLng|undefined;

            // Keep chartX and chartY stationary - convert to lat and lng
            if (chartCoords) {
                const [chartX, chartY] = chartCoords;
                const transA = (256 / 360) * Math.pow(2, this.zoom);

                const offsetX = chartX - chart.plotLeft - chart.plotWidth / 2;
                const offsetY = chartY - chart.plotTop - chart.plotHeight / 2;
                lat = this.center[0] + offsetY / transA;
                lng = this.center[1] + offsetX / transA;
            }

            // Keep lat and lng stationary by adjusting the center
            if (typeof lat === 'number' && typeof lng === 'number') {
                const scale = 1 - Math.pow(2, this.zoom) / Math.pow(2, zoom);

                center = this.center;
                const offsetLat = center[0] - lat;
                const offsetLng = center[1] - lng;

                center[0] -= offsetLat * scale;
                center[1] -= offsetLng * scale;
            }

            this.setView(center, zoom);

        // Undefined howMuch => reset zoom
        } else {
            const bounds = this.getDataBounds();
            if (bounds) {
                this.fitToBounds(bounds);
            }
        }

    }
}
export default MapView;
