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
import { BLOCK, BLOCK_SHIFT } from '../Shaders/Prelude.js';
import { defined, isNumber } from '../../../Shared/Utilities.js';

/* *
 *
 *  Constants
 *
 * */

/**
 * Uniform buffer size: the domain span, then the viewport, half width,
 * point count, marker radius, margin and zone count, padded to the 16
 * byte struct alignment.
 */
const UNIFORM_BYTES = 48;

/** Bytes per zone: a vec4f color and a value, at vec4f alignment. */
const ZONE_BYTES = 32;

/** Bytes per block origin: its distance from the domain minimum. */
const ORIGIN_BYTES = 8;

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

/**
 * Whether the zones of a series are ones this module can draw: bands of
 * the y domain carrying nothing but a color. The last one stands for
 * everything above the rest and needs no value of its own.
 *
 * @internal
 */
function zonesSupported(series: Series): boolean {
    const zones = series.zones;

    return series.zoneAxis === 'y' && zones.every(
        (zone, i): boolean => (
            (i === zones.length - 1 || isNumber(zone.value)) &&
            // The last zone carries no color when it stands for the
            // color of the series, which is how `negativeColor` arrives.
            (
                typeof zone.color === 'string' ||
                (i === zones.length - 1 && !defined(zone.color))
            ) &&
            !zone.dashStyle &&
            !zone.fillColor
        )
    );
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

/**
 * `max` composes overlapping coverage of one color without the fringes
 * adding up, but it mixes channels where two colors meet, so a zoned
 * series falls back to ordinary source-over blending.
 *
 * @internal
 */
function buildPipeline(
    device: GPUDevice,
    format: GPUTextureFormat,
    layout: GPUPipelineLayout,
    code: string,
    vertexEntry: string,
    fragmentEntry: string,
    topology: GPUPrimitiveTopology,
    zoned: boolean
): GPURenderPipeline {
    const module = device.createShaderModule({ code }),
        blendComponent: GPUBlendComponent = zoned ?
            { srcFactor: 'one', dstFactor: 'one-minus-src-alpha' } :
            { srcFactor: 'one', dstFactor: 'one', operation: 'max' };

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
    public stats = {
        uploads: 0,
        draws: 0,
        buildMs: 0,
        drawMs: 0,
        spreadX: 0,
        spreadY: 0
    };

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
     * Whether the uploaded buffer had its nulls dropped. Toggling the
     * option leaves the columns untouched, so identity alone would miss
     * the change.
     * @internal
     */
    private sourceConnect?: boolean;

    /**
     * Lowest and highest y of each block of rows, built with the buffer.
     * @internal
     */
    private blockMin = new Float64Array(0);

    /** @internal */
    private blockMax = new Float64Array(0);

    /** @internal */
    private zoneBuffer?: GPUBuffer;

    /** @internal */
    private zoneCount = 0;

    /** @internal */
    private originBuffer?: GPUBuffer;

    /** @internal */
    private originCapacity = 0;

    /**
     * Origin of each block, in data units and double precision. Their
     * distance from the domain minimum is what reaches the GPU, and it
     * changes with every zoom.
     * @internal
     */
    private blockOriginX = new Float64Array(0);

    /** @internal */
    private blockOriginY = new Float64Array(0);

    /** @internal */
    private originData = new Float32Array(0);


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

        // Nulls are dropped rather than uploaded, which closes the gap
        // they would otherwise leave in the strip.
        const connect = !!series.options.connectNulls;

        if (
            xData === this.sourceX &&
            yData === this.sourceY &&
            connect === this.sourceConnect
        ) {
            this.stats.buildMs = performance.now() - start;
            return;
        }

        const flat = new Float32Array(length * 2),
            originBlocks = Math.max(1, Math.ceil(length / BLOCK)),
            originX = new Float64Array(originBlocks),
            originY = new Float64Array(originBlocks),
            blocks = Math.ceil(length / BLOCK),
            blockMin = new Float64Array(blocks).fill(Infinity),
            blockMax = new Float64Array(blocks).fill(-Infinity);

        let written = 0,
            baseX = 0,
            baseY = 0,
            spreadX = 0,
            spreadY = 0;

        for (let i = 0; i < length; i++) {
            const value = yData[i];

            // The index stays in step with the rows of the series, which
            // is what the extremes and the hit test are expressed in.
            if (isNumber(value)) {
                const b = i >> BLOCK_SHIFT;

                if (value < blockMin[b]) {
                    blockMin[b] = value;
                }
                if (value > blockMax[b]) {
                    blockMax[b] = value;
                }
            } else if (connect) {
                continue;
            }

            // Each block of the buffer carries its own origin, so the
            // offsets stay small enough for f32 however large the data.
            if (!(written & (BLOCK - 1))) {
                const at = written >> BLOCK_SHIFT;

                baseX = originX[at] = xData[i];
                baseY = originY[at] = isNumber(value) ? value : 0;
            }

            const offsetX = xData[i] - baseX,
                offsetY = isNumber(value) ? value - baseY : NaN;

            spreadX = Math.max(spreadX, Math.abs(offsetX));
            if (isNumber(value)) {
                spreadY = Math.max(spreadY, Math.abs(offsetY));
            }

            flat[written * 2] = offsetX;
            // Null and undefined become NaN, which breaks the strip.
            flat[written * 2 + 1] = offsetY;
            written++;
        }

        this.blockMin = blockMin;
        this.blockMax = blockMax;

        const bytes = Math.max(32, written * 8);

        if (!this.buffer || this.capacity < bytes) {
            this.buffer?.destroy();
            this.buffer = GPUContext.createStorageBuffer(bytes);
            this.capacity = bytes;
            this.bindGroup = void 0;
        }

        GPUContext.device!.queue.writeBuffer(
            this.buffer, 0, flat.subarray(0, written * 2)
        );

        const used = Math.max(1, Math.ceil(written / BLOCK)),
            originBytes = Math.max(ORIGIN_BYTES, used * ORIGIN_BYTES);

        if (!this.originBuffer || this.originCapacity < originBytes) {
            this.originBuffer?.destroy();
            this.originBuffer = GPUContext.createStorageBuffer(originBytes);
            this.originCapacity = originBytes;
            this.bindGroup = void 0;
        }

        this.blockOriginX = originX.subarray(0, used);
        this.blockOriginY = originY.subarray(0, used);
        this.originData = new Float32Array(used * 2);

        // The largest offset an entry of the buffer holds. Precision in
        // pixels is this times 2^-24 over the units a pixel covers, so it
        // is what tells whether the block origins are tight enough.
        this.stats.spreadX = spreadX;
        this.stats.spreadY = spreadY;

        this.count = written;
        this.sourceX = xData;
        this.sourceY = yData;
        this.sourceConnect = connect;
        this.stats.uploads++;
        this.stats.buildMs = performance.now() - start;
    }

    /**
     * Put the marker surface in place before the series renders.
     *
     * `Series.animate` reveals the marker group along with the graph
     * only when it already holds something, which it reads once, before
     * anything is drawn. A surface created later leaves the group with
     * the entrance clip applied and never advanced, so the markers stay
     * hidden until the animation ends.
     * @internal
     */
    public prepareMarkers(): void {
        const series = this.series;

        if (!GPUContext.ready || !markersEnabled(series)) {
            return;
        }

        series.markerGroup ||= series.plotGroup(
            'markerGroup',
            'markers',
            series.visible ? 'inherit' : 'hidden',
            series.options.zIndex,
            series.chart.seriesGroup
        );

        this.markerSurface ||= new GPUSurface(series, series.markerGroup);
    }

    /**
     * Upload where each block sits above the lower end of the domain.
     *
     * The subtraction happens here, in double precision, rather than in
     * the shader: cancelling two large floats there relies on the
     * compiler keeping the order of the additions, which it is free not
     * to do, and a reassociated sum loses every digit the split was
     * meant to save.
     * @internal
     */
    private placeOrigins(xMin: number, yMin: number): void {
        const data = this.originData,
            originX = this.blockOriginX,
            originY = this.blockOriginY;

        for (let b = 0; b < originX.length; b++) {
            data[b * 2] = originX[b] - xMin;
            data[b * 2 + 1] = originY[b] - yMin;
        }

        GPUContext.device!.queue.writeBuffer(this.originBuffer!, 0, data);
    }

    /**
     * Upload the zones, always at least one: the last stands for the
     * color of the series and has no bound, so an unzoned series needs
     * no case of its own. Reports whether more than one color applies.
     * @internal
     */
    private buildZones(): boolean {
        const series = this.series,
            container = series.chart.container,
            zones = series.zones,
            count = Math.max(1, zones.length),
            data = new Float32Array(count * ZONE_BYTES / 4);

        for (let i = 0; i < count; i++) {
            const zone = zones[i],
                rgba = resolveColor(
                    (zone?.color as string) || series.color as string,
                    container
                ),
                at = i * ZONE_BYTES / 4;

            data[at] = rgba[0] / 255;
            data[at + 1] = rgba[1] / 255;
            data[at + 2] = rgba[2] / 255;
            data[at + 3] = rgba[3];
            // The last zone is never compared against its value.
            // Measured from the lower end of the domain, as the shader
            // reconstructs a fragment's value.
            data[at + 4] = isNumber(zone?.value) ?
                zone.value - (series.yAxis.min as number) :
                Infinity;
        }

        if (this.zoneCount !== count) {
            this.zoneBuffer?.destroy();
            this.zoneBuffer = GPUContext.createStorageBuffer(
                count * ZONE_BYTES
            );
            this.zoneCount = count;
            this.bindGroup = void 0;
        }

        GPUContext.device!.queue.writeBuffer(this.zoneBuffer!, 0, data);

        return count > 1;
    }

    /** @internal */
    private ensureResources(
        hairline: boolean,
        markers: boolean,
        zoned: boolean
    ): void {
        const suffix = zoned ? '-zoned' : '';

        // The pipelines share one bind group layout, so switching between
        // them leaves the bind group valid.
        this.pipeline = GPUContext.pipeline(
            (hairline ? 'boost2-hairline' : 'boost2-line') + suffix,
            (device, format, layout): GPURenderPipeline => buildPipeline(
                device, format, layout, LineShader,
                hairline ? 'vsHairline' : 'vsLine',
                hairline ? 'fs' : 'fsLine',
                hairline ? 'line-strip' : 'triangle-strip',
                zoned
            )
        );

        if (markers) {
            this.markerPipeline = GPUContext.pipeline(
                'boost2-marker' + suffix,
                (device, format, layout): GPURenderPipeline => buildPipeline(
                    device, format, layout, MarkerShader,
                    'vsMarker', 'fsMarker', 'triangle-strip', zoned
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
                    { binding: 1, resource: { buffer: this.buffer! } },
                    { binding: 2, resource: { buffer: this.zoneBuffer! } },
                    { binding: 3, resource: { buffer: this.originBuffer! } }
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
            options = series.options,
            lineWidth = options.lineWidth ?? 2,
            hairline = options.boostHairline === true,
            markers = markersEnabled(series),
            // How far a shape may reach past the plot box: a marker
            // centerd on the edge, and nothing else.
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

        const zoned = this.buildZones();

        this.ensureResources(hairline, markers, zoned);

        const { xAxis, yAxis } = series,
            uniforms = this.uniformData;

        const xMin = xAxis.min as number,
            yMin = yAxis.min as number,
            ratio = win.devicePixelRatio || 1;

        this.placeOrigins(xMin, yMin);

        uniforms[0] = (xAxis.max as number) - xMin;
        uniforms[1] = (yAxis.max as number) - yMin;
        uniforms[2] = this.surface.width;
        uniforms[3] = this.surface.height;
        uniforms[4] = lineWidth * ratio / 2;
        uniforms[5] = this.count;
        uniforms[6] = (options.marker?.radius ?? 4) * ratio;
        uniforms[7] = this.surface.pad;
        uniforms[8] = this.zoneCount;

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
     * Nearest point, without a k-d tree or mock points. Requires the
     * sorted x column that `isSupported` enforces.
     *
     * `compareX` carries the contract of `Series.searchPoint`: by x alone
     * when set, by plane distance otherwise, which is what
     * `findNearestPointBy: 'xy'` and a shared tooltip ask for.
     * @internal
     */
    public hitAt(e: PointerEvent, compareX?: boolean): (Point|undefined) {
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

        if (!series.options.nullInteraction) {
            low = this.firstValid(low, value);
        }

        return this.materialize(
            compareX ? low : this.nearest(low, e),
            e
        );
    }

    /**
     * The row nearest to `from` that carries a value, since the k-d tree
     * of the core is built from valid points alone.
     * @internal
     */
    private firstValid(from: number, value: number): number {
        const series = this.series,
            xData = series.getColumn('x'),
            yData = series.getColumn('y'),
            last = xData.length - 1;

        if (isNumber(yData[from])) {
            return from;
        }

        for (let step = 1; step <= last; step++) {
            const low = from - step,
                high = from + step,
                lowOk = low >= 0 && isNumber(yData[low]),
                highOk = high <= last && isNumber(yData[high]);

            if (lowOk && highOk) {
                return Math.abs(xData[low] - value) <=
                    Math.abs(xData[high] - value) ? low : high;
            }
            if (lowOk) {
                return low;
            }
            if (highOk) {
                return high;
            }
            if (low < 0 && high > last) {
                break;
            }
        }

        return from;
    }

    /**
     * Nearest point in the plane, seeded by the nearest in x.
     *
     * Blocks of the min/max index carry an x interval and a y interval, so
     * the distance to the nearest corner of that rectangle bounds every
     * point inside it from below. A block beyond the bound is skipped
     * whole, and since x is sorted, the first block whose horizontal
     * distance alone exceeds the best ends the walk on that side.
     * @internal
     */
    private nearest(seed: number, e: PointerEvent): number {
        const series = this.series,
            { xAxis, yAxis } = series,
            xData = series.getColumn('x'),
            yData = series.getColumn('y'),
            last = xData.length - 1,
            cx = e.chartX - xAxis.pos,
            cy = e.chartY - yAxis.pos;

        let best = seed,
            bestDist = Infinity;

        const scan = (b: number): void => {
            const to = Math.min(b * BLOCK + BLOCK - 1, last);

            for (let i = b * BLOCK; i <= to; i++) {
                const value = yData[i];

                if (isNumber(value)) {
                    const dx = xAxis.toPixels(xData[i], true) - cx,
                        dy = yAxis.toPixels(value, true) - cy,
                        dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < bestDist) {
                        bestDist = dist;
                        best = i;
                    }
                }
            }
        };

        // Scans the block when it may hold something nearer, and reports
        // its horizontal distance, which only grows away from the seed.
        const visit = (b: number): number => {
            const to = Math.min(b * BLOCK + BLOCK - 1, last),
                left = xAxis.toPixels(xData[b * BLOCK], true),
                right = xAxis.toPixels(xData[to], true),
                dx = Math.max(0, left - cx, cx - right);

            if (dx >= bestDist) {
                return dx;
            }

            const low = this.blockMin[b],
                high = this.blockMax[b];

            // An empty block holds no y at all.
            if (low <= high) {
                const top = yAxis.toPixels(high, true),
                    bottom = yAxis.toPixels(low, true),
                    dy = Math.max(0, top - cy, cy - bottom);

                if (Math.sqrt(dx * dx + dy * dy) < bestDist) {
                    scan(b);
                }
            }

            return dx;
        };

        const seedBlock = seed >> BLOCK_SHIFT;

        scan(seedBlock);

        for (let b = seedBlock - 1; b >= 0; b--) {
            if (visit(b) >= bestDist) {
                break;
            }
        }

        for (let b = seedBlock + 1; b <= (last >> BLOCK_SHIFT); b++) {
            if (visit(b) >= bestDist) {
                break;
            }
        }

        return best;
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
        this.zoneBuffer?.destroy();
        this.originBuffer?.destroy();
        this.surface?.destroy();
        this.markerSurface?.destroy();
        this.buffer = this.uniformBuffer = void 0;
        this.zoneBuffer = this.originBuffer = void 0;
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
export { markersEnabled, zonesSupported };
export default LineStrategy;
