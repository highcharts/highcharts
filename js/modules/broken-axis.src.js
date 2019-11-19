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
import U from '../parts/Utilities.js';
var extend = U.extend, isArray = U.isArray, pick = U.pick;
import '../parts/Axis.js';
import '../parts/Series.js';
var addEvent = H.addEvent, find = H.find, fireEvent = H.fireEvent, Axis = H.Axis, Series = H.Series;
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
var findBreakAt = function (x, breaks) {
    return find(breaks, function (b) {
        return b.from < x && x < b.to;
    });
};
extend(Axis.prototype, {
    isInBreak: function (brk, val) {
        var ret, repeat = brk.repeat || Infinity, from = brk.from, length = brk.to - brk.from, test = (val >= from ?
            (val - from) % repeat :
            repeat - ((from - val) % repeat));
        if (!brk.inclusive) {
            ret = test < length && test !== 0;
        }
        else {
            ret = test <= length;
        }
        return ret;
    },
    isInAnyBreak: function (val, testKeep) {
        var breaks = this.options.breaks, i = breaks && breaks.length, inbrk, keep, ret;
        if (i) {
            while (i--) {
                if (this.isInBreak(breaks[i], val)) {
                    inbrk = true;
                    if (!keep) {
                        keep = pick(breaks[i].showPoints, !this.isXAxis);
                    }
                }
            }
            if (inbrk && testKeep) {
                ret = inbrk && !keep;
            }
            else {
                ret = inbrk;
            }
        }
        return ret;
    }
});
/* eslint-disable no-invalid-this */
addEvent(Axis, 'afterInit', function () {
    if (typeof this.setBreaks === 'function') {
        this.setBreaks(this.options.breaks, false);
    }
});
addEvent(Axis, 'afterSetTickPositions', function () {
    if (this.isBroken) {
        var axis = this, tickPositions = this.tickPositions, info = this.tickPositions.info, newPositions = [], i;
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
Axis.prototype.setBreaks = function (breaks, redraw) {
    var axis = this, isBroken = (isArray(breaks) && !!breaks.length);
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    function breakVal2Lin(val) {
        var nval = val, brk, i;
        for (i = 0; i < axis.breakArray.length; i++) {
            brk = axis.breakArray[i];
            if (brk.to <= val) {
                nval -= brk.len;
            }
            else if (brk.from >= val) {
                break;
            }
            else if (axis.isInBreak(brk, val)) {
                nval -= (val - brk.from);
                break;
            }
        }
        return nval;
    }
    /**
     * @private
     */
    function breakLin2Val(val) {
        var nval = val, brk, i;
        for (i = 0; i < axis.breakArray.length; i++) {
            brk = axis.breakArray[i];
            if (brk.from >= nval) {
                break;
            }
            else if (brk.to < nval) {
                nval += brk.len;
            }
            else if (axis.isInBreak(brk, nval)) {
                nval += brk.len;
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
    axis.series.forEach(function (series) {
        series.isDirty = true;
    });
    if (!isBroken && axis.val2lin === breakVal2Lin) {
        // Revert to prototype functions
        delete axis.val2lin;
        delete axis.lin2val;
    }
    if (isBroken) {
        axis.userOptions.ordinal = false;
        axis.val2lin = breakVal2Lin;
        axis.lin2val = breakLin2Val;
        axis.setExtremes = function (newMin, newMax, redraw, animation, eventArguments) {
            // If trying to set extremes inside a break, extend min to after,
            // and max to before the break ( #3857 )
            if (this.isBroken) {
                var axisBreak, breaks = this.options.breaks;
                while ((axisBreak = findBreakAt(newMin, breaks))) {
                    newMin = axisBreak.to;
                }
                while ((axisBreak = findBreakAt(newMax, breaks))) {
                    newMax = axisBreak.from;
                }
                // If both min and max is within the same break.
                if (newMax < newMin) {
                    newMax = newMin;
                }
            }
            Axis.prototype.setExtremes.call(this, newMin, newMax, redraw, animation, eventArguments);
        };
        axis.setAxisTranslation = function (saveOld) {
            Axis.prototype.setAxisTranslation.call(this, saveOld);
            this.unitLength = null;
            if (this.isBroken) {
                var breaks = axis.options.breaks, 
                // Temporary one:
                breakArrayT = [], breakArray = [], length = 0, inBrk, repeat, min = axis.userMin || axis.min, max = axis.userMax || axis.max, pointRangePadding = pick(axis.pointRangePadding, 0), start, i;
                // Min & max check (#4247)
                breaks.forEach(function (brk) {
                    repeat = brk.repeat || Infinity;
                    if (axis.isInBreak(brk, min)) {
                        min +=
                            (brk.to % repeat) -
                                (min % repeat);
                    }
                    if (axis.isInBreak(brk, max)) {
                        max -=
                            (max % repeat) -
                                (brk.from % repeat);
                    }
                });
                // Construct an array holding all breaks in the axis
                breaks.forEach(function (brk) {
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
                    return ((a.value === b.value) ?
                        ((a.move === 'in' ? 0 : 1) -
                            (b.move === 'in' ? 0 : 1)) :
                        a.value - b.value);
                });
                // Simplify the breaks
                inBrk = 0;
                start = min;
                breakArrayT.forEach(function (brk) {
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
                axis.unitLength =
                    max - min - length + pointRangePadding;
                fireEvent(axis, 'afterBreaks');
                if (axis.staticScale) {
                    axis.transA = axis.staticScale;
                }
                else if (axis.unitLength) {
                    axis.transA *=
                        (max - axis.min + pointRangePadding) /
                            axis.unitLength;
                }
                if (pointRangePadding) {
                    axis.minPixelPadding =
                        axis.transA * axis.minPointOffset;
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
addEvent(Series, 'afterGeneratePoints', function () {
    var _a = this, isDirty = _a.isDirty, connectNulls = _a.options.connectNulls, points = _a.points, xAxis = _a.xAxis, yAxis = _a.yAxis;
    /* Set, or reset visibility of the points. Axis.setBreaks marks the series
    as isDirty */
    if (isDirty) {
        var i = points.length;
        while (i--) {
            var point = points[i];
            // Respect nulls inside the break (#4275)
            var nullGap = point.y === null && connectNulls === false;
            var isPointInBreak = (!nullGap &&
                (xAxis && xAxis.isInAnyBreak(point.x, true) ||
                    yAxis && yAxis.isInAnyBreak(point.y, true)));
            // Set point.visible if in any break.
            // If not in break, reset visible to original value.
            point.visible = isPointInBreak ?
                false :
                point.options.visible !== false;
        }
    }
});
addEvent(Series, 'afterRender', function drawPointsWrapped() {
    this.drawBreaks(this.xAxis, ['x']);
    this.drawBreaks(this.yAxis, pick(this.pointArrayMap, ['y']));
});
/* eslint-enable no-invalid-this */
H.Series.prototype.drawBreaks = function (axis, keys) {
    var series = this, points = series.points, breaks, threshold, eventName, y;
    if (!axis) {
        return; // #5950
    }
    keys.forEach(function (key) {
        breaks = axis.breakArray || [];
        threshold = axis.isXAxis ?
            axis.min :
            pick(series.options.threshold, axis.min);
        points.forEach(function (point) {
            y = pick(point['stack' + key.toUpperCase()], point[key]);
            breaks.forEach(function (brk) {
                eventName = false;
                if ((threshold < brk.from &&
                    y > brk.to) ||
                    (threshold > brk.from &&
                        y < brk.from)) {
                    eventName = 'pointBreak';
                }
                else if ((threshold < brk.from &&
                    y > brk.from &&
                    y < brk.to) ||
                    (threshold > brk.from &&
                        y > brk.to &&
                        y < brk.from)) {
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
H.Series.prototype.gappedPath = function () {
    var currentDataGrouping = this.currentDataGrouping, groupingSize = currentDataGrouping && currentDataGrouping.gapSize, gapSize = this.options.gapSize, points = this.points.slice(), i = points.length - 1, yAxis = this.yAxis, stack;
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
            gapSize *= this.basePointRange;
        }
        // Setting a new gapSize in case dataGrouping is enabled (#7686)
        if (groupingSize &&
            groupingSize > gapSize &&
            // Except when DG is forced (e.g. from other series)
            // and has lower granularity than actual points (#11351)
            groupingSize >= this.basePointRange) {
            gapSize = groupingSize;
        }
        // extension for ordinal breaks
        var current = void 0, next = void 0;
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
            if (next.x - current.x > gapSize) {
                var xRange = (current.x + next.x) / 2;
                points.splice(// insert after this one
                i + 1, 0, {
                    isNull: true,
                    x: xRange
                });
                // For stacked chart generate empty stack items, #6546
                if (this.options.stacking) {
                    stack = yAxis.stacks[this.stackKey][xRange] =
                        new H.StackItem(yAxis, yAxis.options
                            .stackLabels, false, xRange, this.stack);
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
