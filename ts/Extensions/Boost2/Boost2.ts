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
import type DataExtremesObject from '../../Core/Series/DataExtremesObject';
import type Point from '../../Core/Series/Point';
import type PointerEvent from '../../Core/PointerEvent';
import type Series from '../../Core/Series/Series';
import type SeriesRegistry from '../../Core/Series/SeriesRegistry';

import GPUContext from './GPUContext.js';
import H from '../../Core/Globals.js';
const { composed } = H;
import LineStrategy from './Pipelines/LineStrategy.js';
import {
    fireEvent,
    isNumber,
    pushUnique,
    wrap
} from '../../Shared/Utilities.js';

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
 * Capability check. False when the series type has no pipeline, the point
 * count is below the threshold, or an option is used that the strategy does
 * not support; such a series renders in SVG rather than differently.
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
        options.dashStyle ||
        options.stacking ||
        options.zones?.length ||
        options.marker?.enabled === true ||
        // `hitAt` assumes a sorted x column.
        !series.requireSorting ||
        series.chart.inverted ||
        series.xAxis?.logarithmic ||
        series.yAxis?.logarithmic
    ) {
        return false;
    }

    return series.dataTable.rowCount >= threshold;
}

/** @internal */
function isEligible(series: Series): boolean {
    return GPUContext.ready && isSupported(series);
}

/**
 * True while an eligible series waits for the device. Such a series is not
 * drawn in SVG meanwhile, since that output would be replaced as soon as
 * the device arrives.
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
 * Attach or detach the strategy according to current eligibility.
 *
 * Detaching restores no state, since the strategy writes none. Attaching
 * discards the SVG output of an earlier render: `graph`, `area` and the
 * `tracker`, a copy of the graph path used for mouse tracking. With
 * `drawGraph` suppressed nothing would update or remove them, and hit
 * testing goes through `searchPoint` instead.
 *
 * @internal
 */
function syncStrategy(series: Series): void {
    if (isEligible(series)) {
        if (!series.gpu) {
            series.gpu = new LineStrategy(series);
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
 * Wire the strategy into the series.
 *
 * In the eventual version these five branches are five `if (this.gpu)`
 * checks inside `Series`: one each in `translate()`, `render()` and
 * `searchPoint()`, plus two around `drawGraph()`/`drawPoints()`. The proof
 * of concept uses `wrap` because a module cannot change the core.
 *
 * @internal
 */
function compose(
    SeriesClass: typeof Series,
    seriesTypes: typeof SeriesRegistry.seriesTypes
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
        syncStrategy(this);

        if (isPending(this) && !this.boost2Pending) {
            // The series must be marked dirty before the redraw, because
            // `redraw()` alone does not call `translate()` and eligibility
            // would not be re-evaluated. Registered once per series.
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

        // Still waiting for the device: draw nothing rather than build an
        // SVG rendering that is about to be thrown away.
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

    // --- 4. render(): draws on the GPU instead of in SVG.
    wrap(seriesProto, 'render', function (
        this: Series,
        proceed: Function
    ): void {
        proceed.call(this);
        this.gpu?.draw();
    });

    // --- 5. searchPoint(): runs ahead of the lazy buildKDTree(), so the
    //        k-d tree and the mock points are never created.
    wrap(seriesProto, 'searchPoint', function (
        this: Series,
        proceed: Function,
        e: PointerEvent
    ): (Point|undefined) {
        if (this.gpu) {
            // Chart coordinates: `toValue` subtracts the axis position,
            // and `axis.pos` differs from `chart.plotLeft` with panes.
            return this.gpu.hitAt(e.chartX);
        }
        return proceed.apply(this, [].slice.call(arguments, 1));
    });

    // --- 6. getExtremes(): the same scan as the core, tracking both
    //        extremes inline instead of collecting every in-range value
    //        into an array and walking it again.
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

        const series = this,
            { xAxis, yAxis } = series,
            table = series.dataTable.getModified(),
            rowCount = table.rowCount,
            xData = series.getColumn('x', true),
            values = series.getColumn('y', true),
            positiveValuesOnly = yAxis ? yAxis.positiveValuesOnly : false,
            // Keep the first point outside the view, like the core does.
            shoulder = series.requireSorting && !series.is('column') ? 1 : 0,
            doAll = series.cropped || !xAxis;

        let xMin = 0,
            xMax = 0;

        if (xAxis) {
            const extremes = xAxis.getExtremes();
            xMin = extremes.min;
            xMax = extremes.max;
        }

        let dataMin: number|undefined,
            dataMax: number|undefined;

        for (let i = 0; i < rowCount; i++) {
            const x = xData[i];

            if (
                doAll || (
                    (xData[i + shoulder] || x) >= xMin &&
                    (xData[i - shoulder] || x) <= xMax
                )
            ) {
                const val = values[i];

                if (isNumber(val) && (val > 0 || !positiveValuesOnly)) {
                    if (typeof dataMin === 'undefined' || val < dataMin) {
                        dataMin = val;
                    }
                    if (typeof dataMax === 'undefined' || val > dataMax) {
                        dataMax = val;
                    }
                }
            }
        }

        const dataExtremes: DataExtremesObject = { dataMin, dataMax };

        fireEvent(series, 'afterGetExtremes', { dataExtremes });

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
