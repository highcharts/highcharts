/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';

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
class MapView {

    public constructor(
        chart: Chart
    ) {
        this.chart = chart;
        this.center = [0, 0];
        this.zoom = 0;
    }
    public center: Highcharts.LatLng;
    public zoom: number;

    private chart: Chart;

    public fitToBounds(bounds: Highcharts.MapBounds): void {

        const { plotWidth, plotHeight } = this.chart;
        // 256 is the magic number where a world tile is rendered to a 256/256
        // px square.
        const scaleToPlotArea = Math.max(
            (bounds.e - bounds.w) / (plotWidth / 256),
            (bounds.s - bounds.n) / (plotHeight / 256)
        );

        this.center = [(bounds.s + bounds.n) / 2, (bounds.e + bounds.w) / 2];
        this.zoom = (Math.log(360 / scaleToPlotArea) / Math.log(2));
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
            if ((s as any).useMapGeometry) {
                bounds.n = Math.min(bounds.n, (s as any).minY);
                bounds.e = Math.max(bounds.e, (s as any).maxX);
                bounds.s = Math.max(bounds.s, (s as any).maxY);
                bounds.w = Math.min(bounds.w, (s as any).minX);
                hasBounds = true;
            }
        });
        return hasBounds ? bounds : void 0;
    }

    public redraw(): void {
        this.chart.series.forEach((s): void => {
            if ((s as any).useMapGeometry) {
                s.isDirty = true;
            }
        });

        this.chart.redraw();
    }

    public setView(
        center?: Highcharts.LatLng,
        zoom?: number
    ): void {
        if (center) {
            this.center = center;
        }
        if (typeof zoom === 'number') {
            this.zoom = zoom;
        }
        this.redraw();
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
                this.redraw();
            }
        }

    }
}
export default MapView;
