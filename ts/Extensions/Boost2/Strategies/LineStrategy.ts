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
import type {
    DataLabelsFilterOptionsObject
} from '../../../Core/Series/DataLabelOptions';
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
import { defined, isNumber, splat } from '../../../Shared/Utilities.js';

/* *
 *
 *  Constants
 *
 * */

/**
 * Everything `struct U` of the shaders holds, under the names it gives
 * them. A field added there is a compile error here until supplied.
 *
 * @internal
 */
interface Uniforms {
    origin: [number, number];
    scale: [number, number];
    span: [number, number];
    viewport: [number, number];
    halfWidth: number;
    radius: number;
    ordSlope: number;
    ordOffset: number;
    count: number;
    zoneCount: number;
    step: number;
    swap: number;
    dash: Array<number>;
    dashPeriod: number;
    fillColor: Color.RGBA;
    lineColor: Color.RGBA;
    stroke: number;
    paint: number;
}

/**
 * A hundred and fifty-two bytes of content, rounded up because a struct
 * in the uniform address space takes an alignment of 16.
 */
const UNIFORM_BYTES = 160;

/** Dash runs the uniform holds, as two vec4f. */
const DASH_SLOTS = 8;

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

    const key = (win.matchMedia?.('(prefers-color-scheme: dark)').matches ?
            'dark' : 'light') + '|' + expression,
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

    const resolved = Color.parse(win.getComputedStyle(probe).color).rgba;

    probe.remove();

    return (colorCache[key] = resolved.every(isNumber) ?
        resolved :
        [0, 0, 0, 1] as Color.RGBA);
}

/**
 * The rule from `Series.drawPoints`, which the core keeps as an
 * expression rather than a function. `closestPointRangePx` is supplied
 * in the `translate` branch, so both read the same input.
 *
 * @internal
 */
