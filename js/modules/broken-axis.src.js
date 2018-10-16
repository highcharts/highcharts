/**
 * (c) 2009-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Axis.js';
import '../parts/Series.js';

var addEvent = H.addEvent,
    pick = H.pick,
    wrap = H.wrap,
    each = H.each,
    extend = H.extend,
    isArray = H.isArray,
    fireEvent = H.fireEvent,
    Axis = H.Axis,
    Series = H.Series;

function stripArguments() {
    return Array.prototype.slice.call(arguments, 1);
}

extend(Axis.prototype, {
    isInBreak: function (brk, val) {
        var ret,
            repeat = brk.repeat || Infinity,
            from = brk.from,
            length = brk.to - brk.from,
            test = (
                val >= from ?
                    (val - from) % repeat :
                    repeat - ((from - val) % repeat)
            );

        if (!brk.inclusive) {
            ret = test < length && test !== 0;
        } else {
            ret = test <= length;
        }
        return ret;
    },

    isInAnyBreak: function (val, testKeep) {

        var breaks = this.options.breaks,
            i = breaks && breaks.length,
            inbrk,
            keep,
            ret;


        if (i) {

            while (i--) {
                if (this.isInBreak(breaks[i], val)) {
                    inbrk = true;
                    if (!keep) {
                        keep = pick(
                            breaks[i].showPoints,
                            this.isXAxis ? false : true
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

addEvent(Axis, 'afterInit', function () {
    if (typeof this.setBreaks === 'function') {
        this.setBreaks(this.options.breaks, false);
    }
});

addEvent(Axis, 'afterSetTickPositions', function () {
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
addEvent(Axis, 'afterSetOptions', function () {
    if (this.isBroken) {
        this.options.ordinal = false;
    }
});

/**
 * Dynamically set or unset breaks in an axis. This function in lighter than
 * usin Axis.update, and it also preserves animation.
 * @param  {Array} [breaks]
 *         The breaks to add. When `undefined` it removes existing breaks.
 * @param  {Boolean} [redraw=true]
 *         Whether to redraw the chart immediately.
 */
