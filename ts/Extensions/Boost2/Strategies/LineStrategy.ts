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

import type DataExtremesObject from '../../../Core/Series/DataExtremesObject';
import type Point from '../../../Core/Series/Point';
import type PointerEvent from '../../../Core/PointerEvent';
import type Series from '../../../Core/Series/Series';

import Color from '../../../Core/Color/Color.js';
import GPUContext from '../GPUContext.js';
import GPUSurface from '../GPUSurface.js';
import H from '../../../Core/Globals.js';
const { doc, win } = H;
import LineShader from '../Shaders/LineShader.js';
import MarkerShader from '../Shaders/MarkerShader.js';
import { isNumber } from '../../../Shared/Utilities.js';

/* *
 *
 *  Constants
 *
 * */

/**
 * Uniform buffer size: two vec4f, then viewport, half width, count and
 * marker radius, padded to the 16 byte struct alignment.
 */
const UNIFORM_BYTES = 64;

/**
 * Rows per entry of the min/max index, as a shift. Range queries read one
 * entry per block instead of every row it covers.
 * @internal
 */
const BLOCK_SHIFT = 10;

/** @internal */
const BLOCK = 1 << BLOCK_SHIFT;

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
 * Resolve a CSS color expression to RGBA. `Color.parse` handles neither
 * `var()` nor `color-mix()`, so those go through a probe element in the
 * chart container, where the cascade resolves them.
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

/**
 * The rule from `Series.drawPoints`. Its `closestPointRangePx` comes from
 * `translate`, which the GPU path skips, so the same quantity is derived
 * from the closest data distance and the axis scale.
 *
 * @internal
 */
function markersEnabled(series: Series): boolean {
    const marker = series.options.marker || {},
        xAxis = series.xAxis,
        rangePx = (series.closestPointRange ?? 0) * (xAxis?.transA ?? 0);

    return marker.enabled ??
        ((!xAxis || xAxis.isRadial) ? true : null) ??
        // `radius` carries the series default, as it does in the core.
        (rangePx >= (marker.enabledThreshold ?? 2) * (marker.radius as number));
}