function markersEnabled(series: Series): boolean {
    const marker = series.options.marker || {},
        xAxis = series.xAxis;

    return marker.enabled ??
        ((!xAxis || xAxis.isRadial) ? true : null) ??
        // `radius` carries the series default, as it does in the core.
        ((series.closestPointRangePx ?? -Infinity) >=
            (marker.enabledThreshold ?? 2) * (marker.radius as number));
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

/**
 * Step mode of a series, encoded as `Series.getGraphPath` encodes it.
 * The reversal it applies to the bottom of a stack has no counterpart
 * here, since a stacked series does not reach the GPU.
 *
 * @internal
 */
function stepMode(series: Series): number {
    return Math.max(0, [
        void 0,
        'right',
        'center',
        'left'
    ].indexOf(series.options.step));
}

/**
 * The runs `SVGElement.dashstyleSetter` would write, before scaling by
 * the stroke width. Empty for a solid stroke, and undefined for a
 * pattern this path cannot hold, which then falls back to SVG.
 *
 * @internal
 */
function dashRuns(style?: string): (Array<number>|undefined) {
    if (!style || style.toLowerCase() === 'solid') {
        return [];
    }

    const runs = style
        .toLowerCase()
        .replace('shortdashdotdot', '3,1,1,1,1,1,')
        .replace('shortdashdot', '3,1,1,1')
        .replace('shortdot', '1,1,')
        .replace('shortdash', '3,1,')
        .replace('longdash', '8,3,')
        .replace(/dot/g, '1,3,')
        .replace('dash', '4,3,')
        .replace(/,$/, '')
        .split(',')
        .map(Number);

    // An odd count repeats with on and off swapped, which the shader
    // does not do.
    return (
        runs.length <= DASH_SLOTS &&
        runs.length % 2 === 0 &&
        runs.every((run): boolean => run > 0)
    ) ? runs : void 0;
}

/**
 * The comparison of `DataLabel.applyFilter`, against a raw column value
 * rather than a point.
 *
 * @internal
 */
function passes(
    value: unknown,
    filter: DataLabelsFilterOptionsObject
): boolean {
    const v = filter.value;

    switch (filter.operator) {
        case '>': return (value as number) > (v as number);
        case '<': return (value as number) < (v as number);
        case '>=': return (value as number) >= (v as number);
        case '<=': return (value as number) <= (v as number);
        /* eslint-disable eqeqeq */
        case '==': return value == v;
        case '!=': return value != v;
        /* eslint-enable eqeqeq */
        case '===': return value === v;
        case '!==': return value !== v;
        default: return true;
    }
}

/**
 * An ordinal axis places a value at `slope * index + offset`, and for a
 * series that fills the table alone the index is its row. Cropping only
 * shifts where the rows start, so it folds into the offset.
 *
 * Reported as offsets above the lower end of the domain, like every
 * other coordinate the shader sees. A zero slope means a plain axis.
 *
 * @internal
 */
function ordinalTerms(
    series: Series,
    xMin: number
): { ordSlope: number, ordOffset: number } {
    const ordinal = series.xAxis?.ordinal;

    if (!ordinal?.positions || !isNumber(ordinal.slope)) {
        return { ordSlope: 0, ordOffset: 0 };
    }

    const slope = ordinal.slope,
        start = series.cropped ? (series.cropStart || 0) : 0;

    return {
        ordSlope: slope,
        ordOffset: (ordinal.offset || 0) - xMin - slope * start
    };
}

/**
 * How many rows of a sorted x column come before `value`, which is also
 * the index of the first row that reaches it. With `orEqual`, rows equal
 * to `value` count as before, so the result is one past the last match.
 *
 * @internal
 */
function rowsBefore(
    xData: Array<number>,
    value: number,
    orEqual?: boolean
): number {
    let low = 0,
        high = xData.length;

    while (low < high) {
        const mid = (low + high) >> 1;

        if (orEqual ? xData[mid] <= value : xData[mid] < value) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }
    return low;
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

    /**
     * The marker group keeps its own transform, so its surface needs its
     * own mapping and cannot share the one above.
     * @internal
     */
    private markerUniformBuffer?: GPUBuffer;

    /** @internal */
    private uniformBytes = new ArrayBuffer(UNIFORM_BYTES);

    /** Points carrying a label, by row. @internal */
    private labelled: Record<number, Point> = {};

    /** @internal */
    private bindGroup?: GPUBindGroup;

    /** @internal */
    private markerBindGroup?: GPUBindGroup;

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

    /**
     * Distance along the drawn path to each point, in device pixels.
     * Only a dashed series fills it; a solid one leaves it at a single
     * entry, so neither the scan nor the memory is spent.
     * @internal
     */
    private arcBuffer?: GPUBuffer;

    /** @internal */
    private arcCapacity = 0;

    /** @internal */
    private arcData = new Float32Array(0);

    /**
     * Scale the arcs were measured at. Panning leaves it alone, so only
     * a zoom pays for them again.
     * @internal
     */
    private arcScale: [number, number] = [NaN, NaN];

    /** @internal */
    private arcPeriod = NaN;

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
     * Pack the uniforms and hand them to the device. The only place
     * that knows the layout, which runs in the order the shaders
     * declare it.
     * @internal
     */
    private writeUniforms(u: Uniforms, target: GPUBuffer): void {
        const bytes = this.uniformBytes,
            floats = new Float32Array(bytes),
            ints = new Uint32Array(bytes);

        floats[0] = u.origin[0];
        floats[1] = u.origin[1];
        floats[2] = u.scale[0];
        floats[3] = u.scale[1];
        floats[4] = u.span[0];
        floats[5] = u.span[1];
        floats[6] = u.viewport[0];
        floats[7] = u.viewport[1];
        floats[8] = u.halfWidth;
        floats[9] = u.radius;
        floats[10] = u.ordSlope;
        floats[11] = u.ordOffset;
        ints[12] = u.count;
        ints[13] = u.zoneCount;
        ints[14] = u.step;
        ints[15] = u.swap;

        for (let i = 0; i < DASH_SLOTS; i++) {
            floats[16 + i] = u.dash[i] ?? 0;
        }
        ints[24] = u.dash.length;
        floats[25] = u.dashPeriod;

        for (let i = 0; i < 4; i++) {
            // Alpha already runs zero to one, the channels do not.
            floats[28 + i] = u.fillColor[i] / (i < 3 ? 255 : 1);
            floats[32 + i] = u.lineColor[i] / (i < 3 ? 255 : 1);
        }
        floats[36] = u.stroke;
        ints[37] = u.paint;

        GPUContext.device!.queue.writeBuffer(target, 0, bytes);
    }

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

        // The rows behind the arcs are about to change.
        this.arcScale = [NaN, NaN];

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
            this.bindGroup = this.markerBindGroup = void 0;
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
            this.bindGroup = this.markerBindGroup = void 0;
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
            this.bindGroup = this.markerBindGroup = void 0;
        }

        GPUContext.device!.queue.writeBuffer(this.zoneBuffer!, 0, data);

        return count > 1;
    }

    /** @internal */
    private ensureResources(
        hairline: boolean,
        markers: boolean,
        zoned: boolean,
        dashed: boolean
    ): void {
        const suffix = zoned ? '-zoned' : '',
            // One entry stands in for a solid stroke, which reads none.
            arcBytes = Math.max(4, dashed ? this.count * 4 : 0);

        if (!this.arcBuffer || this.arcCapacity !== arcBytes) {
            this.arcBuffer?.destroy();
            this.arcBuffer = GPUContext.createStorageBuffer(arcBytes);
            this.arcCapacity = arcBytes;
            this.arcScale = [NaN, NaN];
            this.bindGroup = this.markerBindGroup = void 0;
        }

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

        this.uniformBuffer ||= GPUContext.createUniformBuffer(UNIFORM_BYTES);
        this.bindGroup ||= this.buildBindGroup(this.uniformBuffer);

        if (markers) {
            this.markerUniformBuffer ||=
                GPUContext.createUniformBuffer(UNIFORM_BYTES);
            this.markerBindGroup ||=
                this.buildBindGroup(this.markerUniformBuffer);
        }
    }

    /** Everything but the uniforms is shared between the two. @internal */
    private buildBindGroup(uniforms: GPUBuffer): GPUBindGroup {
        return GPUContext.device!.createBindGroup({
            layout: GPUContext.bindGroupLayout(),
            entries: [
                { binding: 0, resource: { buffer: uniforms } },
                { binding: 1, resource: { buffer: this.buffer! } },
                { binding: 2, resource: { buffer: this.zoneBuffer! } },
                { binding: 3, resource: { buffer: this.originBuffer! } },
                { binding: 4, resource: { buffer: this.arcBuffer! } }
            ]
        });
    }

    /**
     * Distance along the drawn path to each point, in device pixels.
     * Measured on screen, so it is taken again whenever the mapping
     * changes, and a null restarts it the way a new subpath restarts
     * the pattern in SVG.
     *
     * @internal
     */
    private placeArcs(
        scaleX: number,
        scaleY: number,
        ordSlope: number,
        stepped: boolean,
        period: number
    ): void {
        if (
            this.arcScale[0] === scaleX &&
            this.arcScale[1] === scaleY &&
            this.arcPeriod === period &&
            this.arcData.length >= this.count
        ) {
            return;
        }
        this.arcScale = [scaleX, scaleY];
        this.arcPeriod = period;

        const series = this.series,
            xData = series.getColumn('x'),
            yData = series.getColumn('y'),
            length = Math.min(xData.length, yData.length),
            connect = !!series.options.connectNulls,
            // An ordinal axis spaces points by index, so every segment
            // reaches the same way along x.
            ordStep = Math.abs(ordSlope * scaleX),
            // A reciprocal, so the wrap below costs a multiply rather
            // than a division on every row.
            perPeriod = 1 / period;

        if (this.arcData.length < this.count) {
            this.arcData = new Float32Array(this.count);
        }

        const arcs = this.arcData;

        let at = 0,
            total = 0,
            prevX = 0,
            prevY = 0,
            open = false;

        for (let i = 0; i < length; i++) {
            const value = yData[i];

            if (!isNumber(value)) {
                if (connect) {
                    continue;
                }
                // The null breaks the strip, so the pattern starts over.
                arcs[at++] = 0;
                total = 0;
                open = false;
                continue;
            }

            const px = xData[i] * scaleX,
                py = value * scaleY;

            if (open) {
                const dx = ordSlope ? ordStep : Math.abs(px - prevX),
                    dy = Math.abs(py - prevY);

                total += stepped ? dx + dy : Math.sqrt(dx * dx + dy * dy);
            }

            // Only the place within the pattern matters, and the whole
            // length does not survive f32 on a long series.
            arcs[at++] = total - period * Math.floor(total * perPeriod);
            prevX = px;
            prevY = py;
            open = true;
        }

        GPUContext.device!.queue.writeBuffer(
            this.arcBuffer!, 0, arcs.subarray(0, at)
        );
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
            marker = options.marker || {},
            // The outline straddles the edge, so half of it counts.
            stroke = markers ? (marker.lineWidth ?? 0) : 0,
            // How far a shape may reach past the plot box: a marker
            // centerd on the edge, and nothing else.
            overflow = markers ?
                Math.ceil((marker.radius ?? 4) + stroke / 2 + 1) :
                0;

        // Nothing to draw. A surface is still needed if one exists, so
        // that output from an earlier width is cleared.
        if (lineWidth <= 0 && !markers && !this.surface) {
            return;
        }

        this.surface ||= new GPUSurface(series, series.group!);
        this.surface.layout(overflow);

        // The core rotates the series group on an inverted chart but
        // leaves the marker group upright, so the two surfaces do not
        // share a space there.
        const swap = series.chart.inverted === true;

        // Markers leave the marker group empty again when they turn off,
        // which is what the core reads to detect a series without them.
        if (markers) {
            this.markerSurface ||= new GPUSurface(series, series.markerGroup!);
            this.markerSurface.layout(overflow, swap);
        } else if (this.markerSurface) {
            this.markerSurface.destroy();
            this.markerSurface = void 0;
        }

        const ratio = win.devicePixelRatio || 1,
            dash = (dashRuns(options.dashStyle) as Array<number>).map(
                (run): number => run * lineWidth * ratio
            );

        this.ensureResources(
            hairline, markers, this.buildZones(), dash.length > 0
        );

        const { xAxis, yAxis } = series,
            xMin = xAxis.min as number,
            xMax = xAxis.max as number,
            yMin = yAxis.min as number,
            yMax = yAxis.max as number,
            spanX = xMax - xMin,
            spanY = yMax - yMin,
            pad = this.surface.pad,
            height = this.surface.height,
            step = stepMode(series);

        this.placeOrigins(xMin, yMin);

        // Both ends come from the axis, so a reversed one needs no case
        // of its own: it returns them the other way round and the scale
        // below comes out negative. `translate` is what the core uses
        // for `plotX` and `plotY`, the space a series group holds.
        const plotXLow = xAxis.translate(xMin, false, false, false, true),
            plotXHigh = xAxis.translate(xMax, false, false, false, true),
            plotYLow = yAxis.translate(yMin, false, true, false, true),
            plotYHigh = yAxis.translate(yMax, false, true, false, true),
            // Canvas rows run up from the bottom, group rows down from
            // the top.
            xLow = pad + plotXLow * ratio,
            xHigh = pad + plotXHigh * ratio,
            yLow = height - pad - plotYLow * ratio,
            yHigh = height - pad - plotYHigh * ratio,
            shared = {
                span: [spanX, spanY] as [number, number],
                halfWidth: lineWidth * ratio / 2,
                radius: (options.marker?.radius ?? 4) * ratio,
                ...ordinalTerms(series, xMin),
                count: this.count,
                zoneCount: this.zoneCount,
                step,
                dash,
                dashPeriod: dash.reduce((sum, run): number => sum + run, 0),
                // Unset leaves the zone color in place, which the flags
                // below tell the shader.
                fillColor: resolveColor(
                    (marker.fillColor as string) || '#000000',
                    series.chart.container
                ),
                lineColor: resolveColor(
                    (marker.lineColor as string) || '#000000',
                    series.chart.container
                ),
                stroke: stroke * ratio,
                paint: (marker.fillColor ? 1 : 0) +
                    (marker.lineColor ? 2 : 0)
            },
            scaleX = (xHigh - xLow) / spanX,
            scaleY = (yHigh - yLow) / spanY;

        if (dash.length) {
            this.placeArcs(
                scaleX, scaleY, shared.ordSlope, step !== 0,
                shared.dashPeriod
            );
        }

        this.writeUniforms({
            ...shared,
            origin: [xLow, yLow],
            scale: [scaleX, scaleY],
            viewport: [this.surface.width, height],
            swap: 0
        }, this.uniformBuffer!);

        if (this.markerSurface) {
            const surface = this.markerSurface,
                // Where `Point.pos` puts a marker when the group it
                // hangs in is left upright: both axes measured from
                // their far end, and swapped.
                mx = swap ?
                    [
                        surface.pad + (yAxis.len - plotYLow) * ratio,
                        surface.pad + (yAxis.len - plotYHigh) * ratio
                    ] :
                    [xLow, xHigh],
                my = swap ?
                    [
                        surface.height - surface.pad -
                            (xAxis.len - plotXLow) * ratio,
                        surface.height - surface.pad -
                            (xAxis.len - plotXHigh) * ratio
                    ] :
                    [yLow, yHigh],
                // A swapped surface takes x from the domain y and back.
                spans = swap ? [spanY, spanX] : [spanX, spanY];

            this.writeUniforms({
                ...shared,
                origin: [mx[0], my[0]],
                scale: [
                    (mx[1] - mx[0]) / spans[0],
                    (my[1] - my[0]) / spans[1]
                ],
                viewport: [surface.width, surface.height],
                swap: swap ? 1 : 0
            }, this.markerUniformBuffer!);
        }

        const device = GPUContext.device!,
            encoder = device.createCommandEncoder(),
            pass = this.surface.beginPass(encoder);

        pass.setBindGroup(0, this.bindGroup!);

        if (lineWidth > 0) {
            const vertices = step === 0 || this.count < 2 ?
                this.count :
                this.count * (step === 2 ? 3 : 2) - (step === 2 ? 2 : 1);

            pass.setPipeline(this.pipeline!);
            pass.draw(hairline ? vertices : vertices * 4);
        }

        pass.end();

        if (this.markerSurface) {
            const markerPass = this.markerSurface.beginPass(encoder);

            markerPass.setBindGroup(0, this.markerBindGroup!);
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

            lo = Math.max(0, rowsBefore(xData, min) - 1);
            hi = Math.min(xData.length - 1, rowsBefore(xData, max, true));
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
        // An inverted chart lays the x axis down the screen.
        const value = series.xAxis.toValue(
            series.chart.inverted ? e.chartY : e.chartX
        );

        let low = Math.min(rowsBefore(xData, value), xData.length - 1);

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
            inverted = series.chart.inverted,
            // The pointer in the terms `place` puts the points in, as
            // `Series.searchPoint` maps it.
            cx = inverted ?
                xAxis.len - e.chartY + xAxis.pos : e.chartX - xAxis.pos,
            cy = inverted ?
                yAxis.len - e.chartX + yAxis.pos : e.chartY - yAxis.pos,
            plotX = (value: number): number =>
                xAxis.translate(value, false, false, false, true),
            plotY = (value: number): number =>
                yAxis.translate(value, false, true, false, true);

        let best = seed,
            bestDist = Infinity;

        const scan = (b: number): void => {
            const to = Math.min(b * BLOCK + BLOCK - 1, last);

            for (let i = b * BLOCK; i <= to; i++) {
                const value = yData[i];

                if (isNumber(value)) {
                    const dx = plotX(xData[i]) - cx,
                        dy = plotY(value) - cy,
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
                left = plotX(xData[b * BLOCK]),
                right = plotX(xData[to]),
                dx = Math.max(
                    0, Math.min(left, right) - cx,
                    cx - Math.max(left, right)
                );

            if (dx >= bestDist) {
                return dx;
            }

            const low = this.blockMin[b],
                high = this.blockMax[b];

            // An empty block holds no y at all.
            if (low <= high) {
                const near = plotY(high),
                    far = plotY(low),
                    dy = Math.max(
                        0,
                        Math.min(near, far) - cy,
                        cy - Math.max(near, far)
                    );

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
     * Put a point where the axes currently place it. Separate from
     * creating it, since a point kept for a label outlives the zoom it
     * was created in.
     *
     * @internal
     */
    private place(point: Point, index: number): void {
        const series = this.series,
            { xAxis, yAxis } = series,
            y = series.getColumn('y')[index],
            // The core's own terms, which differ from `toPixels` on an
            // inverted chart: there the axes change which way they run
            // but these two stay in the space the series group holds.
            plotX = xAxis.translate(
                series.getColumn('x')[index], false, false, false, true
            );

        // A null value has no position; the hit test treats its
        // contribution along y as zero rather than as a distance.
        point.plotX = point.clientX = plotX;
        point.plotY = isNumber(y) ?
            yAxis.translate(y, false, true, false, true) :
            void 0;
        point.isInside = series.isPointInside(point);

        // The hover state and the label are drawn in SVG from the color
        // of the point, which is the zone's rather than the series' one.
        point.zone = series.zones.length ? point.getZone() : void 0;
    }

    /** The `Point` for one row of the series. @internal */
    private pointAt(index: number): Point {
        const series = this.series,
            x = series.getColumn('x')[index],
            PointClass = series.pointClass,
            point = new PointClass(
                series, [x, series.getColumn('y')[index]], x
            );

        point.index = index;
        point.category = x as unknown as string;
        point.key = point.category;
        this.place(point, index);

        return point;
    }

    /**
     * The points the core should label, kept from one draw to the next:
     * it stores the label element on the point and updates it rather
     * than building a new one, so a throwaway point would leave the old
     * label behind.
     *
     * @internal
     */
    public labelPoints(): Array<Point> {
        const kept = this.labelled,
            next: Record<number, Point> = {},
            points: Array<Point> = [];

        for (const index of this.labelRows()) {
            const point = kept[index] || this.pointAt(index);

            if (kept[index]) {
                this.place(point, index);
            }
            next[index] = point;
            points.push(point);
        }

        for (const index of Object.keys(kept)) {
            if (!next[index as unknown as number]) {
                kept[index as unknown as number].destroyElements();
            }
        }

        this.labelled = next;

        return points;
    }

    /**
     * Rows that carry a label: the ones in view, narrowed by the filter
     * where it reads a column this path has. The core applies the filter
     * again, so narrowing here only saves points, never decides them.
     *
     * @internal
     */
    private labelRows(): Array<number> {
        const series = this.series,
            cropStart = series.cropped ? (series.cropStart || 0) : 0,
            rowCount = series.dataTable.getModified().rowCount,
            filter = series.options.dataLabels &&
                splat(series.options.dataLabels)[0]?.filter,
            onColumn = filter &&
                (filter.property === 'x' || filter.property === 'y'),
            column = onColumn ?
                series.getColumn(filter.property as string) :
                void 0,
            rows: Array<number> = [];

        for (let i = cropStart; i < cropStart + rowCount; i++) {
            if (!column || !filter || passes(column[i], filter)) {
                rows.push(i);
            }
        }

        return rows;
    }

    /**
     * Creates the `Point` for a single hit, with the `dist` and `distX`
     * that `Pointer.findNearestKDPoint` ranks the series by. The core
     * sets those in its k-d tree search, which this path replaces.
     *
     * @internal
     */
    private materialize(index: number, e: PointerEvent): Point {
        const { xAxis, yAxis } = this.series,
            point = this.pointAt(index),
            dx = e.chartX - xAxis.pos - (point.plotX as number),
            dy = isNumber(point.plotY) ?
                e.chartY - yAxis.pos - point.plotY :
                0;

        point.dist = Math.sqrt(dx * dx + dy * dy);
        point.distX = Math.abs(dx);

        return point;
    }

    /** @internal */
    public destroy(): void {
        for (const index of Object.keys(this.labelled)) {
            this.labelled[index as unknown as number].destroyElements();
        }
        this.labelled = {};

        this.buffer?.destroy();
        this.uniformBuffer?.destroy();
        this.markerUniformBuffer?.destroy();
        this.zoneBuffer?.destroy();
        this.originBuffer?.destroy();
        this.arcBuffer?.destroy();
        this.surface?.destroy();
        this.markerSurface?.destroy();
        this.buffer = this.uniformBuffer = void 0;
        this.markerUniformBuffer = void 0;
        this.zoneBuffer = this.originBuffer = this.arcBuffer = void 0;
        this.bindGroup = this.markerBindGroup = void 0;
        this.surface = this.markerSurface = void 0;
    }

}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export { dashRuns, markersEnabled, stepMode, zonesSupported };
export default LineStrategy;
