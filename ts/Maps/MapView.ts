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
            return arrayOfBounds.slice(1).reduce((acc, cur): Highcharts.MapBounds => {
                acc.x1 = Math.min(acc.x1, cur.x1);
                acc.y1 = Math.min(acc.y1, cur.y1);
                acc.x2 = Math.max(acc.x2, cur.x2);
                acc.y2 = Math.max(acc.y2, cur.y2);
                return acc;
            }, merge(arrayOfBounds[0]));
        }
        return;
    };

    public constructor(
        chart: Chart
    ) {
        this.chart = chart;
        this.center = { x: 0, y: 0 };
        this.zoom = 0;

        /*
        const proj = this.chart.options.chart.proj4 || win.proj4;
        if (proj) {
            this.projection = proj(
                // '+proj=mill +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +over'
                '+proj=robin +lon_0=0 +x_0=0 +y_0=0'
                // '+proj=ortho +lat_0=40 +lon_0=10 +x_0=0 +y_0=0'
            );
        }
        */
    }
    public center: Highcharts.ProjectedXY;
    public minZoom?: number;
    public projection?: any;
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
        const allBounds: Highcharts.MapBounds[] = [];

        this.chart.series.forEach((s): void => {
            if (
                (s as any).useMapGeometry &&
                (s as any).bounds
            ) {
                allBounds.push((s as any).bounds);
            }
        });
        return MapView.compositeBounds(allBounds);
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