/** First index whose x is not below `value`. @internal */
function lowerBound(xData: Array<number>, value: number): number {
    let low = 0,
        high = xData.length;

    while (low < high) {
        const mid = (low + high) >> 1;

        if (xData[mid] < value) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
}

/** Last index whose x is not above `value`. @internal */
function upperBound(xData: Array<number>, value: number): number {
    let low = 0,
        high = xData.length;

    while (low < high) {
        const mid = (low + high) >> 1;

        if (xData[mid] <= value) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low - 1;
}

/** @internal */
function buildPipeline(
    device: GPUDevice,
    format: GPUTextureFormat,
    layout: GPUPipelineLayout,
    code: string,
    vertexEntry: string,
    fragmentEntry: string,
    topology: GPUPrimitiveTopology
): GPURenderPipeline {
    const module = device.createShaderModule({ code }),
        blendComponent: GPUBlendComponent = {
            srcFactor: 'one',
            dstFactor: 'one',
            operation: 'max'
        };

    return device.createRenderPipeline({
        layout,
        vertex: { module, entryPoint: vertexEntry },
        fragment: {
            module,
            entryPoint: fragmentEntry,
            targets: [{
                format,
                blend: { color: blendComponent, alpha: blendComponent }
            }]
        },
        // Culling stays off: the strip winds both ways as the path turns.
        primitive: { topology }
    });
}

/* *
 *
 *  Class
 *
 * */

/**
 * Series sub-object, as `axis.ordinal` and `axis.logarithmic` are. Reads
 * `dataTable`, the axes and the options; writes nothing back, so detaching
 * restores no state.
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

    /**
     * Buffer and draw timings. Written here, read by nothing in the module.
     * @todo Debugging only, remove.
     * @internal
     */
    public stats = { uploads: 0, draws: 0, buildMs: 0, drawMs: 0 };

    /** Graph, in the clipped and animated series group. @internal */
    private surface?: GPUSurface;

    /** Markers, in the unclipped marker group. @internal */
    private markerSurface?: GPUSurface;

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
    private markerPipeline?: GPURenderPipeline;

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
     * Lowest and highest y of each block of rows, built with the buffer.
     * @internal
     */
    private blockMin = new Float64Array(0);

    /** @internal */
    private blockMax = new Float64Array(0);

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
     * Upload the whole series, not only the visible points: the shader
     * maps the domain, so zoom and pan only rewrite uniforms.
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
            xOrigin = this.xOrigin,
            blocks = Math.ceil(length / BLOCK),
            blockMin = new Float64Array(blocks).fill(Infinity),
            blockMax = new Float64Array(blocks).fill(-Infinity);

        for (let i = 0, j = 0; i < length; i++) {
            const value = yData[i];

            flat[j++] = xData[i] - xOrigin;
            // Null and undefined become NaN, which drops the segment.
            flat[j++] = value ?? NaN;

            if (isNumber(value)) {
                const b = i >> BLOCK_SHIFT;

                if (value < blockMin[b]) {
                    blockMin[b] = value;
                }
                if (value > blockMax[b]) {
                    blockMax[b] = value;
                }
            }
        }

        this.blockMin = blockMin;
        this.blockMax = blockMax;

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
    private ensureResources(hairline: boolean, markers: boolean): void {
        // The pipelines share one bind group layout, so switching between
        // them leaves the bind group valid.
        this.pipeline = GPUContext.pipeline(
            hairline ? 'boost2-hairline' : 'boost2-line',
            (device, format, layout): GPURenderPipeline => buildPipeline(
                device, format, layout, LineShader,
                hairline ? 'vsHairline' : 'vsLine',
                hairline ? 'fs' : 'fsLine',
                hairline ? 'line-strip' : 'triangle-strip'
            )
        );

        if (markers) {
            this.markerPipeline = GPUContext.pipeline(
                'boost2-marker',
                (device, format, layout): GPURenderPipeline => buildPipeline(
                    device, format, layout, MarkerShader,
                    'vsMarker', 'fsMarker', 'triangle-strip'
                )
            );
        }

        if (!this.uniformBuffer) {
            this.uniformBuffer = GPUContext.createUniformBuffer(UNIFORM_BYTES);
        }

        if (!this.bindGroup) {
            this.bindGroup = GPUContext.device!.createBindGroup({
                layout: GPUContext.bindGroupLayout(),
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
        // A single point still carries a marker. The line primitives need
        // two vertices and draw nothing below that on their own.
        if (!GPUContext.ready || !this.buffer || !this.count) {
            return;
        }

        const start = performance.now(),
            series = this.series,
            chart = series.chart,
            options = series.options,
            lineWidth = options.lineWidth ?? 2,
            hairline = options.boostHairline === true,
            markers = markersEnabled(series),
            // How far a shape may reach past the plot box: a marker
            // centred on the edge, and nothing else.
            overflow = markers ?
                Math.ceil((options.marker?.radius ?? 4) + 1) :
                0;

        // Nothing to draw. A surface is still needed if one exists, so
        // that output from an earlier width is cleared.
        if (lineWidth <= 0 && !markers && !this.surface) {
            return;
        }

        this.surface ||= new GPUSurface(series, series.group!);
        this.surface.layout(overflow);

        // Markers leave the marker group empty again when they turn off,
        // which is what the core reads to detect a series without them.
        if (markers) {
            this.markerSurface ||= new GPUSurface(series, series.markerGroup!);
            this.markerSurface.layout(overflow);
        } else if (this.markerSurface) {
            this.markerSurface.destroy();
            this.markerSurface = void 0;
        }

        this.ensureResources(hairline, markers);

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
        uniforms[8] = this.surface.width;
        uniforms[9] = this.surface.height;
        const ratio = win.devicePixelRatio || 1;

        uniforms[10] = lineWidth * ratio / 2;
        uniforms[11] = this.count;
        uniforms[12] = (options.marker?.radius ?? 4) * ratio;
        uniforms[13] = this.surface.pad;

        const device = GPUContext.device!;
        device.queue.writeBuffer(this.uniformBuffer!, 0, uniforms);

        const encoder = device.createCommandEncoder(),
            pass = this.surface.beginPass(encoder);

        pass.setBindGroup(0, this.bindGroup!);

        if (lineWidth > 0) {
            pass.setPipeline(this.pipeline!);
            pass.draw(hairline ? this.count : this.count * 4);
        }

        pass.end();

        if (this.markerSurface) {
            const markerPass = this.markerSurface.beginPass(encoder);

            markerPass.setBindGroup(0, this.bindGroup!);
            markerPass.setPipeline(this.markerPipeline!);
            markerPass.draw(4, this.count);
            markerPass.end();
        }

        device.queue.submit([encoder.finish()]);

        this.stats.draws++;
        this.stats.drawMs = performance.now() - start;
    }

    /**
     * Lowest and highest y over the rows the core would scan.
     *
     * The rows in view form one range of the sorted x column, so its ends
     * come from a binary search and the inside is read one block at a
     * time. A cropped table is already that range, offset by `cropStart`.
     *
     * The core keeps one point beyond each edge, which the range mirrors.
     * @internal
     */
    public extremes(): DataExtremesObject {
        const series = this.series,
            xAxis = series.xAxis,
            xData = series.getColumn('x'),
            yData = series.getColumn('y'),
            cropStart = series.cropped ? (series.cropStart || 0) : 0,
            rowCount = series.dataTable.getModified().rowCount;

        let lo = cropStart,
            hi = cropStart + rowCount - 1;

        if (!series.cropped && xAxis) {
            const { min, max } = xAxis.getExtremes();

            lo = Math.max(0, lowerBound(xData, min) - 1);
            hi = Math.min(xData.length - 1, upperBound(xData, max) + 1);
        }

        let dataMin = Infinity,
            dataMax = -Infinity;

        const scan = (from: number, to: number): void => {
            for (let i = from; i <= to; i++) {
                const value = yData[i];

                if (isNumber(value)) {
                    if (value < dataMin) {
                        dataMin = value;
                    }
                    if (value > dataMax) {
                        dataMax = value;
                    }
                }
            }
        };

        const firstWhole = Math.ceil(lo / BLOCK),
            lastWhole = Math.floor((hi + 1) / BLOCK) - 1;

        if (lastWhole < firstWhole) {
            scan(lo, hi);
        } else {
            scan(lo, firstWhole * BLOCK - 1);

            for (let b = firstWhole; b <= lastWhole; b++) {
                if (this.blockMin[b] < dataMin) {
                    dataMin = this.blockMin[b];
                }
                if (this.blockMax[b] > dataMax) {
                    dataMax = this.blockMax[b];
                }
            }

            scan((lastWhole + 1) * BLOCK, hi);
        }

        return {
            dataMin: dataMin === Infinity ? void 0 : dataMin,
            dataMax: dataMax === -Infinity ? void 0 : dataMax
        };
    }

    /**
     * Nearest point by x, without a k-d tree or mock points. Requires the
     * sorted x column that `isSupported` enforces.
     * @internal
     */
    public hitAt(e: PointerEvent): (Point|undefined) {
        const series = this.series,
            xData = series.getColumn('x');

        if (!xData.length) {
            return void 0;
        }

        // Chart coordinates: `toValue` subtracts the axis position itself.
        const value = series.xAxis.toValue(e.chartX);

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

        return this.materialize(low, e);
    }

    /**
     * Creates the `Point` for a single hit. `clientX`, `dist` and `distX`
     * carry the k-d tree contract that `Pointer.findNearestKDPoint` ranks
     * the series by.
     *
     * @internal
     */
    private materialize(index: number, e: PointerEvent): Point {
        const series = this.series,
            { xAxis, yAxis } = series,
            xData = series.getColumn('x'),
            yData = series.getColumn('y'),
            x = xData[index],
            y = yData[index],
            PointClass = series.pointClass,
            point = new PointClass(series, [x, y], x),
            plotX = xAxis.toPixels(x, true),
            // A null value has no position; the search treats its
            // contribution along y as zero rather than as a distance.
            plotY = isNumber(y) ? yAxis.toPixels(y, true) : void 0;

        point.index = index;
        point.category = x as unknown as string;
        point.key = point.category;
        point.plotX = point.clientX = plotX;
        point.plotY = plotY;
        point.isInside = series.isPointInside(point);

        const dx = e.chartX - xAxis.pos - plotX,
            dy = isNumber(plotY) ? e.chartY - yAxis.pos - plotY : 0;

        point.dist = Math.sqrt(dx * dx + dy * dy);
        point.distX = Math.abs(dx);

        return point;
    }

    /** @internal */
    public destroy(): void {
        this.buffer?.destroy();
        this.uniformBuffer?.destroy();
        this.surface?.destroy();
        this.markerSurface?.destroy();
        this.buffer = this.uniformBuffer = void 0;
        this.bindGroup = void 0;
        this.surface = this.markerSurface = void 0;
    }

}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export { markersEnabled };
export default LineStrategy;
