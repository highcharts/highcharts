/* *
 *
 *  (c) 2009-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Axis {
            breakArray?: Array<AxisBreakObject>;
            unitLength?: number;
            /** @requires modules/broken-axis */
            isInAnyBreak(
                val: (number|null|undefined),
                testKeep?: boolean
            ): (boolean|undefined);
            /** @requires modules/broken-axis */
            isInBreak(
                brk: XAxisBreaksOptions,
                val: (number|null|undefined)
            ): (boolean|undefined);
            /** @requires modules/broken-axis */
            setBreaks(
                breaks?: Array<XAxisBreaksOptions>,
                redraw?: boolean
            ): void;
        }
        interface AxisBreakBorderObject {
            move: string;
            size?: number;
            value: number;
        }
        interface AxisBreakObject {
            from: number;
            len: number;
            to: number;
        }
        interface Series {
            /** @requires modules/broken-axis */
            drawBreaks(axis: Axis, keys: Array<string>): void;
        }
        interface SeriesOptions {
            gapSize?: number;
            gapUnit?: string;
        }
        interface XAxisBreaksOptions {
            inclusive?: boolean;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    extend,
    isArray,
    pick
} = U;

import '../parts/Axis.js';
import '../parts/Series.js';

var addEvent = H.addEvent,
    find = H.find,
    fireEvent = H.fireEvent,
    Axis = H.Axis,
    Series = H.Series;

/**
 * Returns the first break found where the x is larger then break.from and
 * smaller then break.to.
 *
 * @param {number} x
 *        The number which should be within a break.
 * @param {Array<Highcharts.XAxisBreaksOptions>} breaks
 *        The array of breaks to search within.
 * @return {Highcharts.XAxisBreaksOptions|undefined}
 *         Returns the first break found that matches, returns false if no break
 *         is found.
 */
var findBreakAt = function (
    x: number,
    breaks: Array<Highcharts.XAxisBreaksOptions>
): (Highcharts.XAxisBreaksOptions|undefined) {
    return find(breaks, function (b: Highcharts.XAxisBreaksOptions): boolean {
        return (b.from as any) < x && x < (b.to as any);
    });
};

