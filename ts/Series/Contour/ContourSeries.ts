/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/// <reference types="@webgpu/types" />
'use strict';


/* *
 *
 *  Imports
 *
 * */

import type Chart from '../../Core/Chart/Chart.js';
import type ContourSeriesOptions from './ContourSeriesOptions';

import Color from '../../Core/Color/Color.js';
import ContourPoint from './ContourPoint.js';
import contourShader from './contourShader.js';
import ContourSeriesDefaults from './ContourSeriesDefaults.js';
import Delaunay from '../../Shared/Delaunay.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';

const {
    seriesTypes: {
        scatter: ScatterSeries
    }
} = SeriesRegistry;
const {
    extend,
    merge
} = U;


/* *
 *
 *  Class
 *
 * */

export default class ContourSeries extends ScatterSeries {

    /* *
     *
     * Static Properties
     *
     * */

    public static defaultOptions = merge(
        ScatterSeries.defaultOptions,
        ContourSeriesDefaults
    );


    /* *
     *
     * Properties
     *
     * */

    public data!: Array<ContourPoint>;

    public points!: Array<ContourPoint>;

    public options!: ContourSeriesOptions;

    public context?: GPUCanvasContext | null;

    public renderFrame?: () => void;

    public dataMax?: number;

    private foreignObject?: SVGForeignObjectElement;

    private canvas?: HTMLCanvasElement;

    private adapter?: GPUAdapter | null;

    private device?: GPUDevice;

    private extremesUniformBuffer?: GPUBuffer;

    private valueExtremesUniformBuffer?: GPUBuffer;

    private contourIntervalUniformBuffer?: GPUBuffer;

    private contourOffsetUniformBuffer?: GPUBuffer;

    private smoothColoringUniformBuffer?: GPUBuffer;

    private showContourLinesUniformBuffer?: GPUBuffer;

    private contourLineColorBuffer?: GPUBuffer;

    private colorAxisStopsUniformBuffer?: GPUBuffer;

    private colorAxisStopsCountUniformBuffer?: GPUBuffer;

    /* Uniforms:
     * - extremesUniform,
     * - valueExtremesUniform,
     * - contourInterval,
     * - contourOffset,
     * - smoothColoring,
     * - showContourLines,
     * - contourLineColor
     * - colorAxisStops
     * - colorAxisStopsCount
     */


    /* *
     *
     * Methods
     *
     * */

    public override init(chart: Chart, options: ContourSeriesOptions): void {
        super.init.apply(this, [chart, options]);

        const props = {
            minPadding: 0,
            maxPadding: 0,
            tickInterval: 1,
            gridLineWidth: 0,
            endOnTick: false,
            startOnTick: false,
            tickWidth: 1
        };

        for (const axis of [this.xAxis, this.yAxis]) {
            for (const [key, val] of Object.entries(props)) {
                if (axis.userOptions[key as keyof typeof props] === void 0) {
                    (axis.options as any)[key] = val;
                }
            }
        }
    }

    public getContourData(): [Uint32Array, Float32Array] {
        const points = this.points,
            len = points.length,
            points3d: Float32Array = new Float32Array(len * 3),
            points2d: Float64Array = new Float64Array(len * 2),
            { xAxis, yAxis } = this,
            xDivider = (Math.abs(xAxis.toValue(0, true)) > 10e6) ?
                10e6 :
                1,
            yDivider = (Math.abs(yAxis.toValue(yAxis.len, true)) > 10e6) ?
                10e6 :
                1;

        let foundMax = 0;

        for (let i = 0; i < len; i++) {
            const { x, y = 0, value } = points[i],
                index2d = i * 2,
                index3d = i * 3;

            if (foundMax < (value ?? 0)) {
                foundMax = value ?? 0;
            }

            points2d[index2d] = x / xDivider;
            points2d[index2d + 1] = y && (y / yDivider) || 0;

            points3d[index3d] = x;
            points3d[index3d + 1] = y;
            points3d[index3d + 2] = value ?? 0;
        }
        this.dataMax = foundMax ?? 0;

        return [new Delaunay(points2d).triangles, points3d];
    }


