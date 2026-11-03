/* *
 *
 *  (c) 2026 Highsoft AS
 *
 *  Boost2: GPU draw strategy for the line series.
 *
 *  License: highcharts.com/license
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Point from '../../../Core/Series/Point';
import type Series from '../../../Core/Series/Series';

import Color from '../../../Core/Color/Color.js';
import GPUContext from '../GPUContext.js';
import GPUSurface from '../GPUSurface.js';
import H from '../../../Core/Globals.js';
const { doc, win } = H;
import LineShader from './LineShader.js';
import { isNumber } from '../../../Shared/Utilities.js';

/* *
 *
 *  Constants
 *
 * */

/** Uniform buffer size: two vec4f of 16 bytes each. */
const UNIFORM_BYTES = 32;

/**
 * Resolved color expressions, keyed by color scheme and expression. The same
 * CSS variable resolves differently in light and dark mode.
 * @internal
 */
const colorCache: Record<string, Color.RGBA> = {};

/* *
 *
 *  Functions
 *
 * */

/**
 * Resolve a CSS color expression to RGBA components.
 *
 * `Color.parse` does not resolve `var()` or `color-mix()`. Those are passed
 * to a probe element inside the chart container, so the cascade - including
 * the active color scheme - resolves them.
 *
 * @internal
 */
function resolveColor(expression: string, container: HTMLElement): Color.RGBA {
    // `Color.parse` returns NaN components for unresolved input, so the
    // check is numeric rather than a null comparison.
    const direct = Color.parse(expression).rgba;

    if (direct.every(isNumber)) {
        return direct;
    }

    const scheme = win.matchMedia?.('(prefers-color-scheme: dark)').matches ?
            'dark' : 'light',
        key = scheme + '|' + expression,
        cached = colorCache[key];

    if (cached) {
        return cached;
    }

    // The probe must be an HTML element inside the container; an SVG
    // element in a `<div>` gets no computed style.
    const probe = doc.createElement('div');

    probe.style.cssText =
        'position:absolute;width:0;height:0;visibility:hidden';
    probe.style.color = expression;
    container.appendChild(probe);

    const computed = win.getComputedStyle(probe).color;

    probe.remove();

    const resolved = Color.parse(computed).rgba;

    return (colorCache[key] = resolved.every(isNumber) ?
        resolved :
        [0, 0, 0, 1] as Color.RGBA);
}

/** @internal */
function buildPipeline(
    device: GPUDevice,
    format: GPUTextureFormat
): GPURenderPipeline {
    const module = device.createShaderModule({ code: LineShader }),
        blendComponent: GPUBlendComponent = {
            srcFactor: 'one',
            dstFactor: 'one-minus-src-alpha'
        };

    return device.createRenderPipeline({
        layout: 'auto',
        vertex: { module, entryPoint: 'vs' },
        fragment: {
            module,
            entryPoint: 'fs',
            targets: [{
                format,
                blend: { color: blendComponent, alpha: blendComponent }
            }]
        },
        primitive: { topology: 'line-strip' }
    });
}

/* *
 *
 *  Class
 *
 * */

/**
 * Series sub-object, following the pattern of `axis.ordinal` and
 * `axis.logarithmic`.
 *
 * Reads `dataTable`, the axes and the options; writes only to `series.gpu`.
 * Detaching therefore requires no state to be restored.
 *
 * @internal
 */
class LineStrategy {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(series: Series) {
        this.series = series;
    }

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public series: Series;

    /** @internal */
    public stats = { uploads: 0, draws: 0, buildMs: 0, drawMs: 0 };

    /** @internal */
    private surface?: GPUSurface;

    /** @internal */
    private buffer?: GPUBuffer;

    /** @internal */
    private uniformBuffer?: GPUBuffer;

    /** @internal */
    private uniformData = new Float32Array(UNIFORM_BYTES / 4);

    /** @internal */
    private bindGroup?: GPUBindGroup;

    /** @internal */
    private pipeline?: GPURenderPipeline;

    /** @internal */
    private capacity = 0;

    /** @internal */
    private count = 0;

    /**
     * Columns the buffer was built from. The buffer holds every point, so
     * array identity is a sufficient dirty check.
     * @internal
     */
    private sourceX?: Array<number>;

    /** @internal */
    private sourceY?: Array<number>;

