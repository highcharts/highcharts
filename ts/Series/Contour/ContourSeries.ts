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
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import U from '../../Core/Utilities.js';
import ContourSeriesOptions from './ContourSeriesOptions';
const { extend } = U;

class ContourSeries extends ScatterSeries {
    public canvas?: HTMLCanvasElement;
    public context?: GPUCanvasContext | null;
    public adapter?: GPUAdapter | null;
    public device?: GPUDevice;
    public image?: SVGElement;
    public data!: Array<ContourPoint>;
    public points!: Array<ContourPoint>;
    public options!: ContourSeriesOptions;
    private extremesUniform?: Float32Array;
    private extremesUniformBuffer?: GPUBuffer;
    private valueExtremesUniform?: Float32Array;
    private valueExtremesUniformBuffer?: GPUBuffer;
    private contourIntervalUniformBuffer?: GPUBuffer;
    private smoothColoringUniformBuffer?: GPUBuffer;
    private showContourLinesUniformBuffer?: GPUBuffer;

    public triangulateData(): Delaunay<Float64Array> {
        const points = this.points,
            length = points.length,
            points2d: Float64Array = new Float64Array(length * 2),
            { xAxis, yAxis } = this,
            xDivider = (Math.abs(xAxis.toValue(0, true)) > 10e6) ?
                10e6 :
                1,
            yDivider = (Math.abs(yAxis.toValue(yAxis.len, true)) > 10e6) ?
                10e6 :
                1;

        for (let i = 0; i < length; i++) {
            const { x, y } = points[i];
            points2d[i * 2] = x / xDivider;
            points2d[i * 2 + 1] = y && (y / yDivider) || 0;
        }

        return new Delaunay(points2d);
    }

    public get3DData(): Float32Array {
        const points3d: Float32Array = new Float32Array(this.points.length * 3);

        this.points.forEach((point, i): void => {
            points3d[i * 3] = point.x;
            points3d[i * 3 + 1] = point.y || 0;
            points3d[i * 3 + 2] = point.value || 0;
        });

        return points3d;
    }


    public drawPoints(): void {
        const series = this,
            canvas = series.canvas = document.createElement('canvas');

        // Canvas.classList.add('contourmap-canvas');

        this.setExtremes();
        this.setCanvasSize();
        this.context = canvas.getContext('webgpu');
        this.run();
    }