    public override drawPoints(): void {
        const { group } = this;
        if (!group) {
            return;
        }

        if (!this.canvas) {
            this.foreignObject = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'foreignObject'
            );
            group.element.appendChild(this.foreignObject);
            this.canvas = document.createElement('canvas');
            this.foreignObject.appendChild(this.canvas);
        }

        const { canvas, xAxis, yAxis } = this,
            foreignObject = this.foreignObject!,
            oldWidth = foreignObject.width.baseVal.value,
            oldHeight = foreignObject.height.baseVal.value,
            { devicePixelRatio: dpr } = window;

        let width = xAxis.len,
            height = yAxis.len;

        if (this.chart.inverted) {
            [width, height] = [height, width];
        }

        if (oldWidth !== width) {
            foreignObject.setAttribute('width', width);
            canvas.width = width * dpr;
            canvas.style.width = width + 'px';
        }

        if (oldHeight !== height) {
            foreignObject.setAttribute('height', height);
            canvas.height = height * dpr;
            canvas.style.height = height + 'px';
        }

        if (this.renderFrame) {
            this.renderFrame();
        } else {
            void this.run();
        }
    }


    async run(): Promise<void> {
        const series = this,
            canvas = series.canvas as HTMLCanvasElement,
            context = series.context = (
                canvas.getContext('webgpu')
            );

        if (context) {
            let device = this.device;

            if (!this.adapter) {
                this.adapter = await navigator.gpu.requestAdapter();
            }
            if (!device && this.adapter) {
                device = this.device = await this.adapter.requestDevice();
            }

            const canvasFormat = navigator.gpu.getPreferredCanvasFormat();

            if (device) {
                context.configure({
                    device: device,
                    format: canvasFormat,
                    colorSpace: 'display-p3',
                    alphaMode: 'premultiplied'
                });

                const [indices, vertices] = this.getContourData();

                // WebGPU Buffers
                const vertexBuffer: GPUBuffer = device.createBuffer({
                    size: vertices.byteLength,
                    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
                });

                const indexBuffer = device.createBuffer({
                    size: indices.byteLength,
                    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
                });

                this.extremesUniformBuffer = device.createBuffer({
                    size: Float32Array.BYTES_PER_ELEMENT * 4,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });

                this.valueExtremesUniformBuffer = device.createBuffer({
                    size: Float32Array.BYTES_PER_ELEMENT * 2,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });

                this.contourIntervalUniformBuffer = device.createBuffer({
                    size: 4,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });

                this.contourOffsetUniformBuffer = device.createBuffer({
                    size: 4,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });

                this.smoothColoringUniformBuffer = device.createBuffer({
                    size: 4,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });

                this.showContourLinesUniformBuffer = device.createBuffer({
                    size: 4,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });

                this.contourLineColorBuffer = device.createBuffer({
                    size: 12,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });

                this.colorAxisStopsCountUniformBuffer = device.createBuffer({
                    size: 4,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });

                // Let's assume the color axis has at most 64 stops
                this.colorAxisStopsUniformBuffer = device.createBuffer({
                    size: Float32Array.BYTES_PER_ELEMENT * 64,
                    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
                });

                device.queue.writeBuffer(
                    vertexBuffer,
                    0,
                    vertices as GPUAllowSharedBufferSource
                );
                device.queue.writeBuffer(
                    indexBuffer as GPUBuffer,
                    0,
                    indices as GPUAllowSharedBufferSource
                );

                const vertexBufferLayout: GPUVertexBufferLayout = {
                    arrayStride: 12,
                    attributes: [{
                        format: 'float32x3',
                        offset: 0,
                        shaderLocation: 0
                    }] as GPUVertexAttribute[]
                };

                const shaderModule = device.createShaderModule({
                    code: contourShader
                });

                const pipeline = device.createRenderPipeline({
                    layout: 'auto',
                    vertex: {
                        module: shaderModule,
                        entryPoint: 'vertexMain',
                        buffers: [vertexBufferLayout]
                    },
                    fragment: {
                        module: shaderModule,
                        entryPoint: 'fragmentMain',
                        targets: [{
                            format: canvasFormat
                        }]
                    },
                    primitive: {
                        topology: 'triangle-list'
                    }
                });

                const bindGroup = device.createBindGroup({
                    layout: pipeline.getBindGroupLayout(0),
                    entries: [{
                        binding: 0,
                        resource: {
                            buffer: this.extremesUniformBuffer,
                            label: 'extremesUniformBuffer'
                        }
                    }, {
                        binding: 1,
                        resource: {
                            buffer: this.valueExtremesUniformBuffer,
                            label: 'valueExtremesUniformBuffer'
                        }
                    }, {
                        binding: 2,
                        resource: {
                            buffer: this.colorAxisStopsUniformBuffer,
                            label: 'colorAxisStopsBuffer'
                        }
                    }, {
                        binding: 3,
                        resource: {
                            buffer: this.colorAxisStopsCountUniformBuffer,
                            label: 'colorAxisStopsCountBuffer'
                        }
                    }, {
                        binding: 4,
                        resource: {
                            buffer: this.contourIntervalUniformBuffer,
                            label: 'contourIntervalUniformBuffer'
                        }
                    }, {
                        binding: 5,
                        resource: {
                            buffer: this.contourOffsetUniformBuffer,
                            label: 'contourOffsetUniformBuffer'
                        }
                    }, {
                        binding: 6,
                        resource: {
                            buffer: this.smoothColoringUniformBuffer,
                            label: 'smoothColoringUniformBuffer'
                        }
                    }, {
                        binding: 7,
                        resource: {
                            buffer: this.showContourLinesUniformBuffer,
                            label: 'showContourLinesUniformBuffer'
                        }
                    }, {
                        binding: 8,
                        resource: {
                            buffer: this.contourLineColorBuffer,
                            label: 'contourLineColorBuffer'
                        }
                    }]
                });

                this.renderFrame = function (): void {
                    // Set all uniforms before each frame
                    this.setUniforms(false);

                    // Render the frame
                    const encoder = device.createCommandEncoder();

                    const pass = encoder.beginRenderPass({
                        colorAttachments: [{
                            view: context.getCurrentTexture().createView(),
                            loadOp: 'clear' as GPULoadOp,
                            clearValue: [0, 0, 0, 0],
                            storeOp: 'store' as GPUStoreOp
                        }]
                    });
                    pass.setPipeline(pipeline);
                    pass.setVertexBuffer(0, vertexBuffer);
                    pass.setIndexBuffer(indexBuffer, 'uint32');
                    pass.setBindGroup(0, bindGroup);
                    pass.drawIndexed(indices.length);
                    pass.end();

                    device.queue.submit([encoder.finish()]);
                };

                this.renderFrame();
            }
        }
    }

    public override destroy(): void {
        // Remove the foreign object. The canvas will be removed with it.
        this.canvas?.parentElement?.remove();
        super.destroy();
    }

    public override drawGraph(): void {
        // Do nothing
    }

    /**
     * Set all the updateable uniforms.
     *
     * @param {boolean} renderFrame
     * Whether to rerender the series' context after setting the uniforms.
     * Defaults to `true`.
     */
    public setUniforms(renderFrame = true): void {
        this.setFrameExtremesUniform(false);
        this.setValueExtremesUniform(false);
        this.setColorAxisStopsUniforms(false);
        this.setContourIntervalUniform(false);
        this.setContourOffsetUniform(false);
        this.setSmoothColoringUniform(false);
        this.setShowContourLinesUniform(false);
        this.setContourLineColorUniform(false);
        if (renderFrame) {
            this.renderFrame?.();
        }
    }

    /**
     * Set the contour interval uniform according to the series options.
     *
     * @param {boolean} renderFrame
     * Whether to rerender the series' context after setting the uniform.
     * Defaults to `true`.
     */
    public setContourIntervalUniform(renderFrame = true): void {
        if (this.device && this.contourIntervalUniformBuffer) {
            this.device.queue.writeBuffer(
                this.contourIntervalUniformBuffer,
                0,
                new Float32Array([this.getContourInterval()])
            );
            if (renderFrame) {
                this.renderFrame?.();
            }
        }
    }

    /**
     * Set the contour offset uniform according to the series options.
     *
     * @param {boolean} renderFrame
     * Whether to rerender the series' context after setting the uniform.
     * Defaults to `true`.
     */
    public setContourOffsetUniform(renderFrame = true): void {
        if (this.device && this.contourOffsetUniformBuffer) {
            this.device.queue.writeBuffer(
                this.contourOffsetUniformBuffer,
                0,
                new Float32Array([this.getContourOffset()])
            );
            if (renderFrame) {
                this.renderFrame?.();
            }
        }
    }

    /**
     * Set the smooth coloring uniform according to the series options.
     *
     * @param {boolean} renderFrame
     * Whether to rerender the series' context after setting the uniform.
     * Defaults to `true`.
     */
    public setSmoothColoringUniform(renderFrame = true): void {
        if (this.device && this.smoothColoringUniformBuffer) {
            this.device.queue.writeBuffer(
                this.smoothColoringUniformBuffer || true,
                0,
                new Float32Array([this.getSmoothColoring()])
            );
            if (renderFrame) {
                this.renderFrame?.();
            }
        }
    }

    /**
     * Set the show contour lines uniform according to the series options.
     *
     * @param {boolean} renderFrame
     * Whether to rerender the series' context after setting the uniform.
     * Defaults to `true`.
     */
    public setShowContourLinesUniform(renderFrame = true): void {
        if (this.device && this.showContourLinesUniformBuffer) {
            this.device.queue.writeBuffer(
                this.showContourLinesUniformBuffer || true,
                0,
                new Float32Array([this.getShowContourLines()])
            );
            if (renderFrame) {
                this.renderFrame?.();
            }
        }
    }

    /**
     * Set the contour line color uniform according to the series options.
     *
     * @param {boolean} renderFrame
     * Whether to rerender the series' context after setting the uniform.
     * Defaults to `true`.
     */
    public setContourLineColorUniform(renderFrame = true): void {
        if (this.device && this.contourLineColorBuffer) {
            this.device.queue.writeBuffer(
                this.contourLineColorBuffer,
                0,
                new Float32Array(this.getContourLineColor())
            );
        }
        if (renderFrame) {
            this.renderFrame?.();
        }
    }

    /**
     * Set the frame extremes uniform according to the series options.
     *
     * @param {boolean} renderFrame
     * Whether to rerender the series' context after setting the uniform.
     * Defaults to `true`.
     */
    public setFrameExtremesUniform(renderFrame = true): void {
        if (this.device && this.extremesUniformBuffer) {
            this.device.queue.writeBuffer(
                this.extremesUniformBuffer,
                0,
                new Float32Array(this.getFrameExtremes())
            );
            if (renderFrame) {
                this.renderFrame?.();
            }
        }
    }

    /**
     * Set the value extremes uniform according to the series data.
     *
     * @param {boolean} renderFrame
     * Whether to rerender the series' context after setting the uniform.
     * Defaults to `true`.
     */
    public setValueExtremesUniform(renderFrame = true): void {
        if (this.device && this.valueExtremesUniformBuffer) {
            this.device.queue.writeBuffer(
                this.valueExtremesUniformBuffer,
                0,
                new Float32Array(this.getValueAxisExtremes())
            );
            if (renderFrame) {
                this.renderFrame?.();
            }
        }
    }

    /**
     * Set the color axis stops uniforms according to the color axis options.
     *
     * @param {boolean} renderFrame
     * Whether to rerender the series' context after setting the uniforms.
     * Defaults to `true`.
     */
    public setColorAxisStopsUniforms(renderFrame = true): void {
        const stopsBuffer = this.colorAxisStopsUniformBuffer;
        const countBuffer = this.colorAxisStopsCountUniformBuffer;
        if (this.device && stopsBuffer && countBuffer) {
            const { array, length } = this.getColorAxisStopsData();

            // Write the stops to the buffer
            this.device.queue.writeBuffer(
                stopsBuffer,
                0,
                array as GPUAllowSharedBufferSource
            );

            // Write the count to the buffer
            this.device.queue.writeBuffer(
                countBuffer,
                0,
                new Uint32Array([length]) as GPUAllowSharedBufferSource
            );

            if (renderFrame) {
                this.renderFrame?.();
            }
        }
    }

    /**
     * Returns the contour interval from the series options in format of the
     * WebGPU uniform.
     */
    private getContourInterval(): number {
        const interval = this.options.contourInterval ?? 1;
        if (isNaN(interval) || interval <= 0) {
            return -1;
        }
        return interval;
    }

    /**
     * Returns the contour offset from the series options in format of the
     * WebGPU uniform.
     */
    private getContourOffset(): number {
        const offset = this.options.contourOffset ?? 0;
        if (isNaN(offset) || offset <= 0) {
            return 0;
        }
        return offset;
    }

    /**
     * Returns the smooth coloring from the series options in format of the
     * WebGPU uniform.
     */
    private getSmoothColoring(): number {
        return this.options.smoothColoring ? 1 : 0;
    }

    /**
     * Returns the show contour lines from the series options in format of the
     * WebGPU uniform.
     */
    private getShowContourLines(): number {
        return this.options.showContourLines ? 1 : 0;
    }

    /**
     * Returns the contour line color from the series options in format of the
     * WebGPU uniform.
     */
    private getContourLineColor(): number[] {
        const { lineColor = '#000000' } = this.options;
        return ContourSeries.rgbaAsFrac(new Color(lineColor).rgba);
    }

    /**
     * Returns the extremes of the x and y axes in format of the WebGPU uniform.
     */
    private getFrameExtremes(): number[] {
        const { xAxis, yAxis } = this;

        return [
            xAxis.toValue(0, true),
            xAxis.toValue(xAxis.len, true),
            yAxis.toValue(yAxis.len, true),
            yAxis.toValue(0, true)
        ];
    }

    /**
     * Returns the extremes of the data in format of the WebGPU uniform.
     */
    private getValueAxisExtremes(): number[] {
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

    private getColorAxisStopsData(): { array: Float32Array, length: number } {
        const colorAxisStops = this.colorAxis?.stops;

        let flattenedData;

        if (colorAxisStops) {
            flattenedData = [];

            for (const stop of colorAxisStops) {
                const rgba = stop?.color?.rgba;

                if (rgba) {
                    flattenedData.push(
                        stop[0],
                        ...ContourSeries.rgbaAsFrac(rgba)
                    );
                }
            }
        }

        return {
            array: new Float32Array(
                flattenedData ?? [
                    0, 0, 0, 0,
                    1, 1, 1, 1
                ]
            ),
            length: colorAxisStops?.length || 2
        };

    }


    /* *
     *
     * Static Methods
     *
     * */

    /**
     * Returns the RGBA color as a fraction of the 255 range.
     */
    public static rgbaAsFrac(rgba: Color.RGBA): number[] {
        return [
            rgba[0],
            rgba[1],
            rgba[2]
        ].map((val): number => val / 255);
    }
}

extend(ContourSeries.prototype, {
    pointClass: ContourPoint,
    pointArrayMap: ['x', 'y', 'value'],
    keysAffectYAxis: ['y'],
    invertible: false
});

// Registry
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        contour: typeof ContourSeries;
    }
}

SeriesRegistry.registerSeriesType('contour', ContourSeries);
