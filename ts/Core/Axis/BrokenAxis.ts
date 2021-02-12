/* *
 *
 *  (c) 2009-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type AnimationOptions from '../Animation/AnimationOptions';
import type { AxisBreakBorderObject, AxisBreakObject } from './Types';
import type LineSeries from '../../Series/Line/LineSeries';
import type Point from '../Series/Point';
import type SVGPath from '../Renderer/SVG/SVGPath';
import Axis from './Axis.js';
import Series from '../Series/Series.js';
import StackItem from '../../Extensions/Stacking.js';
import U from '../Utilities.js';
const {
    addEvent,
    find,
    fireEvent,
    isArray,
    isNumber,
    pick
} = U;

declare module '../Series/SeriesLike' {
    interface SeriesLike {
        /** @requires modules/broken-axis */
        drawBreaks(axis: Axis, keys: Array<string>): void;
        /** @requires modules/broken-axis */
        gappedPath?(): SVGPath;
    }
}

declare module '../Series/SeriesOptions' {
    interface SeriesOptions {
        gapSize?: number;
        gapUnit?: string;
    }
}

/**
 * @private
 */
declare module './Types' {
    interface AxisComposition {
        brokenAxis?: BrokenAxis['brokenAxis'];
    }
    interface AxisTypeRegistry {
        BrokenAxis: BrokenAxis;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface XAxisBreaksOptions {
            inclusive?: boolean;
        }
    }
}

/* eslint-disable valid-jsdoc */

/**
 * Provides support for broken axes.
 * @private
 * @class
 */
class BrokenAxisAdditions {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * @private
     */
    public static isInBreak(
        brk: Highcharts.XAxisBreaksOptions,
        val: (number|null|undefined)
    ): (boolean|undefined) {
        var ret: (boolean|undefined),
            repeat = brk.repeat || Infinity,
            from = brk.from,
            length = (brk.to as any) - (brk.from as any),
            test = (
                (val as any) >= (from as any) ?
                    ((val as any) - (from as any)) % repeat :
                    repeat - (((from as any) - (val as any)) % repeat)
            );

        if (!brk.inclusive) {
            ret = test < length && test !== 0;
        } else {
            ret = test <= length;
        }
        return ret;
    }

    /**
     * @private
     */
    public static lin2Val(
        this: Axis,
        val: (number|null)
    ): (number|null) {
        const axis = this;
        const brokenAxis = axis.brokenAxis;
        const breakArray = brokenAxis && brokenAxis.breakArray;

        if (!breakArray) {
            return val;
        }

        var nval = val,
            brk: AxisBreakObject,
            i: number;

        for (i = 0; i < breakArray.length; i++) {
            brk = breakArray[i];
            if (brk.from >= (nval as any)) {
                break;
            } else if (brk.to < (nval as any)) {
                (nval as any) += brk.len;
            } else if (BrokenAxisAdditions.isInBreak(brk, nval)) {
                (nval as any) += brk.len;
            }
        }

        return nval;
    }

