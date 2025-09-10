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

    private extremesUniform?: Float32Array;
    private extremesUniformBuffer?: GPUBuffer;
    private valueExtremesUniform?: Float32Array;
    private valueExtremesUniformBuffer?: GPUBuffer;
    private contourIntervalUniformBuffer?: GPUBuffer;
    private smoothColoringUniformBuffer?: GPUBuffer;
    private showContourLinesUniformBuffer?: GPUBuffer;


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

    public triangulateData(): any {
        const points2d: Float32Array = new Float32Array(this.points.length * 2);

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
            points2d[i * 2 + 1] = point.y && (point.y / yDivider) || 0;
        });

        const result = new Delaunator(points2d);

        return result;
    }

    public get3DData(): any {
        const points3d: Float32Array = new Float32Array(this.points.length * 3);

        this.points.forEach((point, i): void => {
            points3d[i * 3] = point.x;
            points3d[i * 3 + 1] = point.y || 0;
            points3d[i * 3 + 2] = (point as any).value || 0;
        });

        return points3d;
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

        // const ctx = canvas.getContext('2d');
        // if (ctx) {
        //     // === Just to test canvas ===
        //     ctx.fillStyle = 'blue';
        //     ctx.fillRect(0, 0, canvas.width, canvas.height);
        //
        //     this.image = this.chart.renderer.image(
        //         canvas.toDataURL('image/png', 1)
        //     ).attr({
        //         width: this.xAxis.len,
        //         height: this.yAxis.len
        //     }).add(this.group);
        // }

        this.context = canvas.getContext('webgpu');
        this.run();
        // This.context = canvas.getContext('webgpu');
    }


    async run(): Promise<void> {
        const { context } = this;

        if (context) {


            if (!this.adapter) {
                this.adapter = await navigator.gpu.requestAdapter();
            }
            if (!this.device && this.adapter) {
                this.device = await this.adapter.requestDevice();
            }

            const canvasFormat = navigator.gpu.getPreferredCanvasFormat();

            const { device } = this;

            if (device) {
                context.configure({
                    device: device,
                    format: canvasFormat
                });

                const vertices = this.get3DData();
                // Const indices = this.triangulateData().triangles;
                const indices = new Delaunator(new Float64Array([
                    377, 479, 453, 434, 326, 387, 444, 359, 511, 389,
                    586, 429, 470, 315, 622, 493, 627, 367, 570, 314
                ])).triangles;

                const extremesUniform = this.extremesUniform = new Float32Array(
                    this.getWebGPUExtremes()
                );
                const valueExtremesUniform = (
                    this.valueExtremesUniform = new Float32Array(
                        this.getDataExtremes()
                    )
                );


                const vertexBuffer = device.createBuffer({
                    size: vertices.byteLength,
                    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
                });

                const indexBuffer = device.createBuffer({
                    size: indices.byteLength,
                    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
                });

                const extremesUniformBuffer = (
                    this.extremesUniformBuffer = device.createBuffer({
                        size: extremesUniform.byteLength,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    }));

                const valueExtremesUniformBuffer = (
                    this.valueExtremesUniformBuffer = device.createBuffer({
                        size: valueExtremesUniform.byteLength,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    }));

                device.queue.writeBuffer(vertexBuffer, 0, vertices);
                device.queue.writeBuffer(
                    indexBuffer as GPUBuffer,
                    0,
                    indices as GPUAllowSharedBufferSource
                );
                device.queue.writeBuffer(
                    extremesUniformBuffer,
                    0,
                    extremesUniform
                );
                device.queue.writeBuffer(
                    valueExtremesUniformBuffer,
                    0,
                    valueExtremesUniform
                );

                this.setContourIntervalUniform();
                this.setSmoothColoringUniform();
                this.setShowContourLinesUniform();
            }
        }
    }

    /**
     * Set the contour interval uniform according to the series options.
     */
    public setContourIntervalUniform(rerender = false): void {
        if (this.device && this.contourIntervalUniformBuffer) {


            this.device.queue.writeBuffer(
                this.contourIntervalUniformBuffer,
                0,
                new Float32Array([this.getContourInterval()])
            );

            if (rerender) {
                this.render?.();
            }
        }
    }

    /**
     * Set the smooth coloring uniform according to the series options.
     */
    public setSmoothColoringUniform(rerender = false): void {
        if (this.device && this.smoothColoringUniformBuffer) {
            this.device.queue.writeBuffer(
                this.smoothColoringUniformBuffer,
                0,
                new Float32Array([this.getSmoothColoring()])
            );

            if (rerender) {
                this.render?.();
            }
        }
    }

    /**
     * Set the show contour lines uniform according to the series options.
     */
    public setShowContourLinesUniform(rerender = false): void {
        if (this.device && this.showContourLinesUniformBuffer) {
            this.device.queue.writeBuffer(
                this.showContourLinesUniformBuffer,
                0,
                new Float32Array([this.getShowContourLines()])
            );

            if (rerender) {
                this.render?.();
            }
        }
    }

    private getContourInterval(): number {
        const options = this.options as any;
        const interval = options.contourInterval;

        if (isNaN(interval) || interval <= 0) {
            return -1;
        }

        return interval;
    }

    private getSmoothColoring(): number {
        const options = this.options as any;
        return options.smoothColoring ? 1 : 0;
    }

    private getShowContourLines(): number {
        const options = this.options as any;
        return options.showContourLines ? 1 : 0;
    }

    // Place-holder
    private getWebGPUExtremes(): number[] {
        const { xAxis, yAxis } = this;

        return [
            xAxis.toValue(0, true), // XMin
            xAxis.toValue(xAxis.len, true), // XMax
            yAxis.toValue(yAxis.len, true), // YMin
            yAxis.toValue(0, true) // YMax
        ];
    }
    private getDataExtremes(): number[] {
        const series = this;

        let min = series.valueMin;
        if (isNaN(min || NaN)) {
            min = series.colorAxis?.min;

            if (isNaN(min || NaN)) {
                min = Math.min(...series.points.map(
                    (point): number => (point as any)?.value || 0
                )
                );
            }
        }

        let max = series.valueMax;
        if (isNaN(max || NaN)) {
            max = series.colorAxis?.max;

            if (isNaN(max || NaN)) {
                max = Math.max(...series.points.map(
                    (point): number => (point as any)?.value || 0
                )
                );
            }
        }

        return [min || 0, max || 0];
    }
    private colorToArray(color: string): [number, number, number] {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;

        return [r, g, b];
    }
    private getColorAxisStopsData() : { array: Float32Array, length: number } {
        // Const colorAxis = this.colorAxis;

        // If (!colorAxis) {
        return {
            array: new Float32Array([
                0, 0, 0, 0,
                1, 1, 1, 1
            ]),
            length: 2
        };
        // }

        // const flattenedData = new Float32Array(colorAxis.stops.map(stop => [
        //     stop[0],
        //     ...this.colorToArray(stop[1] as string)
        // ]).flat());
        //
        // return {
        //     array: flattenedData,
        //     length: colorAxis.stops.length
        // };

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