extend(Axis.prototype, {
    isInBreak: function (
        this: Highcharts.Axis,
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
    },

    isInAnyBreak: function (
        this: Highcharts.Axis,
        val: (number|null|undefined),
        testKeep?: boolean
    ): (boolean|undefined) {

        var breaks = this.options.breaks,
            i = breaks && breaks.length,
            inbrk: (boolean|undefined),
            keep: (boolean|undefined),
            ret: (boolean|undefined);


        if (i) {

            while (i--) {
                if (this.isInBreak((breaks as any)[i], val)) {
                    inbrk = true;
                    if (!keep) {
                        keep = pick(
                            (breaks as any)[i].showPoints,
                            !this.isXAxis
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
});

/* eslint-disable no-invalid-this */

addEvent(Axis, 'afterInit', function (): void {
    if (typeof this.setBreaks === 'function') {
        this.setBreaks(this.options.breaks, false);
    }
});

addEvent(Axis, 'afterSetTickPositions', function (): void {
    if (this.isBroken) {
        var axis = this,
            tickPositions = this.tickPositions,
            info = this.tickPositions.info,
            newPositions = [],
            i;

        for (i = 0; i < tickPositions.length; i++) {
            if (!axis.isInAnyBreak(tickPositions[i])) {
                newPositions.push(tickPositions[i]);
            }
        }

        this.tickPositions = newPositions;
        this.tickPositions.info = info;
    }
});

// Force Axis to be not-ordinal when breaks are defined
addEvent(Axis, 'afterSetOptions', function (): void {
    if (this.isBroken) {
        this.options.ordinal = false;
    }
});

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
Axis.prototype.setBreaks = function (
    breaks?: Array<Highcharts.XAxisBreaksOptions>,
    redraw?: boolean
): void {
    var axis = this,
        isBroken = (isArray(breaks) && !!breaks.length);

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    function breakVal2Lin(val: (number|null)): (number|null) {
        var nval = val,
            brk: Highcharts.AxisBreakObject,
            i: number;

        for (i = 0; i < (axis.breakArray as any).length; i++) {
            brk = (axis.breakArray as any)[i];
            if (brk.to <= (val as any)) {
                (nval as any) -= brk.len;
            } else if (brk.from >= (val as any)) {
                break;
            } else if (axis.isInBreak(brk, val)) {
                (nval as any) -= ((val as any) - brk.from);
                break;
            }
        }

        return nval;
    }

    /**
     * @private
     */
    function breakLin2Val(val: (number|null)): (number|null) {
        var nval = val,
            brk: Highcharts.AxisBreakObject,
            i: number;

        for (i = 0; i < (axis.breakArray as any).length; i++) {
            brk = (axis.breakArray as any)[i];
            if (brk.from >= (nval as any)) {
                break;
            } else if (brk.to < (nval as any)) {
                (nval as any) += brk.len;
            } else if (axis.isInBreak(brk, nval)) {
                (nval as any) += brk.len;
            }
        }

        return nval;
    }

    /* eslint-enable valid-jsdoc */

    axis.isDirty = axis.isBroken !== isBroken;
    axis.isBroken = isBroken;
    axis.options.breaks = axis.userOptions.breaks = breaks;
    axis.forceRedraw = true; // Force recalculation in setScale

    // Recalculate series related to the axis.
    axis.series.forEach(function (series): void {
        series.isDirty = true;
    });

    if (!isBroken && axis.val2lin === breakVal2Lin) {
        // Revert to prototype functions
        delete axis.val2lin;
        delete axis.lin2val;
    }

    if (isBroken) {
        axis.userOptions.ordinal = false;
        axis.val2lin = breakVal2Lin as any;
        axis.lin2val = breakLin2Val as any;

        axis.setExtremes = function (
            newMin: number,
            newMax: number,
            redraw?: boolean,
            animation?: (boolean|Highcharts.AnimationOptionsObject),
            eventArguments?: any
        ): void {
            // If trying to set extremes inside a break, extend min to after,
            // and max to before the break ( #3857 )
            if (this.isBroken) {
                var axisBreak,
                    breaks = this.options.breaks;

                while ((axisBreak = findBreakAt(newMin, breaks as any))) {
                    newMin = axisBreak.to as any;
                }
                while ((axisBreak = findBreakAt(newMax, breaks as any))) {
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

        axis.setAxisTranslation = function (saveOld?: boolean): void {
            Axis.prototype.setAxisTranslation.call(this, saveOld);

            this.unitLength = null as any;
            if (this.isBroken) {
                var breaks = axis.options.breaks,
                    // Temporary one:
                    breakArrayT = [] as Array<Highcharts.AxisBreakBorderObject>,
                    breakArray = [] as Array<Highcharts.AxisBreakObject>,
                    length = 0,
                    inBrk: number,
                    repeat: number,
                    min = axis.userMin || axis.min,
                    max = axis.userMax || axis.max,
                    pointRangePadding = pick(axis.pointRangePadding, 0),
                    start: (number|null|undefined),
                    i: number;

                // Min & max check (#4247)
                (breaks as any).forEach(function (
                    brk: Highcharts.XAxisBreaksOptions
                ): void {
                    repeat = brk.repeat || Infinity;
                    if (axis.isInBreak(brk, min)) {
                        (min as any) +=
                            ((brk.to as any) % repeat) -
                            ((min as any) % repeat);
                    }
                    if (axis.isInBreak(brk, max)) {
                        (max as any) -=
                            ((max as any) % repeat) -
                            ((brk.from as any) % repeat);
                    }
                });

                // Construct an array holding all breaks in the axis
                (breaks as any).forEach(function (
                    brk: Highcharts.XAxisBreaksOptions
                ): void {
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
                    a: Highcharts.AxisBreakBorderObject,
                    b: Highcharts.AxisBreakBorderObject
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

                breakArrayT.forEach(function (
                    brk: Highcharts.AxisBreakBorderObject
                ): void {
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

                axis.breakArray = breakArray;

                // Used with staticScale, and below, the actual axis length when
                // breaks are substracted.
                axis.unitLength =
                    (max as any) - (min as any) - length + pointRangePadding;

                fireEvent(axis, 'afterBreaks');

                if (axis.staticScale) {
                    axis.transA = axis.staticScale;
                } else if (axis.unitLength) {
                    axis.transA *=
                        ((max as any) - (axis.min as any) + pointRangePadding) /
                        axis.unitLength;
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
        this.chart.redraw();
    }
};

addEvent(Series, 'afterGeneratePoints', function (): void {
    const {
        isDirty,
        options: { connectNulls },
        points,
        xAxis,
        yAxis
    } = this;

    /* Set, or reset visibility of the points. Axis.setBreaks marks the series
    as isDirty */
    if (isDirty) {
        let i = points.length;
        while (i--) {
            const point = points[i];

            // Respect nulls inside the break (#4275)
            const nullGap = point.y === null && connectNulls === false;
            const isPointInBreak = (
                !nullGap &&
                (
                    xAxis && xAxis.isInAnyBreak(point.x, true) ||
                    yAxis && yAxis.isInAnyBreak(point.y, true)
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

addEvent(Series, 'afterRender', function drawPointsWrapped(): void {
    this.drawBreaks(this.xAxis, ['x']);
    this.drawBreaks(this.yAxis, pick(this.pointArrayMap, ['y']));
});

/* eslint-enable no-invalid-this */

H.Series.prototype.drawBreaks = function (
    axis: Highcharts.Axis,
    keys: Array<string>
): void {
    var series = this,
        points = series.points,
        breaks: Array<Highcharts.AxisBreakObject>,
        threshold: (number|null|undefined),
        eventName: string,
        y: (number|null|undefined);

    if (!axis) {
        return; // #5950
    }

    keys.forEach(function (key: string): void {
        breaks = axis.breakArray || [];
        threshold = axis.isXAxis ?
            axis.min :
            pick(series.options.threshold, axis.min);
        points.forEach(function (point: Highcharts.Point): void {
            y = pick(
                (point as any)['stack' + key.toUpperCase()],
                (point as any)[key]
            );
            breaks.forEach(function (brk: Highcharts.AxisBreakObject): void {
                eventName = false as any;

                if (
                    (
                        (threshold as any) < brk.from &&
                        (y as any) > brk.to
                    ) ||
                    (
                        (threshold as any) > brk.from &&
                        (y as any) < brk.from
                    )
                ) {
                    eventName = 'pointBreak';

                } else if (
                    (
                        (threshold as any) < brk.from &&
                        (y as any) > brk.from &&
                        (y as any) < brk.to
                    ) ||
                    (
                        (threshold as any) > brk.from &&
                        (y as any) > brk.to &&
                        (y as any) < brk.from
                    )
                ) {
                    eventName = 'pointInBreak';
                }
                if (eventName) {
                    fireEvent(axis, eventName, { point: point, brk: brk });
                }
            });
        });
    });
};


/**
 * Extend getGraphPath by identifying gaps in the data so that we can draw a gap
 * in the line or area. This was moved from ordinal axis module to broken axis
 * module as of #5045.
 *
 * @private
 * @function Highcharts.Series#gappedPath
 *
 * @return {Highcharts.SVGPathArray}
 *         Gapped path
 */
H.Series.prototype.gappedPath = function (): Highcharts.SVGPathArray {
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
     * In case when `dataGrouping` is enabled, points can be grouped into a
     * larger time span. This can make the grouped points to have a greater
     * distance than the absolute value of `gapSize` property, which will result
     * in disappearing graph completely. To prevent this situation the mentioned
     * distance between grouped points is used instead of previously defined
     * `gapSize`.
     *
     * In practice, this option is most often used to visualize gaps in
     * time series. In a stock chart, intraday data is available for daytime
     * hours, while gaps will appear in nights and weekends.
     *
     * @see [gapUnit](plotOptions.series.gapUnit)
     * @see [xAxis.breaks](#xAxis.breaks)
     *
     * @sample {highstock} stock/plotoptions/series-gapsize/
     *         Setting the gap size to 2 introduces gaps for weekends in daily
     *         datasets.
     *
     * @type      {number}
     * @default   0
     * @product   highstock
     * @requires  modules/broken-axis
     * @apioption plotOptions.series.gapSize
     */

    /**
     * Together with [gapSize](plotOptions.series.gapSize), this option defines
     * where to draw gaps in the graph.
     *
     * When the `gapUnit` is `relative` (default), a gap size of 5 means
     * that if the distance between two points is greater than five times
     * that of the two closest points, the graph will be broken.
     *
     * When the `gapUnit` is `value`, the gap is based on absolute axis values,
     * which on a datetime axis is milliseconds. This also applies to the
     * navigator series that inherits gap options from the base series.
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
                if (this.options.stacking) {
                    stack = yAxis.stacks[this.stackKey as any][xRange] =
                        new H.StackItem(
                            yAxis,
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