    /**
     * @private
     */
    public static val2Lin(
        this: Axis,
        val: (number|null)
    ): (number|null) {
        const axis = this;
        const brokenAxis = axis.brokenAxis;
        const breakArray = brokenAxis && brokenAxis.breakArray;

        if (!breakArray) {
            return val;
        }

        var nval = val,
            brk: AxisBreakObject,
            i: number;

        for (i = 0; i < breakArray.length; i++) {
            brk = breakArray[i];
            if (brk.to <= (val as any)) {
                (nval as any) -= brk.len;
            } else if (brk.from >= (val as any)) {
                break;
            } else if (BrokenAxisAdditions.isInBreak(brk, val)) {
                (nval as any) -= ((val as any) - brk.from);
                break;
            }
        }

        return nval;
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(axis: Axis) {
        this.axis = axis;
    }

    /* *
     *
     *  Properties
     *
     * */

    public axis: Axis;
    public breakArray?: Array<AxisBreakObject>;
    public hasBreaks: boolean = false;
    public unitLength?: number;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Returns the first break found where the x is larger then break.from and
     * smaller then break.to.
     *
     * @param {number} x
     * The number which should be within a break.
     *
     * @param {Array<Highcharts.XAxisBreaksOptions>} breaks
     * The array of breaks to search within.
     *
     * @return {Highcharts.XAxisBreaksOptions|undefined}
     * Returns the first break found that matches, returns false if no break is
     * found.
     */
    public findBreakAt(
        x: number,
        breaks: Array<Highcharts.XAxisBreaksOptions>
    ): (Highcharts.XAxisBreaksOptions|undefined) {
        return find(breaks, function (b: Highcharts.XAxisBreaksOptions): boolean {
            return (b.from as any) < x && x < (b.to as any);
        });
    }

    /**
     * @private
     */
    public isInAnyBreak(
        val: (number|null|undefined),
        testKeep?: boolean
    ): (boolean|undefined) {
        const brokenAxis = this;
        const axis = brokenAxis.axis;

        var breaks = axis.options.breaks,
            i = breaks && breaks.length,
            inbrk: (boolean|undefined),
            keep: (boolean|undefined),
            ret: (boolean|undefined);

        if (i) {

            while (i--) {
                if (BrokenAxisAdditions.isInBreak((breaks as any)[i], val)) {
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
     * Dynamically set or unset breaks in an axis. This function in lighter than
     * usin Axis.update, and it also preserves animation.
     *
     * @private
     * @function Highcharts.Axis#setBreaks
     *
     * @param {Array<Highcharts.XAxisBreaksOptions>} [breaks]
     *        The breaks to add. When `undefined` it removes existing breaks.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart immediately.
     *
     * @return {void}
     */
    public setBreaks(
        breaks?: Array<Highcharts.XAxisBreaksOptions>,
        redraw?: boolean
    ): void {
        const brokenAxis = this;
        const axis = brokenAxis.axis;
        const hasBreaks = (isArray(breaks) && !!breaks.length);

        axis.isDirty = brokenAxis.hasBreaks !== hasBreaks;
        brokenAxis.hasBreaks = hasBreaks;
        axis.options.breaks = axis.userOptions.breaks = breaks;
        axis.forceRedraw = true; // Force recalculation in setScale

        // Recalculate series related to the axis.
        axis.series.forEach(function (series): void {
            series.isDirty = true;
        });

        if (!hasBreaks && axis.val2lin === BrokenAxisAdditions.val2Lin) {
            // Revert to prototype functions
            delete axis.val2lin;
            delete axis.lin2val;
        }

        if (hasBreaks) {
            axis.userOptions.ordinal = false;
            axis.lin2val = BrokenAxisAdditions.lin2Val as any;
            axis.val2lin = BrokenAxisAdditions.val2Lin as any;

            axis.setExtremes = function (
                newMin: number,
                newMax: number,
                redraw?: boolean,
                animation?: (boolean|Partial<AnimationOptions>),
                eventArguments?: any
            ): void {
                // If trying to set extremes inside a break, extend min to
                // after, and max to before the break ( #3857 )
                if (brokenAxis.hasBreaks) {
                    var axisBreak,
                        breaks = this.options.breaks;

                    while ((axisBreak = brokenAxis.findBreakAt(newMin, breaks as any))) {
                        newMin = axisBreak.to as any;
                    }
                    while ((axisBreak = brokenAxis.findBreakAt(newMax, breaks as any))) {
                        newMax = axisBreak.from as any;
                    }

                    // If both min and max is within the same break.
                    if (newMax < newMin) {
                        newMax = newMin;
                    }
                }
                Axis.prototype.setExtremes.call(
                    this,
                    newMin,
                    newMax,
                    redraw,
                    animation,
                    eventArguments
                );
            };

            axis.setAxisTranslation = function (): void {
                Axis.prototype.setAxisTranslation.call(this);

                brokenAxis.unitLength = null as any;
                if (brokenAxis.hasBreaks) {
                    var breaks = axis.options.breaks || [],
                        // Temporary one:
                        breakArrayT: Array<AxisBreakBorderObject> = [],
                        breakArray: Array<AxisBreakObject> = [],
                        length = 0,
                        inBrk: number,
                        repeat: number,
                        min = axis.userMin || axis.min,
                        max = axis.userMax || axis.max,
                        pointRangePadding = pick(axis.pointRangePadding, 0),
                        start: (number|null|undefined),
                        i: number;

                    // Min & max check (#4247)
                    breaks.forEach(function (brk: Highcharts.XAxisBreaksOptions): void {
                        repeat = brk.repeat || Infinity;
                        if (BrokenAxisAdditions.isInBreak(brk, min)) {
                            (min as any) +=
                                ((brk.to as any) % repeat) -
                                ((min as any) % repeat);
                        }
                        if (BrokenAxisAdditions.isInBreak(brk, max)) {
                            (max as any) -=
                                ((max as any) % repeat) -
                                ((brk.from as any) % repeat);
                        }
                    });

                    // Construct an array holding all breaks in the axis
                    breaks.forEach(function (brk: Highcharts.XAxisBreaksOptions): void {
                        start = brk.from;
                        repeat = brk.repeat || Infinity;

                        while ((start as any) - repeat > (min as any)) {
                            (start as any) -= repeat;
                        }
                        while ((start as any) < (min as any)) {
                            (start as any) += repeat;
                        }

                        for (i = (start as any); i < (max as any); i += repeat) {
                            breakArrayT.push({
                                value: i,
                                move: 'in'
                            });
                            breakArrayT.push({
                                value: i + ((brk.to as any) - (brk.from as any)),
                                move: 'out',
                                size: brk.breakSize
                            });
                        }
                    });

                    breakArrayT.sort(function (
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
                    start = min;

                    breakArrayT.forEach(function (brk: AxisBreakBorderObject): void {
                        inBrk += (brk.move === 'in' ? 1 : -1);

                        if (inBrk === 1 && brk.move === 'in') {
                            start = brk.value;
                        }
                        if (inBrk === 0) {
                            breakArray.push({
                                from: start as any,
                                to: brk.value,
                                len: brk.value - (start as any) - (brk.size || 0)
                            });
                            length += brk.value - (start as any) - (brk.size || 0);
                        }
                    });

                    /**
                     * HC <= 8 backwards compatibility, used by demo samples.
                     * @deprecated
                     * @private
                     * @requires modules/broken-axis
                     */
                    (axis as BrokenAxis).breakArray = brokenAxis.breakArray = breakArray;

                    // Used with staticScale, and below the actual axis length,
                    // when breaks are substracted.
                    brokenAxis.unitLength = (max as any) - (min as any) - length + pointRangePadding;

                    fireEvent(axis, 'afterBreaks');

                    if (axis.staticScale) {
                        axis.transA = axis.staticScale;
                    } else if (brokenAxis.unitLength) {
                        axis.transA *=
                            ((max as any) - (axis.min as any) + pointRangePadding) /
                            brokenAxis.unitLength;
                    }

                    if (pointRangePadding) {
                        axis.minPixelPadding =
                            axis.transA * (axis.minPointOffset as any);
                    }

                    axis.min = min;
                    axis.max = max;
                }
            };
        }

        if (pick(redraw, true)) {
            axis.chart.redraw();
        }
    }

}

/**
 * Axis with support of broken data rows.
 * @private
 * @class
 */
class BrokenAxis {

    /**
     * Adds support for broken axes.
     * @private
     */
    public static compose(AxisClass: typeof Axis, SeriesClass: typeof Series): void {

        AxisClass.keepProps.push('brokenAxis');

        const seriesProto = Series.prototype;

        /**
         * @private
         */
        seriesProto.drawBreaks = function (
            axis: (Axis|undefined),
            keys: Array<string>
        ): void {
            var series = this,
                points = series.points,
                breaks: Array<AxisBreakObject>,
                threshold: (number|null|undefined),
                eventName: string,
                y: (number|null|undefined);

            if (
                axis && // #5950
                axis.brokenAxis &&
                axis.brokenAxis.hasBreaks
            ) {
                const brokenAxis = axis.brokenAxis;

                keys.forEach(function (key: string): void {
                    breaks = brokenAxis && brokenAxis.breakArray || [];
                    threshold = axis.isXAxis ?
                        axis.min :
                        pick(series.options.threshold, axis.min);
                    points.forEach(function (point: Point): void {
                        y = pick(
                            (point as any)['stack' + key.toUpperCase()],
                            (point as any)[key]
                        );
                        breaks.forEach(function (brk: AxisBreakObject): void {
                            if (isNumber(threshold) && isNumber(y)) {

                                eventName = false as any;

                                if (
                                    (threshold < brk.from && y > brk.to) ||
                                    (threshold > brk.from && y < brk.from)
                                ) {
                                    eventName = 'pointBreak';

                                } else if (
                                    (threshold < brk.from && y > brk.from && y < brk.to) ||
                                    (threshold > brk.from && y > brk.to && y < brk.from)
                                ) {
                                    eventName = 'pointInBreak';
                                }
                                if (eventName) {
                                    fireEvent(axis, eventName, { point: point, brk: brk });
                                }
                            }
                        });
                    });
                });
            }
        };

        /**
         * Extend getGraphPath by identifying gaps in the data so that we can
         * draw a gap in the line or area. This was moved from ordinal axis
         * module to broken axis module as of #5045.
         *
         * @private
         * @function Highcharts.Series#gappedPath
         *
         * @return {Highcharts.SVGPathArray}
         * Gapped path
         */
        seriesProto.gappedPath = function (this: LineSeries): SVGPath {
            var currentDataGrouping = this.currentDataGrouping,
                groupingSize = currentDataGrouping && currentDataGrouping.gapSize,
                gapSize = this.options.gapSize,
                points = this.points.slice(),
                i = points.length - 1,
                yAxis = this.yAxis,
                stack: Highcharts.StackItem;

            /**
             * Defines when to display a gap in the graph, together with the
             * [gapUnit](plotOptions.series.gapUnit) option.
             *
             * In case when `dataGrouping` is enabled, points can be grouped
             * into a larger time span. This can make the grouped points to have
             * a greater distance than the absolute value of `gapSize` property,
             * which will result in disappearing graph completely. To prevent
             * this situation the mentioned distance between grouped points is
             * used instead of previously defined `gapSize`.
             *
             * In practice, this option is most often used to visualize gaps in
             * time series. In a stock chart, intraday data is available for
             * daytime hours, while gaps will appear in nights and weekends.
             *
             * @see [gapUnit](plotOptions.series.gapUnit)
             * @see [xAxis.breaks](#xAxis.breaks)
             *
             * @sample {highstock} stock/plotoptions/series-gapsize/
             *         Setting the gap size to 2 introduces gaps for weekends
             *         in daily datasets.
             *
             * @type      {number}
             * @default   0
             * @product   highstock
             * @requires  modules/broken-axis
             * @apioption plotOptions.series.gapSize
             */

            /**
             * Together with [gapSize](plotOptions.series.gapSize), this option
             * defines where to draw gaps in the graph.
             *
             * When the `gapUnit` is `"relative"` (default), a gap size of 5
             * means that if the distance between two points is greater than
             * 5 times that of the two closest points, the graph will be broken.
             *
             * When the `gapUnit` is `"value"`, the gap is based on absolute
             * axis values, which on a datetime axis is milliseconds. This also
             * applies to the navigator series that inherits gap options from
             * the base series.
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

                // Setting a new gapSize in case dataGrouping is enabled (#7686)
                if (
                    groupingSize &&
                    groupingSize > gapSize &&
                    // Except when DG is forced (e.g. from other series)
                    // and has lower granularity than actual points (#11351)
                    groupingSize >= (this.basePointRange as any)
                ) {
                    gapSize = groupingSize;
                }

                // extension for ordinal breaks
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

                        points.splice( // insert after this one
                            i + 1,
                            0,
                            {
                                isNull: true,
                                x: xRange
                            } as any
                        );

                        // For stacked chart generate empty stack items, #6546
                        if (yAxis.stacking && this.options.stacking) {
                            stack = yAxis.stacking.stacks[this.stackKey as any][xRange] =
                                new StackItem(
                                    yAxis as any,
                                    (
                                        (yAxis.options as Highcharts.YAxisOptions)
                                            .stackLabels as any
                                    ),
                                    false,
                                    xRange,
                                    this.stack
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
        };

        /* eslint-disable no-invalid-this */

        addEvent(AxisClass, 'init', function (): void {
            const axis = this;

            if (!axis.brokenAxis) {
                axis.brokenAxis = new BrokenAxisAdditions(axis as BrokenAxis);
            }
        });

        addEvent(AxisClass, 'afterInit', function (): void {
            if (typeof this.brokenAxis !== 'undefined') {
                this.brokenAxis.setBreaks(this.options.breaks, false);
            }
        });

        addEvent(AxisClass, 'afterSetTickPositions', function (): void {
            const axis = this;
            const brokenAxis = axis.brokenAxis;

            if (
                brokenAxis &&
                brokenAxis.hasBreaks
            ) {
                var tickPositions = this.tickPositions,
                    info = this.tickPositions.info,
                    newPositions = [],
                    i;

                for (i = 0; i < tickPositions.length; i++) {
                    if (!brokenAxis.isInAnyBreak(tickPositions[i])) {
                        newPositions.push(tickPositions[i]);
                    }
                }

                this.tickPositions = newPositions;
                this.tickPositions.info = info;
            }
        });

        // Force Axis to be not-ordinal when breaks are defined
        addEvent(AxisClass, 'afterSetOptions', function (): void {
            if (this.brokenAxis && this.brokenAxis.hasBreaks) {
                this.options.ordinal = false;
            }
        });

        addEvent(SeriesClass, 'afterGeneratePoints', function (): void {
            const {
                isDirty,
                options: { connectNulls },
                points,
                xAxis,
                yAxis
            } = this;

            // Set, or reset visibility of the points. Axis.setBreaks marks the
            // series as isDirty
            if (isDirty) {
                let i = points.length;
                while (i--) {
                    const point = points[i];

                    // Respect nulls inside the break (#4275)
                    const nullGap = point.y === null && connectNulls === false;
                    const isPointInBreak = (
                        !nullGap && (
                            (
                                xAxis &&
                                xAxis.brokenAxis &&
                                xAxis.brokenAxis.isInAnyBreak(point.x, true)
                            ) || (
                                yAxis &&
                                yAxis.brokenAxis &&
                                yAxis.brokenAxis.isInAnyBreak(point.y, true)
                            )
                        )
                    );
                    // Set point.visible if in any break.
                    // If not in break, reset visible to original value.
                    point.visible = isPointInBreak ?
                        false :
                        point.options.visible !== false;
                }
            }
        });

        addEvent(SeriesClass, 'afterRender', function drawPointsWrapped(): void {
            this.drawBreaks(this.xAxis, ['x']);
            this.drawBreaks(this.yAxis, pick(this.pointArrayMap, ['y']));
        });

    }

}

interface BrokenAxis extends Axis {
    /**
     * HC <= 8 backwards compatibility, used by demo samples.
     * @deprecated
     * @private
     * @requires modules/broken-axis
     */
    breakArray: Array<AxisBreakObject>;
    /** @requires modules/broken-axis */
    brokenAxis: BrokenAxisAdditions;
}

BrokenAxis.compose(Axis, Series); // @todo remove automatism

export default BrokenAxis;
