/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../Animation/AnimationOptions';
import type Axis from './Axis';
import type {
    AxisBreakOptions,
    YAxisOptions
} from './AxisOptions';
import type { AxisBreakBorderObject, AxisBreakObject } from './BreakObject';
import type LineSeries from '../../Series/Line/LineSeries';
import type Point from '../Series/Point';
import type Series from '../Series/Series';
import type SVGPath from '../Renderer/SVG/SVGPath';

import StackItem from './Stacking/StackItem.js';
import U from '../Utilities.js';
const {
    addEvent,
    find,
    fireEvent,
    isArray,
    isNumber,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module './AxisComposition' {
    interface AxisComposition {
        brokenAxis?: BrokenAxis.Additions;
    }
}

declare module './AxisOptions' {
    /**
     * An array defining breaks in the axis, the sections defined will be
     * left out and all the points shifted closer to each other.
     *
     * @productdesc {highcharts}
     * Requires that the broken-axis.js module is loaded.
     *
     * @sample {highcharts} highcharts/axisbreak/break-simple/
     *         Simple break
     * @sample {highcharts|highstock} highcharts/axisbreak/break-visualized/
     *         Advanced with callback
     * @sample {highstock} stock/demo/intraday-breaks/
     *         Break on nights and weekends
     *
     * @since     4.1.0
     * @product   highcharts highstock gantt
     */
    interface AxisBreakOptions {
        /**
         * A number indicating how much space should be left between the start
         * and the end of the break. The break size is given in axis units,
         * so for instance on a `datetime` axis, a break size of 3600000 would
         * indicate the equivalent of an hour.
         *
         * @default   0
         * @since     4.1.0
         * @product   highcharts highstock gantt
         */
        breakSize?: number;
        /**
         * The axis value where the break starts. On datetime axes, this may be
         * a date string.
         *
         * @since     4.1.0
         * @product   highcharts highstock gantt
         */
        from: number;
        /** @internal */
        inclusive?: boolean;
        /**
         * Defines an interval after which the break appears again. By default
         * the breaks do not repeat.
         *
         * @default   0
         * @since     4.1.0
         * @product   highcharts highstock gantt
         */
        repeat?: number;
        /**
         * The axis value where the break ends. On datetime axes, this may be
         * a date string.
         *
         * @since     4.1.0
         * @product   highcharts highstock gantt
         */
        to: number;
    }
    interface AxisOptions {
        /**
         * An array defining breaks in the axis, the sections defined will be
         * left out and all the points shifted closer to each other.
         *
         * @productdesc {highcharts}
         * Requires that the broken-axis.js module is loaded.
         *
         * @sample {highcharts} highcharts/axisbreak/break-simple/
         *         Simple break
         * @sample {highcharts|highstock} highcharts/axisbreak/break-visualized/
         *         Advanced with callback
         * @sample {highstock} stock/demo/intraday-breaks/
         *         Break on nights and weekends
         *
         * @since     4.1.0
         * @product   highcharts highstock gantt
         */
        breaks?: Array<AxisBreakOptions>;
    }
}

/** @internal */
declare module './AxisType' {
    interface AxisTypeRegistry {
        BrokenAxis: BrokenAxis.Composition;
    }
}

/** @internal */
declare module '../Series/SeriesBase' {
    interface SeriesBase {
        /** @requires modules/broken-axis */
        drawBreaks(axis: Axis, keys: Array<string>): void;
        /** @requires modules/broken-axis */
        gappedPath?(): SVGPath;
    }
}

/** @internal */
declare module '../Series/SeriesOptions' {
    interface SeriesOptions {
        gapSize?: number;
        gapUnit?: string;
    }
}

/* *
 *
 *  Composition
 *
 * */

/**
 * Axis with support of broken data rows.
 * @internal
 */
namespace BrokenAxis {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends Axis {
        /**
         * HC <= 8 backwards compatibility, used by demo samples.
         * @deprecated
         * @internal
         * @requires modules/broken-axis
         */
        breakArray: Array<AxisBreakObject>;
        /** @requires modules/broken-axis */
        brokenAxis: Additions;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Adds support for broken axes.
     * @internal
     */
    export function compose<T extends typeof Axis>(
        AxisClass: T,
        SeriesClass: typeof Series
    ): (T&typeof BrokenAxis) {

        if (!AxisClass.keepProps.includes('brokenAxis')) {
            AxisClass.keepProps.push('brokenAxis');

            addEvent(AxisClass, 'init', onAxisInit);
            addEvent(AxisClass, 'afterInit', onAxisAfterInit);
            addEvent(
                AxisClass,
                'afterSetTickPositions',
                onAxisAfterSetTickPositions
            );
            addEvent(AxisClass, 'afterSetOptions', onAxisAfterSetOptions);

            const seriesProto = SeriesClass.prototype;

            seriesProto.drawBreaks = seriesDrawBreaks;
            seriesProto.gappedPath = seriesGappedPath;

            addEvent(
                SeriesClass,
                'afterGeneratePoints',
                onSeriesAfterGeneratePoints
            );
            addEvent(SeriesClass, 'afterRender', onSeriesAfterRender);
        }

        return AxisClass as (T&typeof BrokenAxis);
    }

    /** @internal */
    function onAxisAfterInit(this: Axis): void {
        if (typeof this.brokenAxis !== 'undefined') {
            this.brokenAxis.setBreaks(this.options.breaks, false);
        }
    }

    /**
     * Force Axis to be not-ordinal when breaks are defined.
     * @internal
     */
    function onAxisAfterSetOptions(this: Axis): void {
        const axis = this;
        // Too early for axis.brokenAxis?.hasBreaks.
        if (Object.keys(axis.options.breaks?.[0] || {}).length) {
            axis.options.ordinal = false;
        }
    }

    /** @internal */
    function onAxisAfterSetTickPositions(this: Axis): void {
        const axis = this,
            brokenAxis = axis.brokenAxis;

        if (brokenAxis?.hasBreaks) {
            const tickPositions = axis.tickPositions,
                info = axis.tickPositions.info,
                newPositions = [];

            for (let i = 0; i < tickPositions.length; i++) {
                if (!brokenAxis.isInAnyBreak(tickPositions[i])) {
                    newPositions.push(tickPositions[i]);
                }
            }

            axis.tickPositions = newPositions;
            axis.tickPositions.info = info;
        }
    }

    /** @internal */
    function onAxisInit(this: Axis): void {
        const axis = this;

        if (!axis.brokenAxis) {
            axis.brokenAxis = new Additions(axis as Composition);
        }
    }

    /** @internal */
    function onSeriesAfterGeneratePoints(this: Series): void {
        const {
            isDirty,
            options: { connectNulls },
            points,
            xAxis,
            yAxis
        } = this;

        // Set, or reset visibility of the points. Axis.setBreaks marks
        // the series as isDirty
        if (isDirty) {
            let i = points.length;
            while (i--) {
                const point = points[i];

                // Respect nulls inside the break (#4275)
                const nullGap = point.y === null && connectNulls === false;
                const isPointInBreak = (
                    !nullGap && (
                        xAxis?.brokenAxis?.isInAnyBreak(point.x, true) ||
                        yAxis?.brokenAxis?.isInAnyBreak(point.y, true)
                    )
                );
                // Set point.visible if in any break.
                // If not in break, reset visible to original value.
                point.visible = isPointInBreak ?
                    false :
                    point.options.visible !== false;
            }
        }
    }

    /** @internal */
    function onSeriesAfterRender(this: Series): void {
        this.drawBreaks(this.xAxis, ['x']);
        this.drawBreaks(this.yAxis, pick(this.pointArrayMap, ['y']));
    }

    /** @internal */
    function seriesDrawBreaks(
        this: Series,
        axis: (Axis|undefined),
        keys: Array<string>
    ): void {
        const series = this,
            points = series.points;

        let breaks: Array<AxisBreakObject>,
            threshold: (number|null|undefined),
            y: (number|null|undefined);

        if (axis?.brokenAxis?.hasBreaks) {
            const brokenAxis = axis.brokenAxis;

            keys.forEach(function (key: string): void {
                breaks = brokenAxis?.breakArray || [];
                threshold = axis.isXAxis ?
                    axis.min :
                    pick(series.options.threshold, axis.min);

                points.forEach(function (point: Point): void {
                    y = (point as any)['stack' + key.toUpperCase()] ??
                        (point as any)[key];

                    breaks.forEach(function (brk: AxisBreakObject): void {
                        if (isNumber(threshold) && isNumber(y)) {
                            let eventName = '';

                            if (
                                (threshold < brk.from && y > brk.to) ||
                                (threshold > brk.from && y < brk.from)
                            ) {
                                eventName = 'pointBreak';

                            } else if ((
                                threshold < brk.from &&
                                y > brk.from &&
                                y < brk.to
                            ) || (
                                threshold > brk.from &&
                                y > brk.to &&
                                y < brk.from
                            )) {
                                eventName = 'pointInBreak';
                            }

                            if (eventName) {
                                fireEvent(axis, eventName, { point, brk });
                            }
                        }
                    });
                });
            });
        }
    }

    /**
     * Extend getGraphPath by identifying gaps in the data so that we
     * can draw a gap in the line or area. This was moved from ordinal
     * axis module to broken axis module as of #5045.
     *
     * @internal
     * @function Highcharts.Series#gappedPath
     *
     * @return {Highcharts.SVGPathArray}
     * Gapped path
     */
    function seriesGappedPath(this: LineSeries): SVGPath {
        const currentDataGrouping = this.currentDataGrouping,
            groupingSize = currentDataGrouping?.gapSize,
            points = this.points.slice(),
            yAxis = this.yAxis;

        let gapSize = this.options.gapSize,
            i = points.length - 1,
            stack: StackItem;

        /**
         * Defines when to display a gap in the graph, together with the
         * [gapUnit](plotOptions.series.gapUnit) option.
         *
         * In case when `dataGrouping` is enabled, points can be grouped
         * into a larger time span. This can make the grouped points to
         * have a greater distance than the absolute value of `gapSize`
         * property, which will result in disappearing graph completely.
         * To prevent this situation the mentioned distance between
         * grouped points is used instead of previously defined
         * `gapSize`.
         *
         * In practice, this option is most often used to visualize gaps
         * in time series. In a stock chart, intraday data is available
         * for daytime hours, while gaps will appear in nights and
         * weekends.
         *
         * @see [gapUnit](plotOptions.series.gapUnit)
         * @see [xAxis.breaks](#xAxis.breaks)
         *
         * @sample {highstock} stock/plotoptions/series-gapsize/
         * Setting the gap size to 2 introduces gaps for weekends in
         * daily datasets.
         *
         * @type      {number}
         * @default   0
         * @product   highstock
         * @requires  modules/broken-axis
         * @apioption plotOptions.series.gapSize
         */

        /**
         * Together with [gapSize](plotOptions.series.gapSize), this
         * option defines where to draw gaps in the graph.
         *
         * When the `gapUnit` is `"relative"` (default), a gap size of 5
         * means that if the distance between two points is greater than
         * 5 times that of the two closest points, the graph will be
         * broken.
         *
         * When the `gapUnit` is `"value"`, the gap is based on absolute
         * axis values, which on a datetime axis is milliseconds. This
         * also applies to the navigator series that inherits gap
         * options from the base series.
         *
         * @see [gapSize](plotOptions.series.gapSize)
         *
         * @type       {string}
         * @default    relative
         * @since      5.0.13
         * @product    highstock
         * @validvalue ["relative", "value"]
         * @requires   modules/broken-axis
         * @apioption  plotOptions.series.gapUnit
         */

        if (gapSize && i > 0) { // #5008

            // Gap unit is relative
            if (this.options.gapUnit !== 'value') {
                gapSize *= this.basePointRange as any;
            }

            // Setting a new gapSize in case dataGrouping is enabled
            // (#7686)
            if (
                groupingSize &&
                groupingSize > gapSize &&
                // Except when DG is forced (e.g. from other series)
                // and has lower granularity than actual points (#11351)
                groupingSize >= (this.basePointRange as any)
            ) {
                gapSize = groupingSize;
            }

            // Extension for ordinal breaks
            let current, next;
            while (i--) {
                // Reassign next if it is not visible
                if (!(next && next.visible !== false)) {
                    next = points[i + 1];
                }
                current = points[i];
                // Skip iteration if one of the points is not visible
                if (next.visible === false || current.visible === false) {
                    continue;
                }

                if ((next.x as any) - (current.x as any) > gapSize) {
                    const xRange = ((current.x as any) + (next.x as any)) / 2;

                    points.splice( // Insert after this one
                        i + 1,
                        0,
                        {
                            isNull: true,
                            x: xRange
                        } as any
                    );

                    // For stacked chart generate empty stack items, #6546
                    if (yAxis.stacking && this.options.stacking) {
                        stack = yAxis.stacking.stacks[this.stackKey as any][
                            xRange
                        ] = new StackItem(
                            yAxis as any,
                            (yAxis.options as YAxisOptions).stackLabels as any,
                            false,
                            xRange,
                            this.stack ?? ''
                        );
                        stack.total = 0;
                    }
                }
                // Assign current to next for the upcoming iteration
                next = current;
            }
        }

        // Call base method
        return this.getGraphPath(points);
    }

    /* *
     *
     *  Class
     *
     * */

    /**
     * Provides support for broken axes.
     * @internal
     * @class
     */
    export class Additions {

        /* *
         *
         *  Static Functions
         *
         * */

        /** @internal */
        public static isInBreak(
            brk: AxisBreakOptions,
            val: number
        ): (boolean|undefined) {
            const repeat = brk.repeat || Infinity,
                from = brk.from,
                length = brk.to - brk.from,
                test = (
                    val >= from ?
                        (val - from) % repeat :
                        repeat - ((from - val) % repeat)
                );

            let ret: (boolean|undefined);

            if (!brk.inclusive) {
                ret = test < length && test !== 0;
            } else {
                ret = test <= length;
            }
            return ret;
        }

        /** @internal */
        public static lin2Val(
            this: Axis,
            val: (number|null)
        ): (number|null) {
            const axis = this,
                threshold = axis.min || 0,
                brokenAxis = axis.brokenAxis,
                breakArray = brokenAxis?.breakArray;

            if (!breakArray?.length || !isNumber(val)) {
                return val;
            }

            let nval = val;

            // Axis min is the anchor point. Above it, break gaps impact the
            // result differently than below.
            if (val > threshold) {
                for (const brk of breakArray) {
                    if (brk.from > nval) {
                        // Skip all breaks after the nval.
                        break;
                    } else if (brk.to <= nval && brk.to > threshold) {
                        nval += brk.len;
                    } else if (Additions.isInBreak(brk, nval)) {
                        nval += brk.len;
                    }
                }
            } else if (val < threshold) {
                for (const brk of breakArray) {
                    if (brk.from > threshold) {
                        // Skip all breaks above the threshold.
                        break;
                    } else if (brk.from >= nval && brk.from < threshold) {
                        nval -= brk.len;
                    } else if (Additions.isInBreak(brk, nval)) {
                        nval -= brk.len;
                    }
                }
            }

            return nval;
        }

        /** @internal */
        public static val2Lin(
            this: Axis,
            val: (number|null)
        ): (number|null) {
            const axis = this,
                threshold = axis.min || 0,
                brokenAxis = axis.brokenAxis,
                breakArray = brokenAxis?.breakArray;

            if (!breakArray?.length || !isNumber(val)) {
                return val;
            }

            let nval = val;

            // Axis min is the anchor point. Above it, break gaps impact the
            // result differently than below.
            if (val > threshold) {
                for (const brk of breakArray) {
                    if (brk.to <= val && brk.to > threshold) {
                        nval -= brk.len;
                    } else if (brk.from > val) {
                        // Skip all breaks after the val.
                        break;
                    } else if (Additions.isInBreak(brk, val)) {
                        nval -= (val - brk.from);
                        break;
                    }
                }
            } else if (val < threshold) {
                for (const brk of breakArray) {
                    if (brk.from >= val && brk.from < threshold) {
                        nval += brk.len;
                    } else if (brk.from > threshold) {
                        // Skip all breaks before the threshold.
                        break;
                    } else if (Additions.isInBreak(brk, val)) {
                        nval += (brk.to - val);
                        break;
                    }
                }
            }

            return nval;
        }

        /* *
         *
         *  Constructors
         *
         * */

        /** @internal */
        public constructor(axis: Composition) {
            this.axis = axis;
        }

        /* *
         *
         *  Properties
         *
         * */

        /** @internal */
        public axis: Composition;

        /** @internal */
        public breakArray?: Array<AxisBreakObject>;

        /** @internal */
        public hasBreaks?: boolean;

        /** @internal */
        public unitLength?: number;

        /* *
         *
         *  Functions
         *
         * */

        /**
         * Returns the first break found where the x is larger then break.from
         * and smaller then break.to.
         *
         * @param {number} x
         * The number which should be within a break.
         *
         * @param {Array<Highcharts.XAxisBreaksOptions>} breaks
         * The array of breaks to search within.
         *
         * @return {Highcharts.XAxisBreaksOptions|undefined}
         * Returns the first break found that matches, returns false if no break
         * is found.
         */
        public findBreakAt(
            x: number,
            breaks: Array<AxisBreakObject>
        ): (AxisBreakObject|undefined) {
            return find(breaks, function (b): boolean {
                return b.from < x && x < b.to;
            });
        }

        /** @internal */
        public isInAnyBreak(
            val: (number|null|undefined),
            testKeep?: boolean
        ): (boolean|undefined) {
            const brokenAxis = this,
                axis = brokenAxis.axis,
                breaks = axis.options.breaks || [];

            let i = breaks.length,
                inbrk: (boolean|undefined),
                keep: (boolean|undefined),
                ret: (boolean|undefined);

            if (i && isNumber(val)) {

                while (i--) {
                    if (Additions.isInBreak(breaks[i], val)) {
                        inbrk = true;
                        if (!keep) {
                            keep = pick(
                                (breaks as any)[i].showPoints,
                                !axis.isXAxis
                            );
                        }
                    }
                }

                if (inbrk && testKeep) {
                    ret = inbrk && !keep;
                } else {
                    ret = inbrk;
                }
            }
            return ret;
        }

        /**
         * Dynamically set or unset breaks in an axis. This function in lighter
         * than using Axis.update, and it also preserves animation.
         *
         * @internal
         * @function Highcharts.Axis#setBreaks
         *
         * @param {Array<Highcharts.XAxisBreaksOptions>} [breaks]
         * The breaks to add. When `undefined` it removes existing breaks.
         *
         * @param {boolean} [redraw=true]
         * Whether to redraw the chart immediately.
         */
        public setBreaks(
            breaks?: Array<AxisBreakOptions>,
            redraw?: boolean
        ): void {
            const brokenAxis = this,
                axis = brokenAxis.axis,
                time = axis.chart.time,
                hasBreaks = isArray(breaks) &&
                    !!Object.keys(breaks?.[0] || {}).length;

            axis.isDirty = (brokenAxis.hasBreaks ?? false) !== hasBreaks;
            brokenAxis.hasBreaks = hasBreaks;

            // Compile string dates
            breaks?.forEach((brk): void => {
                brk.from = time.parse(brk.from) || 0;
                brk.to = time.parse(brk.to) || 0;
            });

            if (breaks !== axis.options.breaks) {
                axis.options.breaks = axis.userOptions.breaks = breaks;
            }
            axis.forceRedraw = true; // Force recalculation in setScale

            // Recalculate series related to the axis.
            axis.series.forEach(function (series): void {
                series.isDirty = true;
            });

            if (!hasBreaks && axis.val2lin === Additions.val2Lin) {
                // Revert to prototype functions
                delete (axis as Partial<typeof axis>).val2lin;
                delete (axis as Partial<typeof axis>).lin2val;
            }

            if (hasBreaks) {
                axis.userOptions.ordinal = false;
                axis.lin2val = Additions.lin2Val as any;
                axis.val2lin = Additions.val2Lin as any;

                axis.setExtremes = function (
                    newMin: number,
                    newMax: number,
                    redraw?: boolean,
                    animation?: (boolean|Partial<AnimationOptions>),
                    eventArguments?: any
                ): void {
                    // If trying to set extremes inside a break, extend min to
                    // after, and max to before the break ( #3857 )
                    // but not for gantt (#13898);
                    if (brokenAxis.hasBreaks && !axis.treeGrid?.tree) {
                        const breaks = (this.brokenAxis.breakArray || []);
                        let axisBreak;

                        while (
                            (axisBreak = brokenAxis.findBreakAt(newMin, breaks))
                        ) {
                            newMin = axisBreak.to;
                        }
                        while (
                            (axisBreak = brokenAxis.findBreakAt(newMax, breaks))
                        ) {
                            newMax = axisBreak.from;
                        }

                        // If both min and max is within the same break.
                        if (newMax < newMin) {
                            newMax = newMin;
                        }
                    }
                    axis.constructor.prototype.setExtremes.call(
                        this,
                        newMin,
                        newMax,
                        redraw,
                        animation,
                        eventArguments
                    );
                };

                axis.setAxisTranslation = function (): void {
                    axis.constructor.prototype.setAxisTranslation.call(this);

                    brokenAxis.unitLength = void 0;
                    if (brokenAxis.hasBreaks) {
                        const breaks = axis.options.breaks || [],
                            breakArrayTemp: Array<AxisBreakBorderObject> = [],
                            breakArray: Array<AxisBreakObject> = [],
                            pointRangePadding = axis.pointRangePadding ?? 0;

                        let length = 0,
                            inBrk: number,
                            repeat: number,
                            min = axis.userMin ?? axis.min,
                            max = axis.userMax ?? axis.max,
                            dataMin = axis.dataMin ?? min,
                            dataMax = axis.dataMax ?? max,
                            start: (number|undefined),
                            i: number;

                        if (isNumber(axis.threshold)) {
                            dataMin = Math.min(
                                dataMin ?? axis.threshold,
                                axis.threshold
                            );
                            dataMax = Math.max(
                                dataMax ?? axis.threshold,
                                axis.threshold
                            );
                        }

                        // Min & max check (#4247) but not for gantt (#13898)
                        if (!axis.treeGrid?.tree) {
                            breaks.forEach(
                                function (brk): void {
                                    repeat = brk.repeat || Infinity;
                                    if (isNumber(min) && isNumber(max)) {
                                        if (Additions.isInBreak(brk, min)) {
                                            min += (
                                                (brk.to % repeat) -
                                                (min % repeat)
                                            );
                                        }
                                        if (Additions.isInBreak(brk, max)) {
                                            max -= (
                                                (max % repeat) -
                                                (brk.from % repeat)
                                            );
                                        }
                                    }
                                }
                            );
                        }

                        // Construct an array holding all breaks in the axis
                        // for the current data range.
                        if (isNumber(dataMin) && isNumber(dataMax)) {
                            breaks.forEach(
                                function (brk): void {
                                    start = brk.from;
                                    repeat = brk.repeat || Infinity;

                                    while (start - repeat > dataMin) {
                                        start -= repeat;
                                    }
                                    while (start < dataMin) {
                                        start += repeat;
                                    }

                                    for (i = start; i < dataMax; i += repeat) {
                                        breakArrayTemp.push({
                                            value: i,
                                            move: 'in'
                                        });
                                        breakArrayTemp.push({
                                            value: i + brk.to - brk.from,
                                            move: 'out',
                                            size: brk.breakSize
                                        });
                                    }
                                }
                            );
                        }

                        breakArrayTemp.sort(function (
                            a: AxisBreakBorderObject,
                            b: AxisBreakBorderObject
                        ): number {
                            return (
                                (a.value === b.value) ?
                                    (
                                        (a.move === 'in' ? 0 : 1) -
                                        (b.move === 'in' ? 0 : 1)
                                    ) :
                                    a.value - b.value
                            );
                        });

                        // Simplify the breaks
                        inBrk = 0;
                        start = dataMin;

                        breakArrayTemp.forEach(
                            (brk: AxisBreakBorderObject): void => {
                                inBrk += (brk.move === 'in' ? 1 : -1);

                                if (inBrk === 1 && brk.move === 'in') {
                                    start = brk.value;
                                }
                                if (inBrk === 0 && isNumber(start)) {
                                    breakArray.push({
                                        from: start,
                                        to: brk.value,
                                        len: brk.value - start - (brk.size || 0)
                                    });
                                    if (
                                        isNumber(min) && isNumber(max) &&
                                        start < max && brk.value > min
                                    ) {
                                        // Sum break gaps in the visible range
                                        length += (
                                            brk.value -
                                            start -
                                            (brk.size || 0)
                                        );
                                    }
                                }
                            }
                        );

                        brokenAxis.breakArray = breakArray;

                        // Used with staticScale, and below the actual axis
                        // length, when breaks are subtracted.
                        if (
                            isNumber(min) &&
                            isNumber(max) &&
                            isNumber(axis.min)
                        ) {

                            brokenAxis.unitLength = max - min - length +
                                pointRangePadding;

                            fireEvent(axis, 'afterBreaks');

                            if (axis.staticScale) {
                                axis.transA = axis.staticScale;
                            } else if (brokenAxis.unitLength) {
                                axis.transA *=
                                    (max - axis.min + pointRangePadding) /
                                    brokenAxis.unitLength;
                            }

                            if (pointRangePadding) {
                                axis.minPixelPadding =
                                    axis.transA * (axis.minPointOffset || 0);
                            }

                            axis.min = min;
                            axis.max = max;
                        }
                    }
                };
            }

            if (pick(redraw, true)) {
                axis.chart.redraw();
            }
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default BrokenAxis;
