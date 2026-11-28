/* *
 *
 *  (c) 2026 Highsoft AS
 *
 *  Boost2: WebGPU renderer for series marks.
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

import type Chart from '../../Core/Chart/Chart';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type DataExtremesObject from '../../Core/Series/DataExtremesObject';
import type Point from '../../Core/Series/Point';
import type Pointer from '../../Core/Pointer';
import type PointerEvent from '../../Core/PointerEvent';
import type Series from '../../Core/Series/Series';
import type SeriesRegistry from '../../Core/Series/SeriesRegistry';

import { animObject } from '../../Core/Animation/AnimationUtilities.js';
import GPUContext from './GPUContext.js';
import H from '../../Core/Globals.js';
const { composed } = H;
import LineStrategy, {
    dashRuns,
    markersEnabled,
    stateWidth,
    symbolIndex,
    zonesSupported
} from './Strategies/LineStrategy.js';
import { fireEvent, pushUnique, wrap } from '../../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../../Core/Series/SeriesBase' {
    /** @internal */
    interface SeriesBase {
        /**
         * GPU draw strategy. The only series field this module writes to;
         * absent means the series renders in SVG.
         * @internal
         */
        gpu?: LineStrategy;
        /**
         * Set while the series waits for the device, so that at most one
         * waiter is registered per series.
         * @internal
         */
        boost2Pending?: boolean;
    }
}

/** @internal */
declare module '../../Core/Series/SeriesOptions' {
    /** @internal */
    interface SeriesOptions {
        /**
         * Draw the graph one device pixel wide, ignoring `lineWidth` and
         * joins, from a quarter of the vertices.
         * @internal
         */
        boostHairline?: boolean;
    }
}

/* *
 *
 *  Constants
 *
 * */

/**
 * Point count above which the GPU path is used, when `boostThreshold` is
 * not set. Below it the fixed setup cost outweighs the gain.
 * @internal
 */
const DEFAULT_THRESHOLD = 10000;

/* *
 *
 *  Functions
 *
 * */

/**
 * Capability check. A series that fails it renders in SVG rather than
 * differently.
 *
 * @internal
 */
function isSupported(series: Series): boolean {
    const options = series.options,
        // Shared with the boost module: 0 disables, 1 forces.
        threshold = options.boostThreshold ?? DEFAULT_THRESHOLD;

    if (
        threshold === 0 ||
        series.type !== 'line' ||
        // A pattern of more runs than the uniform holds, or of an odd
        // count, would be drawn as a different one.
        !dashRuns(options.dashStyle) ||
        options.stacking ||
        // `negativeColor` arrives here as a pair of zones too.
        !zonesSupported(series) ||
        // An image symbol has no distance field, and the automatic rule
        // decides by zoom whether markers appear at all.
        (markersEnabled(series) && symbolIndex(series.symbol) < 0) ||
        // `hitAt` assumes a sorted x column.
        !series.requireSorting ||
        // An ordinal axis places x by its position in a table. That is
        // the row index only while this series fills the table alone and
        // the buffer still holds every row.
        (series.xAxis?.ordinal?.positions && (
            options.connectNulls ||
            series.xAxis.ordinal.positions.length !==
                series.dataTable.getModified().rowCount
        )) ||
        // Grouping replaces the table the core reads, while this path
        // reads the raw columns, so the two would disagree on both the
        // shape and the row count.
        series.hasGroupedData ||
        series.xAxis?.logarithmic ||
        series.yAxis?.logarithmic
    ) {
        return false;
    }

    // The count in view, not of the whole series. `processData` crops
    // only above `cropThreshold`, below which the threshold has no effect.
    return series.dataTable.getModified().rowCount >= threshold;
}

/** @internal */
function isEligible(series: Series): boolean {
    return GPUContext.ready && isSupported(series);
}

/**
 * True while an eligible series waits for the device. Drawing it in SVG
 * meanwhile produces output the device would immediately replace.
 *
 * @internal
 */
function isPending(series: Series): boolean {
    return !series.gpu &&
        !GPUContext.ready &&
        !GPUContext.unavailable &&
        isSupported(series);
}

/**
 * Whether the reduced `getExtremes` contract applies. Series needing
 * `activeYData`, a custom y source, extremes from all data or non-default
 * y keys fall through to the core implementation.
 *
 * @internal
 */
function canServeExtremes(series: Series): boolean {
    const options = series.options;

    return !series.getExtremesFromAll &&
        !options.getExtremesFromAll &&
        !options.cumulative &&
        !options.stacking &&
        !series.stackedYData &&
        !series.keysAffectYAxis &&
        !series.pointArrayMap;
}

/**
 * Attach or detach the strategy by current eligibility, which zooming can
 * change at any redraw.
 *
 * Detaching restores no state, since the strategy writes none. Attaching
 * discards the SVG output of an earlier render, which `drawGraph` and
 * `drawPoints` would otherwise never reach again.
 *
 * @internal
 */
