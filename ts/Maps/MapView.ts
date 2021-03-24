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
        type MapBounds = { x1: number; y1: number; x2: number; y2: number };

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
            (bounds.x2 - bounds.x1) / (plotWidth / 256),
            (bounds.y2 - bounds.y1) / (plotHeight / 256)
        );

        this.setView(
            { y: (bounds.y2 + bounds.y1) / 2, x: (bounds.x2 + bounds.x1) / 2 },
            (Math.log(360 / scaleToPlotArea) / Math.log(2)),
            redraw,
            animation
        );
    }

    public getDataBounds(): Highcharts.MapBounds|undefined {
        const bounds: Highcharts.MapBounds = {
            y1: Number.MAX_VALUE,
            x2: -Number.MAX_VALUE,
            y2: -Number.MAX_VALUE,
            x1: Number.MAX_VALUE
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
                bounds.y1 = Math.min(bounds.y1, (s as any).minY);
                bounds.x2 = Math.max(bounds.x2, (s as any).maxX);
                bounds.y2 = Math.max(bounds.y2, (s as any).maxY);
                bounds.x1 = Math.min(bounds.x1, (s as any).minX);
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
