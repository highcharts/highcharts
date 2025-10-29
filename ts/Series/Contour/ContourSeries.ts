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

import ContourPoint from './ContourPoint.js';
import Delaunay from '../../Shared/Delaunay.js';
import U from '../../Core/Utilities.js';
import ContourSeriesOptions from './ContourSeriesOptions';
import Chart from '../../Core/Chart/Chart.js';
import ContourSeriesDefaults from './ContourSeriesDefaults.js';
import Color from '../../Core/Color/Color.js';

const { extend, merge } = U;

export default class ContourSeries extends ScatterSeries {

    public static defaultOptions = merge(
        ScatterSeries.defaultOptions,
        ContourSeriesDefaults
    );

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

    private smoothColoringUniformBuffer?: GPUBuffer;

    private showContourLinesUniformBuffer?: GPUBuffer;

    private contourLineColorBuffer?: GPUBuffer;

    private lineWidthBuffer?: GPUBuffer;

    public renderWebGPU?: () => void;

    public dataMax?: number;

    public renderPromise?: Promise<void>;

    public init(chart: Chart, options: ContourSeriesOptions): void {
        // Necessary for default tooltip behavior
        chart.options = merge(
            ContourSeries.defaultOptions,
            chart.options || {}
        );

        super.init.apply(this, [chart, options]);

        // Adjusting to canvas
        this.yAxis.axisPointRange = 1;
        this.yAxis.options.endOnTick = (
            this.yAxis.userOptions.endOnTick || false
        );
        this.yAxis.options.gridLineWidth = (
            this.yAxis.userOptions.gridLineWidth || 0
        );
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

            if (foundMax < (value || 0)) {
                foundMax = value || 0;
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


    public drawPoints(): void {
        const series = this,
            { xAxis, yAxis } = series,
            canvas = series.canvas = (
                series.canvas ||
                document.createElement('canvas')
            ),
            devicePixelRatio = window.devicePixelRatio,
            svg = document.querySelector('.highcharts-root'),
            foreignObject = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'foreignObject'
            ),
            xLen = xAxis.len,
            yLen = yAxis.len,
            foreignObjDimensions = series.chart.inverted ? {
                x: yAxis.pos,
                y: xAxis.pos,
                width: yLen,
                height: xLen
            } : {
                x: xAxis.pos,
                y: yAxis.pos,
                width: xLen,
                height: yLen
            };

        for (const [key, value] of Object.entries(foreignObjDimensions)) {
            foreignObject.setAttribute(key, String(value));
        }

        foreignObject.appendChild(canvas);
        svg?.insertBefore(
            foreignObject,
            document.querySelector('.highcharts-plot-background')
        );

        canvas.style.width = foreignObjDimensions.width + 'px';
        canvas.style.height = foreignObjDimensions.height + 'px';

        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;


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
                        lineColor = '#000000',
                        lineWidth = 1
                    } = options,
                    contourLineColor = new Float32Array(
                        this.rgbaAsFrac(new Color(lineColor).rgba)
                    ),
                    contourLineWidth = new Float32Array([
                        lineWidth
                    ]);

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

                const valueExtremesUniformBuffer = (
                    this.valueExtremesUniformBuffer = device.createBuffer({
                        size: valueExtremesUniform.byteLength,
                        usage: uniformUsage
                    }));
                this.contourIntervalUniformBuffer = device.createBuffer({
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

                this.lineWidthBuffer = device.createBuffer({
                    size: 4,
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
                    valueExtremesUniformBuffer,
                    0,
                    valueExtremesUniform
                );
                device.queue.writeBuffer(
                    this.contourLineColorBuffer,
                    0,
                    contourLineColor
                );
                device.queue.writeBuffer(
                    this.lineWidthBuffer,
                    0,
                    contourLineWidth
                );


                this.setContourIntervalUniform();
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
                    code: `
                        struct VertexInput {
                            @location(0) pos: vec3f
                        }

                        struct VertexOutput {
                            @builtin(position) pos: vec4f,
                            @location(0) originalPos: vec3f,
                            @location(1) valExtremes: vec2f,
                        }

                        @group(0) @binding(0) var<uniform> extremesUniform: vec4f;
                        @group(0) @binding(1) var<uniform> valueExtremesUniform: vec2f;

                        @vertex
                        fn vertexMain(input: VertexInput) -> VertexOutput {
                            var output: VertexOutput;
                            let pos = input.pos;

                            let xMin = extremesUniform[0];
                            let xMax = extremesUniform[1];
                            let yMin = extremesUniform[2];
                            let yMax = extremesUniform[3];

                            ${
                                !this.chart.inverted ? `
                                let posX = (
                                    (pos.x - xMin) /
                                    (xMax - xMin) *
                                    2.0 -
                                    1.0
                                );
                                let posY = (
                                    (pos.y - yMin) / (yMax - yMin) * 2.0 - 1.0
                                );
                                ` : `
                                let posX = (
                                    (pos.y - yMin) / (yMax - yMin) * 2.0 - 1.0
                                );
                                let posY = (
                                    (
                                        1.0 - (pos.x - xMin) / (xMax - xMin)
                                    ) * 2.0 - 1.0
                                );
                                `
                            }

                            output.valExtremes = valueExtremesUniform;
                            output.originalPos = pos.xyz;
                            output.pos = vec4f(
                                posX,
                                posY,
                                0,
                                1
                            );

                            return output;
                        }

                        // ------------------------------------------------

                        struct FragmentInput {
                            @location(0) originalPos: vec3f,
                            @location(1) valExtremes: vec2f
                        }

                        @group(0) @binding(2) var<storage> colorStops: array<vec4<f32>>;
                        @group(0) @binding(3) var<uniform> colorStopsCount: u32;
                        @group(0) @binding(4) var<uniform> contourInterval: f32;
                        @group(0) @binding(5) var<uniform> smoothColoring: u32;
                        @group(0) @binding(6) var<uniform> showContourLines: u32;
                        @group(0) @binding(7) var<uniform> contourLineColor: vec3<f32>;
                        @group(0) @binding(8) var<uniform> lineWidth: f32;


                        fn getColor(value: f32) -> vec3<f32> {
                            let stopCount = colorStopsCount;

                            if (stopCount == 0u) {
                                return vec3<f32>(1.0, 1.0, 1.0);
                            }

                            for (
                                var i: u32 = 0u;
                                i < stopCount - 1u;
                                i = i + 1u
                            ) {
                                if (value < colorStops[i + 1u].x) {
                                    let t = (
                                        (value - colorStops[i].x) /
                                        (
                                            colorStops[i + 1u].x -
                                            colorStops[i].x
                                        )
                                    );
                                    return mix(
                                        colorStops[i].yzw,
                                        colorStops[i + 1u].yzw,
                                        t
                                    );
                                }
                            }
                            return colorStops[stopCount - 1u].yzw;
                        }

                        @fragment
                        fn fragmentMain(input: FragmentInput) -> @location(0) vec4f {
                            let val = input.originalPos.z;

                            // CONTOUR LINES
                            //let lineWidth: f32 = 1.0;
                            //let contourColor = vec3f(0.0, 0.0, 0.0);

                            let val_dx: f32 = dpdx(val);
                            let val_dy: f32 = dpdy(val);
                            let gradient: f32 = length(
                                vec2f(val_dx, val_dy)
                            );

                            let epsilon: f32 = 0.0001;
                            let adjustedLineWidth: f32 = (
                                lineWidth * gradient + epsilon
                            );

                            let valDiv: f32 = val / contourInterval;
                            let valMod: f32 = (
                                val -
                                contourInterval *
                                floor(valDiv)
                            );

                            let lineMask: f32 = (
                                smoothstep(0.0, adjustedLineWidth, valMod) *
                                (
                                    1.0 -
                                    smoothstep(
                                        contourInterval - adjustedLineWidth,
                                        contourInterval,
                                        valMod
                                    )
                                )
                            );

                            let contourIndex: f32 = floor(
                                val /
                                contourInterval
                            );
                            let averageValInBand : f32 = (
                                contourIndex *
                                contourInterval +
                                contourInterval /
                                2.0
                            );

                            // BACKGROUND COLOR
                            let minHeight: f32 = input.valExtremes.x;
                            let maxHeight: f32 = input.valExtremes.y;
                            let normVal: f32 = (
                                (val - minHeight) /
                                (maxHeight - minHeight)
                            );
                            let averageNormVal: f32 = (
                                (averageValInBand - minHeight) /
                                (maxHeight - minHeight)
                            );

                            var bgColor: vec3f;
                            if (smoothColoring > 0) {
                                bgColor = getColor(normVal);
                            } else {
                                bgColor = getColor(averageNormVal);
                            }

                            // MIX
                            var pixelColor = bgColor;

                            if (showContourLines > 0) {
                                pixelColor = mix(
                                    contourLineColor,
                                    pixelColor,
                                    lineMask
                                );
                            }

                            return vec4(pixelColor, 1.0);
                        }
                    `
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
                            buffer: valueExtremesUniformBuffer,
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
                            buffer: this.smoothColoringUniformBuffer,
                            label: 'smoothColoringUniformBuffer'
                        }
                    }, {
                        binding: 6,
                        resource: {
                            buffer: this.showContourLinesUniformBuffer,
                            label: 'showContourLinesUniformBuffer'
                        }
                    }, {
                        binding: 7,
                        resource: {
                            buffer: this.contourLineColorBuffer,
                            label: 'contourLineColorBuffer'
                        }
                    }, {
                        binding: 8,
                        resource: {
                            buffer: this.lineWidthBuffer,
                            label: 'lineWidthBuffer'
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

    public destroy(): void {
        if (this.canvas) {
            this.canvas.remove();
        }

        super.destroy();
    }

    public drawGraph(): void {
        // Empty
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
                this.smoothColoringUniformBuffer || true,
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
                this.showContourLinesUniformBuffer || true,
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
        const { xAxis, yAxis } = this,
            { max: xMax = 0, min: xMin = 0 } = xAxis,
            { max: yMax = 0, min: yMin = 0 } = yAxis,
            // Use a small percentage of the range as padding
            paddingPercent = -0.02,
            xRange = ((xMax || 1) - (xMin || 0)) * paddingPercent,
            yRange = ((yMax || 1) - (yMin || 0)) * paddingPercent;

        return [
            xMin - xRange,
            xMax + xRange,
            yMin - yRange,
            yMax + yRange
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

    public rgbaAsFrac(rgba: Color.RGBA): number[] {
        return [
            rgba[0],
            rgba[1],
            rgba[2]
        ].map((val): number => val / 255);
    }

    private getColorAxisStopsData(): { array: Float32Array, length: number } {
        const colorAxisStops = this.colorAxis?.stops;

        let flattenedData;

        if (colorAxisStops) {
            flattenedData = [];

            for (const stop of colorAxisStops) {
                const rgba = stop?.color?.rgba;

                if (rgba) {
                    flattenedData.push(stop[0], ...this.rgbaAsFrac(rgba));
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