    async run(): Promise<void> {
        const context = this.context;

        if (context) {
            let device = this.device;

            if (!this.adapter) {
                this.adapter = await navigator.gpu.requestAdapter();
            }
            if (!device && this.adapter) {
                device = this.device = await this.adapter.requestDevice();
            }

            const canvasFormat = navigator.gpu.getPreferredCanvasFormat();

            if (device && this.canvas) {
                context.configure({
                    device: device,
                    format: canvasFormat
                });

                const vertices = this.get3DData(),
                    indices = this.triangulateData().triangles,
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
                    colorAxisStops = this.getColorAxisStopsData();

                // WebGPU Buffers
                const colorAxisStopsBuffer = device.createBuffer({
                    size: colorAxisStops.array.byteLength,
                    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
                    mappedAtCreation: true
                });

                const colorAxisStopsCountBuffer = device.createBuffer({
                    size: 4,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                    mappedAtCreation: true
                });

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
                this.contourIntervalUniformBuffer = device.createBuffer({
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

                            output.valExtremes = valueExtremesUniform;
                            output.originalPos = pos.xyz;
                            output.pos = vec4f(
                                (pos.x - xMin) / (xMax - xMin) * 2.0 - 1.0,
                                (pos.y - yMin) / (yMax - yMin) * 2.0 - 1.0,
                                0,
                                1
                            );

                            return output;
                        }

                        // ----------------------------------------------------

                        struct FragmentInput {
                            @location(0) originalPos: vec3f,
                            @location(1) valExtremes: vec2f
                        }

                        @group(0) @binding(2) var<storage> colorStops: array<vec4<f32>>;
                        @group(0) @binding(3) var<uniform> colorStopsCount: u32;
                        @group(0) @binding(4) var<uniform> contourInterval: f32;
                        @group(0) @binding(5) var<uniform> smoothColoring: u32;
                        @group(0) @binding(6) var<uniform> showContourLines: u32;

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
                            let lineWidth: f32 = 1.0;
                            let contourColor = vec3f(0.0, 0.0, 0.0);

                            let val_dx: f32 = dpdx(val);
                            let val_dy: f32 = dpdy(val);
                            let gradient: f32 = length(vec2f(val_dx, val_dy));

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
                                    contourColor,
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

                /*
                Const buffers = {
                    'extremesUniformBuffer': extremesUniformBuffer,
                    'valueExtremesUniformBuffer': valueExtremesUniformBuffer,
                    'colorAxisStopsBuffer': colorAxisStopsBuffer,
                    'colorAxisStopsCountBuffer': colorAxisStopsCountBuffer,
                    'contourIntervalUniformBuffer': (
                        this.contourIntervalUniformBuffer
                    ),
                    'smoothColoringUniformBuffer': (
                        this.smoothColoringUniformBuffer
                    ),
                    'showContourLinesUniformBuffer': (
                        this.showContourLinesUniformBuffer
                    )
                };

                for (const [key, val] of Object.entries(buffers)) {
                    console.log(key, val);
                }
                */

                // Note: Overkill with casting all of the buffers
                const bindGroup = device.createBindGroup({
                    layout: pipeline.getBindGroupLayout(0),
                    entries: [{
                        binding: 0,
                        resource: {
                            buffer: extremesUniformBuffer as GPUBuffer,
                            label: 'extremesUniformBuffer'
                        }
                    }, {
                        binding: 1,
                        resource: {
                            buffer: valueExtremesUniformBuffer as GPUBuffer,
                            label: 'valueExtremesUniformBuffer'
                        }
                    }, {
                        binding: 2,
                        resource: {
                            buffer: colorAxisStopsBuffer as GPUBuffer,
                            label: 'colorAxisStopsBuffer'
                        }
                    }, {
                        binding: 3,
                        resource: {
                            buffer: colorAxisStopsCountBuffer as GPUBuffer,
                            label: 'colorAxisStopsCountBuffer'
                        }
                    }, {
                        binding: 4,
                        resource: {
                            buffer: (
                                this.contourIntervalUniformBuffer as GPUBuffer
                            ),
                            label: 'contourIntervalUniformBuffer'
                        }
                    }, {
                        binding: 5,
                        resource: {
                            buffer: (
                                this.smoothColoringUniformBuffer as GPUBuffer
                            ),
                            label: 'smoothColoringUniformBuffer'
                        }
                    }, {
                        binding: 6,
                        resource: {
                            buffer: (
                                this.showContourLinesUniformBuffer as GPUBuffer
                            ),
                            label: 'showContourLinesUniformBuffer'
                        }
                    }]
                });

                const encoder = device.createCommandEncoder();

                const pass = encoder.beginRenderPass({
                    colorAttachments: [{
                        view: context.getCurrentTexture().createView(),
                        loadOp: 'clear' as GPULoadOp,
                        clearValue: [1, 1, 1, 1],
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

                this.image = this.chart.renderer.image(
                    this.canvas.toDataURL('image/png', 1)
                ).attr({
                    width: this.xAxis.len,
                    height: this.yAxis.len
                }).add(this.group);
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
        const colorAxisStops = (this.chart?.options?.colorAxis as any)?.stops;
        let ret = new Float32Array([
            0, 0, 0, 0,
            1, 1, 1, 1
        ]);

        if (colorAxisStops) {
            const flattenedData = [];

            for (const stop of colorAxisStops) {
                flattenedData.push(...this.colorToArray(stop[1]));
            }
            ret = new Float32Array(flattenedData);
        }

        return {
            array: ret,
            length: colorAxisStops?.length || 2
        };

    }

    private setCanvasSize(): void {

        const { canvas, xAxis, yAxis } = this;

        if (canvas) {
            canvas.style.width = xAxis.len + 'px';
            canvas.style.height = yAxis.len + 'px';

            canvas.width = this.chart.chartWidth * window.devicePixelRatio;
            canvas.height = this.chart.chartHeight * window.devicePixelRatio;
        }
    }

    /**
     * Set the extremes of the Contourmap axes.
     */
    public setExtremes(): void {

        if (!this.render) {
            return;
        }

        this.setCanvasSize();
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

            // This?.render();
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
