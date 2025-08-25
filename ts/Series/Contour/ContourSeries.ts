/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        scatter: ScatterSeries
    }
} = SeriesRegistry;
import Delaunator from '../../Core/Delauney';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';


class ContourSeries extends ScatterSeries {
    public canvas?: HTMLCanvasElement;
    public context?: GPUCanvasContext | null;
    public adapter?: GPUAdapter | null;
    public device?: GPUDevice;
    public image?: SVGElement;
    // Dummy func for test for now
    public d(): boolean {
        const coords = new Delaunator(new Float64Array([
            377, 479, 453, 434, 326, 387, 444, 359, 511, 389,
            586, 429, 470, 315, 622, 493, 627, 367, 570, 314
        ])).triangles;
        const tris = [
            4, 3, 1, 4, 6, 3, 1, 5, 4, 4, 9, 6, 2, 0, 1, 1, 7, 5,
            5, 9, 4, 6, 2, 3, 3, 2, 1, 5, 8, 9, 0, 7, 1, 5, 7, 8
        ];

        for (let i = 0; i < coords.length; i++) {
            if (tris[i] !== coords[i]) {
                return false;
            }
        }
        return true;
    }

    public drawPoints(): void {
        /*
        Const points2d: Float32Array = new Float32Array(this.points.length * 2);
        const { xAxis, yAxis } = this;
        const extremes = [
            xAxis.toValue(0, true), // XMin
            xAxis.toValue(xAxis.len, true), // XMax
            yAxis.toValue(yAxis.len, true), // YMin
            yAxis.toValue(0, true) // YMax
        ];
        let xDivider = 1,
            yDivider = 1;
        if (Math.abs(extremes[0]) > 10e6) {
            xDivider = 10e6;
        }
        if (Math.abs(extremes[2]) > 10e6) {
            yDivider = 10e6;
        }

        this.points.forEach((point, i): void => {
            points2d[i * 2] = point.x / xDivider;
            points2d[i * 2 + 1] = (point?.y || 0) / yDivider;
        });

        const result = new Delaunator(points2d);
        console.log(result);


        */
        const series = this;
        const canvas = series.canvas = document.createElement('canvas');
        canvas.classList.add('contourmap-canvas');
        // Series.chart.container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'blue';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.image = this.chart.renderer.image(
                canvas.toDataURL('image/png', 1)
            ).attr({ width: 480, height: 320 }).add(this.group);

        }

        // This.context = canvas.getContext('webgpu');
    }
}

/* *
    *  *
    *   *  Registry
*    *
    *     * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        contour: typeof ContourSeries;
    }
}
SeriesRegistry.registerSeriesType('contour', ContourSeries);
