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
import contourSeriesDefaults from './contourSeriesDefaults.js';
import Delaunay from '../../Shared/Delaunay.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';

const {
    seriesTypes: {
        scatter: ScatterSeries
    }
} = SeriesRegistry;
const { extend, merge } = U;


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
        contourSeriesDefaults
    );


    /* *
     *
     * Properties
     *
     * */

    public data!: Array<ContourPoint>;

    public points!: Array<ContourPoint>;

    public options!: ContourSeriesOptions;

    private canvas?: HTMLCanvasElement;

    public context?: GPUCanvasContext | null;

    private adapter?: GPUAdapter | null;

    private device?: GPUDevice;

    private extremesUniform?: Float32Array;

    private extremesUniformBuffer?: GPUBuffer;

    private valueExtremesUniform?: Float32Array;

    private valueExtremesUniformBuffer?: GPUBuffer;

    private contourIntervalUniformBuffer?: GPUBuffer;

    private contourOffsetUniformBuffer?: GPUBuffer;

    private smoothColoringUniformBuffer?: GPUBuffer;

    private showContourLinesUniformBuffer?: GPUBuffer;

    private contourLineColorBuffer?: GPUBuffer;

    public renderWebGPU?: () => void;

    public dataMax?: number;

    public renderPromise?: Promise<void>;

    public contourOffsetsBuffer?: GPUBuffer;

    public contourOffsetsCountBuffer?: GPUBuffer;


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
            tickWidth: 1,
            lineWidth: 1
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
        const series = this,
            inverted = series.chart.inverted,
            { xAxis, yAxis } = series,
            canvas = series.canvas = (
                series.canvas ||
                document.createElement('canvas')
            ),
            devicePixelRatio = window.devicePixelRatio,
            svg = document.querySelector('.highcharts-root'),
            foreignObject = canvas.parentElement || document.createElementNS(
                'http://www.w3.org/2000/svg',
                'foreignObject'
            ),
            xLen = xAxis.len,
            yLen = yAxis.len,
            xTickWidth = xAxis.options.tickWidth || 1,
            currentWidth = parseInt(
                foreignObject.style.width.split('px')[0], 10
            ) || 0,
            currentHeight = parseInt(
                foreignObject.style.height.split('px')[0], 10
            ) || 0;

        let foreignObjDimensions = {};

        if (
            !inverted ? (
                xLen + xTickWidth !== currentWidth ||
                yLen !== currentHeight
            ) : (
                yLen + xTickWidth !== currentWidth ||
                xLen !== currentHeight
            )
        ) {
            const canvasProps = foreignObjDimensions = merge(
                foreignObjDimensions,
                series.chart.inverted ? {
                    x: yAxis.pos,
                    y: xAxis.pos,
                    width: yLen + xTickWidth,
                    height: xLen
                } : {
                    x: xAxis.pos,
                    y: yAxis.pos,
                    width: xLen + xTickWidth,
                    height: yLen
                }
            );
            canvas.width = (
                canvasProps.width +
                xTickWidth
            ) * devicePixelRatio;
            canvas.height = canvasProps.height * devicePixelRatio;
            canvas.style.width = canvasProps.width + 'px';
            canvas.style.height = canvasProps.height + 'px';
        }

        for (const [key, value] of Object.entries(foreignObjDimensions)) {
            foreignObject.setAttribute(key, String(value));
        }

        foreignObject.appendChild(canvas);
        svg?.insertBefore(
            foreignObject,
            document.querySelector('.highcharts-plot-background')
        );


        // If this function exists, buffers are set up
        if (series.renderWebGPU) {
            series.renderWebGPU?.();
            return;
        }

        this.renderPromise = series.run();
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

                const
                    [indices, vertices] = this.getContourData(),
                    extremesUniform = this.extremesUniform = (
                        new Float32Array(
                            this.getWebGPUExtremes()
                        )
                    ),
                    valueExtremesUniform = (
                        this.valueExtremesUniform = (
                            new Float32Array(
                                this.getDataExtremes()
                            )
                        )
                    ),
                    colorAxisStops = this.getColorAxisStopsData(),

                    // Caching bitwise operation
                    uniformUsage = (
                        GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    ),
                    options = series.options,
                    {
                        lineColor = '#000000'
                    } = options,
                    contourLineColor = new Float32Array(
                        ContourSeries.rgbaAsFrac(new Color(lineColor).rgba)
                    );

                // WebGPU Buffers
                const colorAxisStopsBuffer = device.createBuffer({
                    size: colorAxisStops.array.byteLength,
                    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
                    mappedAtCreation: true
                });

                const colorAxisStopsCountBuffer = device.createBuffer({
                    size: 4,
                    usage: uniformUsage,
                    mappedAtCreation: true
                });

                const vertexBuffer: GPUBuffer = device.createBuffer({
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
                        usage: uniformUsage
                    }));

                this.valueExtremesUniformBuffer = device.createBuffer({
                    size: valueExtremesUniform.byteLength,
                    usage: uniformUsage
                });

                this.contourIntervalUniformBuffer = device.createBuffer({
                    size: 4,
                    usage: uniformUsage
                });

                this.contourOffsetUniformBuffer = device.createBuffer({
                    size: 4,
                    usage: uniformUsage
                });

                this.smoothColoringUniformBuffer = device.createBuffer({
                    size: 4,
                    usage: uniformUsage
                });

                this.showContourLinesUniformBuffer = device.createBuffer({
                    size: 4,
                    usage: uniformUsage
                });

                this.contourLineColorBuffer = device.createBuffer({
                    size: 12,
                    usage: uniformUsage
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
                device.queue.writeBuffer(
                    extremesUniformBuffer,
                    0,
                    extremesUniform
                );
                device.queue.writeBuffer(
                    this.valueExtremesUniformBuffer,
                    0,
                    valueExtremesUniform
                );
                device.queue.writeBuffer(
                    this.contourLineColorBuffer,
                    0,
                    contourLineColor
                );

                this.setContourIntervalUniform();
                this.setContourOffsetUniform();
                this.setSmoothColoringUniform();
                this.setShowContourLinesUniform();

                new Float32Array(
                    colorAxisStopsBuffer.getMappedRange()
                ).set(colorAxisStops.array);
                colorAxisStopsBuffer.unmap();

                new Uint32Array(
                    colorAxisStopsCountBuffer.getMappedRange()
                )[0] = colorAxisStops.length;
                colorAxisStopsCountBuffer.unmap();

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
                            buffer: extremesUniformBuffer,
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
                            buffer: colorAxisStopsBuffer,
                            label: 'colorAxisStopsBuffer'
                        }
                    }, {
                        binding: 3,
                        resource: {
                            buffer: colorAxisStopsCountBuffer,
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

                this.renderWebGPU = function (): void {
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

                this.renderWebGPU();
            }
        }

    }

    public override destroy(): void {
        this.canvas?.remove();
        super.destroy();
    }

    public override drawGraph(): void {
        // Empty
    }

    /**
     * Set the contour interval uniform according to the series options.
     *
     * @param {boolean} rerender
     * Whether to rerender the series' context after setting the uniform.
     * Defaults to true.
     */
    public setContourIntervalUniform(rerender = true): void {
        if (this.device && this.contourIntervalUniformBuffer) {
            this.device.queue.writeBuffer(
                this.contourIntervalUniformBuffer,
                0,
                new Float32Array([this.getContourInterval()])
            );
            if (rerender) {
                this.renderWebGPU?.();
            }
        }
    }

    /**
     * Set the contour offset uniform according to the series options.
     */
    public setContourOffsetUniform(rerender = false): void {
        if (this.device && this.contourOffsetUniformBuffer) {
            this.device.queue.writeBuffer(
                this.contourOffsetUniformBuffer,
                0,
                new Float32Array([this.getContourOffset()])
            );
            if (rerender) {
                this.renderWebGPU?.();
            }
        }
    }

    /**
     * Set the smooth coloring uniform according to the series options.
     */
    public setSmoothColoringUniform(rerender = false): void {
        if (this.device && this.smoothColoringUniformBuffer) {
            this.device.queue.writeBuffer(
                this.smoothColoringUniformBuffer || true,
                0,
                new Float32Array([this.getSmoothColoring()])
            );
            if (rerender) {
                this.renderWebGPU?.();
            }
        }
    }

    /**
     * Set the show contour lines uniform according to the series options.
     */
    public setShowContourLinesUniform(rerender = false): void {
        if (this.device && this.showContourLinesUniformBuffer) {
            this.device.queue.writeBuffer(
                this.showContourLinesUniformBuffer || true,
                0,
                new Float32Array([this.getShowContourLines()])
            );
            if (rerender) {
                this.renderWebGPU?.();
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
     * Returns the extremes of the Contourmap axes in format of the WebGPU
     * uniform.
     */
    private getWebGPUExtremes(): number[] {
        const { xAxis, yAxis } = this,
            { max: xMax = 0, min: xMin = 0 } = xAxis,
            { max: yMax = 0, min: yMin = 0 } = yAxis;

        return [
            xMin,
            xMax,
            yMin,
            yMax
        ];
    }

    /**
     * Returns the extremes of the data in format of the WebGPU uniform.
     */
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

    /**
     * Set the extremes of the Contourmap axes.
     */
    public setExtremes(): void {

        if (!this.renderWebGPU) {
            return;
        }

        if (this.device) {

            if (this.extremesUniform && this.extremesUniformBuffer) {
                this.device.queue.writeBuffer(
                    this.extremesUniformBuffer,
                    0,
                    this.extremesUniform as GPUAllowSharedBufferSource
                );
                this.extremesUniform?.set(this.getWebGPUExtremes() as Array<number>);
            }

            if (this.valueExtremesUniform && this.valueExtremesUniformBuffer) {
                this.valueExtremesUniform?.set(this.getDataExtremes());
                this.device.queue.writeBuffer(
                    this.valueExtremesUniformBuffer,
                    0,
                    this.valueExtremesUniform as GPUAllowSharedBufferSource
                );
            }

            this?.renderWebGPU();
        }
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
    keysAffectYAxis: ['y']
});

// Registry
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        contour: typeof ContourSeries;
    }
}

SeriesRegistry.registerSeriesType('contour', ContourSeries);
