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
        type ProjectedXY = { x: number; y: number };
        type MapBounds = { n: number; e: number; s: number; w: number };

    }
}

class MapView {

    public constructor(
        chart: Chart
    ) {
        this.chart = chart;
        this.center = { x: 0, y: 0 };
        this.zoom = 0;
    }
    public center: Highcharts.ProjectedXY;
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
            { y: (bounds.s + bounds.n) / 2, x: (bounds.e + bounds.w) / 2 },
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
        const bounds = this.getDataBounds();
        if (bounds) {
            const cntr = this.center;
            const { plotWidth, plotHeight } = this.chart;
            const scale = (256 / 360) * Math.pow(2, this.zoom);
            const nw = this.toPixels({ y: bounds.n, x: bounds.w });
            const se = this.toPixels({ y: bounds.s, x: bounds.e });

            // Off west
            if (nw.x < 0 && se.x < plotWidth) {
                // Adjust eastwards
                cntr.x += Math.max(nw.x, se.x - plotWidth) / scale;
            }
            // Off east
            if (se.x > plotWidth && nw.x > 0) {
                // Adjust westwards
                cntr.x += Math.min(se.x - plotWidth, nw.x) / scale;
            }
            // Off north
            if (nw.y < 0 && se.y < plotHeight) {
                // Adjust southwards
                cntr.y += Math.max(nw.y, se.y - plotHeight) / scale;
            }
            // Off south
            if (se.y > plotHeight && nw.y > 0) {
                // Adjust northwards
                cntr.y += Math.min(se.y - plotHeight, nw.y) / scale;
            }
        }

        if (redraw) {
            this.redraw(animation);
        }
    }

    public toPixels(pos: Highcharts.ProjectedXY): PositionObject {
        const scale = (256 / 360) * Math.pow(2, this.zoom);
        const centerPxX = this.chart.plotWidth / 2;
        const centerPxY = this.chart.plotHeight / 2;
        const x = centerPxX - scale * (this.center.x - pos.x);
        const y = centerPxY - scale * (this.center.y - pos.y);
        return { x, y };
    }

    public toValues(pos: PositionObject): Highcharts.ProjectedXY {
        const { x, y } = pos;
        const scale = (256 / 360) * Math.pow(2, this.zoom);
        const centerPxX = this.chart.plotWidth / 2;
        const centerPxY = this.chart.plotHeight / 2;

        const projectedY = this.center.x - ((centerPxX - x) / scale);
        const projectedX = this.center.y - ((centerPxY - y) / scale);
        return { y: projectedY, x: projectedX };
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
                const transA = (256 / 360) * Math.pow(2, this.zoom);

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
            const bounds = this.getDataBounds();
            if (bounds) {
                this.fitToBounds(bounds);
            }
        }

    }
}
export default MapView;