    /**
     * Domain origin, kept in f64 and subtracted before conversion to f32.
     * A raw timestamp exceeds f32 precision; `x - xOrigin` does not.
     * @internal
     */
    private xOrigin = 0;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Upload the whole series. Called from `translate()`, before any
     * `Point` objects are created.
     *
     * All points are uploaded, not only the visible ones; the shader maps
     * the domain, so zoom and pan only rewrite uniforms.
     * @internal
     */
    public buildBuffer(): void {
        const start = performance.now(),
            series = this.series,
            xData = series.getColumn('x'),
            yData = series.getColumn('y'),
            length = Math.min(xData.length, yData.length);

        if (xData === this.sourceX && yData === this.sourceY) {
            this.stats.buildMs = performance.now() - start;
            return;
        }

        this.xOrigin = length ? xData[0] : 0;

        const flat = new Float32Array(length * 2),
            xOrigin = this.xOrigin;

        for (let i = 0, j = 0; i < length; i++) {
            flat[j++] = xData[i] - xOrigin;
            // Null and undefined become NaN, which drops the segment.
            flat[j++] = yData[i] ?? NaN;
        }

        const bytes = Math.max(32, flat.byteLength);

        if (!this.buffer || this.capacity < bytes) {
            this.buffer?.destroy();
            this.buffer = GPUContext.createStorageBuffer(bytes);
            this.capacity = bytes;
            this.bindGroup = void 0;
        }

        GPUContext.device!.queue.writeBuffer(this.buffer, 0, flat);

        this.count = length;
        this.sourceX = xData;
        this.sourceY = yData;
        this.stats.uploads++;
        this.stats.buildMs = performance.now() - start;
    }

    /** @internal */
    private ensureResources(): void {
        this.pipeline = GPUContext.pipeline('boost2-line', buildPipeline);

        if (!this.uniformBuffer) {
            this.uniformBuffer = GPUContext.createUniformBuffer(UNIFORM_BYTES);
        }

        if (!this.bindGroup) {
            this.bindGroup = GPUContext.device!.createBindGroup({
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: { buffer: this.uniformBuffer } },
                    { binding: 1, resource: { buffer: this.buffer! } }
                ]
            });
        }
    }

    /**
     * Draw the series.
     * @internal
     */
    public draw(): void {
        if (!GPUContext.ready || !this.buffer || this.count < 2) {
            return;
        }

        const start = performance.now(),
            series = this.series,
            chart = series.chart;

        this.surface ||= new GPUSurface(series);
        this.surface.layout();
        this.ensureResources();

        const { xAxis, yAxis } = series,
            rgba = resolveColor(series.color as string, chart.container),
            uniforms = this.uniformData;

        uniforms[0] = (xAxis.min as number) - this.xOrigin;
        uniforms[1] = (xAxis.max as number) - this.xOrigin;
        uniforms[2] = yAxis.min as number;
        uniforms[3] = yAxis.max as number;
        uniforms[4] = rgba[0] / 255;
        uniforms[5] = rgba[1] / 255;
        uniforms[6] = rgba[2] / 255;
        uniforms[7] = rgba[3];

        const device = GPUContext.device!;
        device.queue.writeBuffer(this.uniformBuffer!, 0, uniforms);

        const encoder = device.createCommandEncoder(),
            pass = this.surface.beginPass(encoder);

        pass.setPipeline(this.pipeline!);
        pass.setBindGroup(0, this.bindGroup!);
        pass.draw(this.count);
        pass.end();

        device.queue.submit([encoder.finish()]);

        this.stats.draws++;
        this.stats.drawMs = performance.now() - start;
    }

    /**
     * Nearest point by x, without a k-d tree or mock points.
     *
     * Requires a sorted x column, which `Boost2.isEligible` enforces through
     * `requireSorting`. Allocates nothing.
     * @internal
     */
    public hitAt(chartX: number): (Point|undefined) {
        const series = this.series,
            xData = series.getColumn('x');

        if (!xData.length) {
            return void 0;
        }

        // Chart coordinates: `toValue` subtracts the axis position itself.
        const value = series.xAxis.toValue(chartX);

        let low = 0,
            high = xData.length - 1;

        while (low < high) {
            const mid = (low + high) >> 1;
            if (xData[mid] < value) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        if (
            low > 0 &&
            Math.abs(xData[low - 1] - value) < Math.abs(xData[low] - value)
        ) {
            low--;
        }

        return this.materialize(low);
    }

    /**
     * Creates the `Point` for a single hit.
     * @internal
     */
    private materialize(index: number): Point {
        const series = this.series,
            xData = series.getColumn('x'),
            yData = series.getColumn('y'),
            x = xData[index],
            y = yData[index],
            PointClass = series.pointClass,
            point = new PointClass(series, [x, y], x);

        point.index = index;
        point.category = x as unknown as string;
        point.key = point.category;
        point.plotX = series.xAxis.toPixels(x, true);
        point.plotY = series.yAxis.toPixels(y, true);
        point.isInside = series.isPointInside(point);

        return point;
    }

    /** @internal */
    public destroy(): void {
        this.buffer?.destroy();
        this.uniformBuffer?.destroy();
        this.surface?.destroy();
        this.buffer = this.uniformBuffer = void 0;
        this.bindGroup = void 0;
        this.surface = void 0;
    }

}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default LineStrategy;