function syncStrategy(series: Series): void {
    if (isEligible(series)) {
        if (!series.gpu) {
            series.gpu = new LineStrategy(series);

            // `points` is emptied below, so nothing else reaches these.
            for (const point of series.points || []) {
                point?.destroyElements?.();
            }

            series.graph = series.graph?.destroy();
            series.area = series.area?.destroy();
            series.tracker = series.tracker?.destroy();
            series.graphPath = series.areaPath = void 0;
        }
    } else if (series.gpu) {
        series.gpu.destroy();
        series.gpu = void 0;
    }
}

/**
 * Wire the strategy into the series. Each branch belongs in `Series`
 * itself as an `if (this.gpu)` check; a module cannot change the core,
 * hence `wrap`.
 *
 * @internal
 */
function compose(
    SeriesClass: typeof Series,
    seriesTypes: typeof SeriesRegistry.seriesTypes,
    PointerClass: typeof Pointer
): void {

    if (!pushUnique(composed, 'Boost2')) {
        return;
    }

    const seriesProto = SeriesClass.prototype,
        lineProto = seriesTypes.line?.prototype;

    void GPUContext.init();

    // --- 1. translate(): runs ahead of generatePoints(), so no Point
    //        objects are created.
    wrap(seriesProto, 'translate', function (
        this: Series,
        proceed: Function
    ): void {
        const xAxis = this.xAxis;

        // The core fills this in the point walk that this path skips.
        if (xAxis && !xAxis.logarithmic) {
            this.closestPointRangePx =
                (this.closestPointRange ?? 0) * xAxis.transA;
        }

        syncStrategy(this);

        if (isPending(this) && !this.boost2Pending) {
            // `redraw()` alone does not call `translate()`, so without the
            // dirty flag eligibility would not be re-evaluated.
            const series = this;

            series.boost2Pending = true;

            GPUContext.whenReady((): void => {
                series.boost2Pending = false;

                const chart: Chart|undefined = series.chart;

                // `chart.index` is cleared when the chart is destroyed.
                if (chart && typeof chart.index !== 'undefined') {
                    series.isDirty = true;
                    chart.redraw(false);
                }
            });
        }

        if (this.gpu) {
            this.gpu.buildBuffer();
            this.points = [];
            return;
        }

        // Still waiting for the device; see `isPending`.
        if (this.boost2Pending) {
            this.points = [];
            return;
        }

        proceed.call(this);
    });

    // --- 2. drawGraph(): does not build the `d` attribute.
    if (lineProto) {
        wrap(lineProto, 'drawGraph', function (
            this: Series,
            proceed: Function
        ): void {
            if (!this.gpu && !this.boost2Pending) {
                proceed.call(this);
            }
        });
    }

    // --- 3. drawPoints(): does not create marker elements.
    wrap(seriesProto, 'drawPoints', function (
        this: Series,
        proceed: Function
    ): void {
        if (!this.gpu && !this.boost2Pending) {
            proceed.apply(this, [].slice.call(arguments, 1));
        }
    });

    // --- 4. drawDataLabels(): labels the points this module keeps for
    //        them, since `series.points` is empty by design. The core
    //        takes an explicit list, so nothing else has to change.
    wrap(seriesProto, 'drawDataLabels', function (
        this: Series,
        proceed: Function,
        points?: Array<Point>
    ): void {
        if (this.gpu && !points && this.hasDataLabels?.()) {
            proceed.call(this, this.gpu.labelPoints());
            return;
        }
        proceed.apply(this, [].slice.call(arguments, 1));
    });

    // --- 5. animate(): a series still waiting for the device has
    //        nothing to reveal, and the entrance animation settles how it
    //        treats the markers the moment it starts, with no way back.
    //        Deferring it to the render that draws keeps the two in step.
    wrap(seriesProto, 'animate', function (
        this: Series,
        proceed: Function,
        init?: boolean
    ): void {
        if (!this.boost2Pending) {
            proceed.call(this, init);
        }
    });

    // --- 6. render(): draws on the GPU instead of in SVG.
    wrap(seriesProto, 'render', function (
        this: Series,
        proceed: Function
    ): void {
        this.gpu?.prepareMarkers();
        proceed.call(this);
        this.gpu?.draw();
    });

    // --- 7. Series.setState(): the width it derives lands on
    //        `series.graph`, which this path does not keep.
    wrap(seriesProto, 'setState', function (
        this: Series,
        proceed: Function,
        state?: StatesOptionsKey,
        inherit?: boolean
    ): void {
        // Taken before the call, which assigns the new state.
        const was = this.state,
            from = stateWidth(this);

        proceed.call(this, state, inherit);

        if (this.gpu && this.state !== was) {
            this.gpu.animateWidth(from, animObject(
                this.options.states?.[this.state || 'normal']?.animation ??
                    this.chart.options.chart.animation
            ));
        }
    });

    // --- 8. Point.setState(): the shared state marker is shown at the
    //        hover size and hidden again, since only a point with its
    //        own marker takes the branch that eases between them.
    wrap(
        SeriesClass.prototype.pointClass.prototype,
        'setState',
        function (
            this: Point,
            proceed: Function,
            state?: StatesOptionsKey,
            move?: boolean
        ): void {
            // `setState` leaves the state alone where it declines.
            const was = this.state;

            proceed.apply(this, [].slice.call(arguments, 1));

            const series = this.series,
                graphic = series.stateMarkerGraphic;

            // `move` is a tooltip following a hover the core animates
            // itself. With markers hidden SVG pops the same way.
            if (
                !series.gpu ||
                this.state === was ||
                move ||
                !graphic ||
                !markersEnabled(series)
            ) {
                return;
            }

            const chartAnimation = series.chart.options.chart.animation,
                // The core eases the shape and the paint on separate
                // settings: the marker state carries one, the series
                // state the other.
                shape = chartAnimation ??
                    series.options.marker?.states?.[state || 'normal']
                        ?.animation,
                paint = chartAnimation ??
                    series.options.states?.[state || 'normal']?.animation;

            if (state) {
                graphic.attr(series.markerAttribs(this));
                graphic.attr(series.pointAttribs(this));
                graphic.animate(series.markerAttribs(this, state), shape);
                graphic.animate(series.pointAttribs(this, state), paint);
                return;
            }

            // Hidden by the call above, where SVG eases both back on the
            // marker the point carries. The one on the canvas is already
            // there, so hiding at the end leaves nothing to see.
            graphic.show();
            graphic.animate(series.pointAttribs(this), paint);
            graphic.animate(series.markerAttribs(this), {
                ...animObject(shape),
                complete: (): void => {
                    graphic.hide();
                }
            });
        }
    );

    // --- 9. searchPoint(): runs ahead of the lazy buildKDTree(), so the
    //        k-d tree and the mock points are never created.
    wrap(seriesProto, 'searchPoint', function (
        this: Series,
        proceed: Function,
        e: PointerEvent,
        compareX?: boolean
    ): (Point|undefined) {
        if (this.gpu) {
            // Chart coordinates: `toValue` subtracts the axis position,
            // and `axis.pos` differs from `chart.plotLeft` with panes.
            return this.gpu.hitAt(e, compareX);
        }
        return proceed.apply(this, [].slice.call(arguments, 1));
    });

    // --- 10. getHoverData(): a shared tooltip gathers the other
    //         series by scanning their points, which this path empties.
    wrap(PointerClass.prototype, 'getHoverData', function (
        this: Pointer,
        proceed: Function,
        existingHoverPoint: (Point|undefined),
        existingHoverSeries: (Series|undefined),
        series: Array<Series>,
        isDirectTouch?: boolean,
        shared?: boolean,
        e?: PointerEvent
    ): Pointer.HoverDataObject {
        const data = proceed.call(
                this, existingHoverPoint, existingHoverSeries, series,
                isDirectTouch, shared, e
            ),
            hoverPoint = data.hoverPoint;

        if (!shared || !hoverPoint || data.hoverSeries?.noSharedTooltip) {
            return data;
        }

        const points = data.hoverPoints.slice();

        for (const s of series) {
            if (
                !s.gpu ||
                !s.visible ||
                s.noSharedTooltip ||
                s.options.enableMouseTracking === false ||
                points.some((p: Point): boolean => p.series === s)
            ) {
                continue;
            }

            const point = s.gpu.pointAtX(hoverPoint.x);

            if (point) {
                points.push(point);
            }
        }

        // The tooltip lists them in the order the chart holds them.
        data.hoverPoints = points.sort((a: Point, b: Point): number =>
            series.indexOf(a.series) - series.indexOf(b.series)
        );

        return data;
    });

    // --- 11. getExtremes(): answered from the block index instead of a
    //        scan of every row in view.
    wrap(seriesProto, 'getExtremes', function (
        this: Series,
        proceed: Function,
        yData?: unknown,
        forceExtremesFromAll?: boolean
    ): DataExtremesObject {
        if (
            !this.gpu ||
            yData ||
            forceExtremesFromAll ||
            !canServeExtremes(this)
        ) {
            return proceed.apply(this, [].slice.call(arguments, 1));
        }

        const dataExtremes = this.gpu.extremes();

        fireEvent(this, 'afterGetExtremes', { dataExtremes });

        return dataExtremes;
    });

    wrap(seriesProto, 'destroy', function (
        this: Series,
        proceed: Function
    ): void {
        this.gpu?.destroy();
        this.gpu = void 0;

        proceed.apply(this, [].slice.call(arguments, 1));
    });
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
const Boost2 = {
    compose,
    isEligible,
    GPUContext
};

/** @internal */
export default Boost2;