Axis.prototype.setBreaks = function (breaks, redraw) {
    var axis = this,
        isBroken = (isArray(breaks) && !!breaks.length);

    function breakVal2Lin(val) {
        var nval = val,
            brk,
            i;

        for (i = 0; i < axis.breakArray.length; i++) {
            brk = axis.breakArray[i];
            if (brk.to <= val) {
                nval -= brk.len;
            } else if (brk.from >= val) {
                break;
            } else if (axis.isInBreak(brk, val)) {
                nval -= (val - brk.from);
                break;
            }
        }

        return nval;
    }

    function breakLin2Val(val) {
        var nval = val,
            brk,
            i;

        for (i = 0; i < axis.breakArray.length; i++) {
            brk = axis.breakArray[i];
            if (brk.from >= nval) {
                break;
            } else if (brk.to < nval) {
                nval += brk.len;
            } else if (axis.isInBreak(brk, nval)) {
                nval += brk.len;
            }
        }
        return nval;
    }


    axis.isDirty = axis.isBroken !== isBroken;
    axis.isBroken = isBroken;
    axis.options.breaks = axis.userOptions.breaks = breaks;
    axis.forceRedraw = true; // Force recalculation in setScale

    if (!isBroken && axis.val2lin === breakVal2Lin) {
        // Revert to prototype functions
        delete axis.val2lin;
        delete axis.lin2val;
    }

    if (isBroken) {
        axis.userOptions.ordinal = false;
        axis.val2lin = breakVal2Lin;
        axis.lin2val = breakLin2Val;

        axis.setExtremes = function (
            newMin,
            newMax,
            redraw,
            animation,
            eventArguments
        ) {
            // If trying to set extremes inside a break, extend it to before and
            // after the break ( #3857 )
            if (this.isBroken) {
                while (this.isInAnyBreak(newMin)) {
                    newMin -= this.closestPointRange;
                }
                while (this.isInAnyBreak(newMax)) {
                    newMax -= this.closestPointRange;
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

        axis.setAxisTranslation = function (saveOld) {
            Axis.prototype.setAxisTranslation.call(this, saveOld);

            this.unitLength = null;
            if (this.isBroken) {
                var breaks = axis.options.breaks,
                    breakArrayT = [],    // Temporary one
                    breakArray = [],
                    length = 0,
                    inBrk,
                    repeat,
                    min = axis.userMin || axis.min,
                    max = axis.userMax || axis.max,
                    pointRangePadding = pick(axis.pointRangePadding, 0),
                    start,
                    i;

                // Min & max check (#4247)
                each(breaks, function (brk) {
                    repeat = brk.repeat || Infinity;
                    if (axis.isInBreak(brk, min)) {
                        min += (brk.to % repeat) - (min % repeat);
                    }
                    if (axis.isInBreak(brk, max)) {
                        max -= (max % repeat) - (brk.from % repeat);
                    }
                });

                // Construct an array holding all breaks in the axis
                each(breaks, function (brk) {
                    start = brk.from;
                    repeat = brk.repeat || Infinity;

                    while (start - repeat > min) {
                        start -= repeat;
                    }
                    while (start < min) {
                        start += repeat;
                    }

                    for (i = start; i < max; i += repeat) {
                        breakArrayT.push({
                            value: i,
                            move: 'in'
                        });
                        breakArrayT.push({
                            value: i + (brk.to - brk.from),
                            move: 'out',
                            size: brk.breakSize
                        });
                    }
                });

                breakArrayT.sort(function (a, b) {
                    return (
                        (a.value === b.value) ?
                        (a.move === 'in' ? 0 : 1) - (b.move === 'in' ? 0 : 1) :
                        a.value - b.value
                    );
                });

                // Simplify the breaks
                inBrk = 0;
                start = min;

                each(breakArrayT, function (brk) {
                    inBrk += (brk.move === 'in' ? 1 : -1);

                    if (inBrk === 1 && brk.move === 'in') {
                        start = brk.value;
                    }
                    if (inBrk === 0) {
                        breakArray.push({
                            from: start,
                            to: brk.value,
                            len: brk.value - start - (brk.size || 0)
                        });
                        length += brk.value - start - (brk.size || 0);
                    }
                });

                axis.breakArray = breakArray;

                // Used with staticScale, and below, the actual axis length when
                // breaks are substracted.
                axis.unitLength = max - min - length + pointRangePadding;

                fireEvent(axis, 'afterBreaks');

                if (axis.staticScale) {
                    axis.transA = axis.staticScale;
                } else if (axis.unitLength) {
                    axis.transA *= (max - axis.min + pointRangePadding) /
                        axis.unitLength;
                }

                if (pointRangePadding) {
                    axis.minPixelPadding = axis.transA * axis.minPointOffset;
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

wrap(Series.prototype, 'generatePoints', function (proceed) {

    proceed.apply(this, stripArguments(arguments));

    var series = this,
        xAxis = series.xAxis,
        yAxis = series.yAxis,
        points = series.points,
        point,
        i = points.length,
        connectNulls = series.options.connectNulls,
        nullGap;


    if (xAxis && yAxis && (xAxis.options.breaks || yAxis.options.breaks)) {
        while (i--) {
            point = points[i];

            // Respect nulls inside the break (#4275)
            nullGap = point.y === null && connectNulls === false;
            if (
                !nullGap &&
                (
                    xAxis.isInAnyBreak(point.x, true) ||
                    yAxis.isInAnyBreak(point.y, true)
                )
            ) {
                points.splice(i, 1);
                if (this.data[i]) {
                    // Removes the graphics for this point if they exist
                    this.data[i].destroyElements();
                }
            }
        }
    }

});

function drawPointsWrapped(proceed) {
    proceed.apply(this);
    this.drawBreaks(this.xAxis, ['x']);
    this.drawBreaks(this.yAxis, pick(this.pointArrayMap, ['y']));
}

H.Series.prototype.drawBreaks = function (axis, keys) {
    var series = this,
        points = series.points,
        breaks,
        threshold,
        eventName,
        y;

    if (!axis) {
        return; // #5950
    }

    each(keys, function (key) {
        breaks = axis.breakArray || [];
        threshold = axis.isXAxis ?
            axis.min :
            pick(series.options.threshold, axis.min);
        each(points, function (point) {
            y = pick(point['stack' + key.toUpperCase()], point[key]);
            each(breaks, function (brk) {
                eventName = false;

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
            });
        });
    });
};


/**
 * Extend getGraphPath by identifying gaps in the data so that we can draw a gap
 * in the line or area. This was moved from ordinal axis module to broken axis
 * module as of #5045.
 */
H.Series.prototype.gappedPath = function () {
    var currentDataGrouping = this.currentDataGrouping,
        groupingSize = currentDataGrouping && currentDataGrouping.totalRange,
        gapSize = this.options.gapSize,
        points = this.points.slice(),
        i = points.length - 1,
        yAxis = this.yAxis,
        xRange,
        stack;

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
     * @type    {Number}
     * @see     [gapUnit](plotOptions.series.gapUnit) and
     *          [xAxis.breaks](#xAxis.breaks)
     * @sample  {highstock} stock/plotoptions/series-gapsize/
     *          Setting the gap size to 2 introduces gaps for weekends in daily
     *          datasets.
     * @default 0
     * @product highstock
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
     * @type {String}
     * @see [gapSize](plotOptions.series.gapSize)
     * @default relative
     * @validvalue ["relative", "value"]
     * @since 5.0.13
     * @product highstock
     * @apioption plotOptions.series.gapUnit
     */

    if (gapSize && i > 0) { // #5008

        // Gap unit is relative
        if (this.options.gapUnit !== 'value') {
            gapSize *= this.closestPointRange;
        }

        // Setting a new gapSize in case dataGrouping is enabled (#7686)
        if (groupingSize && groupingSize > gapSize) {
            gapSize = groupingSize;
        }

        // extension for ordinal breaks
        while (i--) {
            if (points[i + 1].x - points[i].x > gapSize) {
                xRange = (points[i].x + points[i + 1].x) / 2;

                points.splice( // insert after this one
                    i + 1,
                    0,
                    {
                        isNull: true,
                        x: xRange
                    }
                );

                // For stacked chart generate empty stack items, #6546
                if (this.options.stacking) {
                    stack = yAxis.stacks[this.stackKey][xRange] =
                        new H.StackItem(
                            yAxis,
                            yAxis.options.stackLabels,
                            false,
                            xRange,
                            this.stack
                        );
                    stack.total = 0;
                }
            }
        }
    }

    // Call base method
    return this.getGraphPath(points);
};

wrap(H.seriesTypes.column.prototype, 'drawPoints', drawPointsWrapped);
wrap(H.Series.prototype, 'drawPoints', drawPointsWrapped);
