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
import type { DeepPartial } from '../../Shared/Types';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement.js';

import Color from '../../Core/Color/Color.js';
import ContourPoint from './ContourPoint.js';
import contourShader from './contourShader.js';
import ContourSeriesDefaults from './ContourSeriesDefaults.js';
import Delaunay from '../../Core/Delaunay.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
import SVGPath from '../../Core/Renderer/SVG/SVGPath.js';
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';

const {
    seriesTypes: {
        scatter: ScatterSeries
    }
} = SeriesRegistry;
const {
    diffObjects,
    error,
    extend,
    merge,
    normalizeTickInterval
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

    private foreignObject?: SVGForeignObjectElement;

    private canvas?: HTMLCanvasElement;

    private adapter?: GPUAdapter | null;

    private device?: GPUDevice;

    private buffers?: Record<string, GPUBuffer>;

    public renderPromise?: Promise<void>;

    public readbackData?: Uint8Array;

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
     * - isInverted
     */


    /* *
     *
     * Methods
     *
     * */

    public init(chart: Chart, options: ContourSeriesOptions): void {
        super.init(chart, options);
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

        for (let i = 0; i < len; i++) {
            const { x, y = 0, value } = points[i],
                index2d = i * 2,
                index3d = i * 3;

            points2d[index2d] = x / xDivider;
            points2d[index2d + 1] = y && (y / yDivider) || 0;

            points3d[index3d] = x;
            points3d[index3d + 1] = y;
            points3d[index3d + 2] = value ?? 0;
        }

        return [new Delaunay(points2d).triangles, points3d];
    }

    public render(): void {
        const { chart, options } = this,
            visibility: 'hidden'|'inherit'|'visible' = this.visible ?
                'inherit' : 'hidden',
            zIndex = options.zIndex;

        const targetGroup = chart.seriesGroup;

        this.plotGroup(
            'group',
            'series',
            visibility,
            zIndex,
            targetGroup
        );

        const { group } = this;
        if (group && group?.parentGroup !== targetGroup) {
            group.parentGroup = targetGroup;
            // Can be improved by checking the exact zIndex of the series and
            // placing it after the first element with a lower zIndex.
            targetGroup?.element.prepend(group.element);
        }

        super.render();
        this.renderFrame = void 0;
        this.drawPoints();
    }

    public override update(
        options: DeepPartial<ContourSeriesOptions>,
        redraw?: boolean
    ): void {
        options = diffObjects(options, this.userOptions);
        const uniformOptions = [
            'smoothColoring',
            'showContourLines',
            'contourInterval',
            'contourOffset',
            'lineColor'
        ] as const;

        for (const key of uniformOptions) {
            if (Object.prototype.hasOwnProperty.call(options, key)) {
                (this.userOptions as any)[key] = (options as any)[key];
                (this.options as any)[key] = (options as any)[key];
                delete (options as any)[key];
            }
        }

        if (Object.keys(options).length > 0) {
            super.update(options, redraw);
        } else {
            // If no options besides uniform ones are changed, just set the
            // uniforms without rerendering the series.
            this.setUniforms();
        }
    }

    public override drawPoints(): void {
        if (this.chart.renderer.forExport) {
            // Export path: skip WebGPU; getSVG will inject <image>.
            return;
        }

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
            this.run();
        }
    }

    public async run(): Promise<void> {
        const series = this,
            canvas = series.canvas as HTMLCanvasElement,
            gpu = navigator.gpu,
            context = series.context = canvas.getContext('webgpu');

        if (!gpu || !context) {
            error(36, false);
            return;
        }

        if (context) {
            let device = this.device;

            if (!this.adapter) {
                this.adapter = await gpu.requestAdapter();
            }
            if (!device && this.adapter) {
                device = this.device = await this.adapter.requestDevice();
            }

            const canvasFormat = gpu.getPreferredCanvasFormat();

            if (device) {
                context.configure({
                    device: device,
                    format: canvasFormat,
                    colorSpace: 'display-p3',
                    alphaMode: 'premultiplied',
                    usage: (
                        GPUTextureUsage.RENDER_ATTACHMENT |
                        GPUTextureUsage.COPY_SRC
                    )
                });

                const [indices, vertices] = this.getContourData();

                // WebGPU Buffers grouped under a single object
                const buffers = this.buffers = {
                    vertex: device.createBuffer({
                        size: vertices.byteLength,
                        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
                    }),

                    index: device.createBuffer({
                        size: indices.byteLength,
                        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
                    }),

                    extremesUniform: device.createBuffer({
                        size: Float32Array.BYTES_PER_ELEMENT * 4,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    }),

                    valueExtremesUniform: device.createBuffer({
                        size: Float32Array.BYTES_PER_ELEMENT * 2,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    }),

                    contourIntervalUniform: device.createBuffer({
                        size: 4,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    }),

                    contourOffsetUniform: device.createBuffer({
                        size: 4,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    }),

                    smoothColoringUniform: device.createBuffer({
                        size: 4,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    }),

                    showContourLinesUniform: device.createBuffer({
                        size: 4,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    }),

                    contourLineColor: device.createBuffer({
                        size: 12,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    }),

                    colorAxisStopsCountUniform: device.createBuffer({
                        size: 4,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    }),

                    // Let's assume the color axis has at most 64 stops
                    colorAxisStopsUniform: device.createBuffer({
                        size: Float32Array.BYTES_PER_ELEMENT * 64,
                        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
                    }),

                    isInvertedUniform: device.createBuffer({
                        size: 4,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                    }),
                    contourImg: device.createBuffer({
                        size: Float32Array.BYTES_PER_ELEMENT * 4,
                        usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
                    })
                };

                const {
                    vertex: vertexBuffer,
                    index: indexBuffer,
                    extremesUniform: extremesUniformBuffer,
                    valueExtremesUniform: valueExtremesUniformBuffer,
                    contourIntervalUniform: contourIntervalUniformBuffer,
                    contourOffsetUniform: contourOffsetUniformBuffer,
                    smoothColoringUniform: smoothColoringUniformBuffer,
                    showContourLinesUniform: showContourLinesUniformBuffer,
                    contourLineColor: contourLineColorBuffer,
                    colorAxisStopsCountUniform: colAxisStopsCountUniformBuffer,
                    colorAxisStopsUniform: colorAxisStopsUniformBuffer,
                    isInvertedUniform: isInvertedUniformBuffer
                } = buffers;

                device.queue.writeBuffer(
                    vertexBuffer,
                    0,
                    vertices as GPUAllowSharedBufferSource
                );
                device.queue.writeBuffer(
                    indexBuffer,
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
                            buffer: colorAxisStopsUniformBuffer,
                            label: 'colorAxisStopsBuffer'
                        }
                    }, {
                        binding: 3,
                        resource: {
                            buffer: colAxisStopsCountUniformBuffer,
                            label: 'colorAxisStopsCountBuffer'
                        }
                    }, {
                        binding: 4,
                        resource: {
                            buffer: contourIntervalUniformBuffer,
                            label: 'contourIntervalUniformBuffer'
                        }
                    }, {
                        binding: 5,
                        resource: {
                            buffer: contourOffsetUniformBuffer,
                            label: 'contourOffsetUniformBuffer'
                        }
                    }, {
                        binding: 6,
                        resource: {
                            buffer: smoothColoringUniformBuffer,
                            label: 'smoothColoringUniformBuffer'
                        }
                    }, {
                        binding: 7,
                        resource: {
                            buffer: showContourLinesUniformBuffer,
                            label: 'showContourLinesUniformBuffer'
                        }
                    }, {
                        binding: 8,
                        resource: {
                            buffer: contourLineColorBuffer,
                            label: 'contourLineColorBuffer'
                        }
                    }, {
                        binding: 9,
                        resource: {
                            buffer: isInvertedUniformBuffer,
                            label: 'isInvertedUniformBuffer'
                        }
                    }]
                });

                let readback: GPUBuffer;

                this.renderFrame = function (): void {
                    this.setUniforms(false);

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

                    const exporting = this.chart.exporting;

                    if (exporting && this.buffers) {
                        const width = canvas.width,
                            height = canvas.height,
                            bytesPerPixel = 4,
                            bytesPerRow = (
                                Math.ceil((width * bytesPerPixel) / 256) * 256
                            );

                        this.buffers.readback = (
                            readback = device.createBuffer({
                                size: bytesPerRow * height,
                                usage: (
                                    GPUBufferUsage.COPY_DST |
                                    GPUBufferUsage.MAP_READ
                                )
                            })
                        );

                        encoder.copyTextureToBuffer(
                            { texture: context.getCurrentTexture() },
                            {
                                buffer: readback,
                                bytesPerRow,
                                rowsPerImage: height
                            },
                            { width, height, depthOrArrayLayers: 1 }
                        );
                    }

                    device.queue.submit([encoder.finish()]);

                    if (exporting) {
                        readback
                            .mapAsync(GPUMapMode.READ)
                            .then((): void => {
                                const src = new Uint8Array(
                                        readback.getMappedRange()
                                    ),
                                    readbackData = new Uint8Array(src),
                                    width = canvas.width,
                                    height = canvas.height,
                                    bytesPerPixel = 4,
                                    bytesPerRow = (
                                        Math.ceil(
                                            (width * bytesPerPixel) / 256
                                        ) * 256
                                    ),
                                    packed = new Uint8Array(
                                        width * height * bytesPerPixel
                                    );

                                for (let y = 0; y < height; y++) {
                                    const srcOffset = y * bytesPerRow,
                                        dstOffset = y * width * bytesPerPixel;

                                    for (
                                        let x = 0;
                                        x < width * bytesPerPixel;
                                        x += 4
                                    ) {
                                        const srcIndex = srcOffset + x,
                                            dstIndex = dstOffset + x;

                                        packed[dstIndex] =
                                            readbackData[srcIndex + 2];
                                        packed[dstIndex + 1] =
                                            readbackData[srcIndex + 1];
                                        packed[dstIndex + 2] =
                                            readbackData[srcIndex];
                                        packed[dstIndex + 3] =
                                            readbackData[srcIndex + 3];
                                    }
                                }

                                this.readbackData = packed;

                                readback.unmap();
                            });
                    }
                };

                this.renderFrame();
            }
        }
    }

    public override destroy(): void {
        // Remove the foreign object. The canvas will be removed with it.
        // For some reason, `series.update` calls `series.destroy` even if
        // update does not trigger a rerender. This causes the canvas to be
        // removed here (unnecessarily) and that causes the flickering effect
        // when updating.
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
        this.setIsInvertedUniform(renderFrame);
    }

    /**
     * Set the contour interval uniform according to the series options.
     *
     * @param {boolean} renderFrame
     * Whether to rerender the series' context after setting the uniform.
     * Defaults to `true`.
     */
    public setContourIntervalUniform(renderFrame = true): void {
        if (this.device && this.buffers?.contourIntervalUniform) {
            this.device.queue.writeBuffer(
                this.buffers.contourIntervalUniform,
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
     */
    public setContourOffsetUniform(renderFrame = true): void {
        if (this.device && this.buffers?.contourOffsetUniform) {
            this.device.queue.writeBuffer(
                this.buffers.contourOffsetUniform,
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
     */
    public setSmoothColoringUniform(renderFrame = true): void {
        if (this.device && this.buffers?.smoothColoringUniform) {
            this.device.queue.writeBuffer(
                this.buffers.smoothColoringUniform,
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
     */
    public setShowContourLinesUniform(renderFrame = true): void {
        if (this.device && this.buffers?.showContourLinesUniform) {
            this.device.queue.writeBuffer(
                this.buffers.showContourLinesUniform,
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
     */
    public setContourLineColorUniform(renderFrame = true): void {
        if (this.device && this.buffers?.contourLineColor) {
            this.device.queue.writeBuffer(
                this.buffers.contourLineColor,
                0,
                new Float32Array(this.getContourLineColor())
            );
            if (renderFrame) {
                this.renderFrame?.();
            }
        }
    }

    /**
     * Set the frame extremes uniform according to the series options.
     */
    public setFrameExtremesUniform(renderFrame = true): void {
        if (this.device && this.buffers?.extremesUniform) {
            this.device.queue.writeBuffer(
                this.buffers.extremesUniform,
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
     */
    public setValueExtremesUniform(renderFrame = true): void {
        if (this.device && this.buffers?.valueExtremesUniform) {
            this.device.queue.writeBuffer(
                this.buffers.valueExtremesUniform,
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
     */
    public setColorAxisStopsUniforms(renderFrame = true): void {
        const stopsBuffer = this.buffers?.colorAxisStopsUniform;
        const countBuffer = this.buffers?.colorAxisStopsCountUniform;

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
     * Set the is inverted uniform according to the series options.
     */
    public setIsInvertedUniform(renderFrame = true): void {
        if (this.device && this.buffers?.isInvertedUniform) {
            this.device.queue.writeBuffer(
                this.buffers.isInvertedUniform,
                0,
                new Uint32Array([this.chart.inverted ? 1 : 0])
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

        const interval = this.options.contourInterval ?? ((): number => {
            const [min, max] = this.getValueAxisExtremes(),
                range = max - min;

            return normalizeTickInterval(range / 10);
        })();

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
     * Returns the lineWidth from the series options, which controlls the
     * visibility of contour lines, in format of the WebGPU uniform.
     */
    private getShowContourLines(): number {
        return this.userOptions.lineWidth ?? 1;
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
                    (point): number => point.value || 0
                ));
            }
        }

        let max = series.valueMax;
        if (isNaN(max || NaN)) {
            max = series.colorAxis?.max;

            if (isNaN(max || NaN)) {
                max = Math.max(...series.points.map(
                    (point): number => point.value || 0
                ));
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

function cross(
    x: number,
    y: number,
    w: number,
    h: number
): SVGPath {
    return [
        ['M', x, y],
        ['L', x + w, y + h],
        ['M', x + w, y],
        ['L', x, y + h],
        ['z']
    ];
}

SVGRenderer.prototype.symbols.cross = cross;

extend(ContourSeries.prototype, {
    pointClass: ContourPoint,
    pointArrayMap: ['y', 'value'],
    keysAffectYAxis: ['y'],
    invertible: false
});

// Registry
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        contour: typeof ContourSeries;
    }
}

declare module '../../Core/Chart/Chart' {
    export default interface Chart {
        backgroundSeriesGroup?: SVGElement;
    }
}

SeriesRegistry.registerSeriesType('contour', ContourSeries);
