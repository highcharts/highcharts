/* *
 *
 *  (c) 2009-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Axis from '../parts/Axis.js';
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var addEvent = U.addEvent, find = U.find, fireEvent = U.fireEvent, isArray = U.isArray, isNumber = U.isNumber, pick = U.pick;
import '../parts/Series.js';
import StackItem from '../parts/Stacking.js';
var Series = H.Series;
/* eslint-disable valid-jsdoc */
/**
 * Provides support for broken axes.
 * @private
 * @class
 */
var BrokenAxisAdditions = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function BrokenAxisAdditions(axis) {
        this.hasBreaks = false;
        this.axis = axis;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * @private
     */
    BrokenAxisAdditions.isInBreak = function (brk, val) {
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
    };
    /**
     * @private
     */
    BrokenAxisAdditions.lin2Val = function (val) {
        var axis = this;
        var brokenAxis = axis.brokenAxis;
        var breakArray = brokenAxis && brokenAxis.breakArray;
        if (!breakArray) {
            return val;
        }
        var nval = val, brk, i;
        for (i = 0; i < breakArray.length; i++) {
            brk = breakArray[i];
            if (brk.from >= nval) {
                break;
            }
            else if (brk.to < nval) {
                nval += brk.len;
            }
            else if (BrokenAxisAdditions.isInBreak(brk, nval)) {
                nval += brk.len;
            }
        }
        return nval;
    };
    /**
     * @private
     */
    BrokenAxisAdditions.val2Lin = function (val) {
        var axis = this;
        var brokenAxis = axis.brokenAxis;
        var breakArray = brokenAxis && brokenAxis.breakArray;
        if (!breakArray) {
            return val;
        }
        var nval = val, brk, i;
        for (i = 0; i < breakArray.length; i++) {
            brk = breakArray[i];
            if (brk.to <= val) {
                nval -= brk.len;
            }
            else if (brk.from >= val) {
                break;
            }
            else if (BrokenAxisAdditions.isInBreak(brk, val)) {
                nval -= (val - brk.from);
                break;
            }
        }
        return nval;
    };
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
    BrokenAxisAdditions.prototype.findBreakAt = function (x, breaks) {
        return find(breaks, function (b) {
            return b.from < x && x < b.to;
        });
    };
    /**
     * @private
     */
    BrokenAxisAdditions.prototype.isInAnyBreak = function (val, testKeep) {
        var brokenAxis = this;
        var axis = brokenAxis.axis;
        var breaks = axis.options.breaks, i = breaks && breaks.length, inbrk, keep, ret;
        if (i) {
            while (i--) {
                if (BrokenAxisAdditions.isInBreak(breaks[i], val)) {
                    inbrk = true;
                    if (!keep) {
                        keep = pick(breaks[i].showPoints, !axis.isXAxis);
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
    };
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
    BrokenAxisAdditions.prototype.setBreaks = function (breaks, redraw) {
        var brokenAxis = this;
        var axis = brokenAxis.axis;
        var hasBreaks = (isArray(breaks) && !!breaks.length);
        axis.isDirty = brokenAxis.hasBreaks !== hasBreaks;
        brokenAxis.hasBreaks = hasBreaks;
        axis.options.breaks = axis.userOptions.breaks = breaks;
        axis.forceRedraw = true; // Force recalculation in setScale
        // Recalculate series related to the axis.
        axis.series.forEach(function (series) {
            series.isDirty = true;
        });
        if (!hasBreaks && axis.val2lin === BrokenAxisAdditions.val2Lin) {
            // Revert to prototype functions
            delete axis.val2lin;
            delete axis.lin2val;
        }
        if (hasBreaks) {
            axis.userOptions.ordinal = false;
            axis.lin2val = BrokenAxisAdditions.lin2Val;
            axis.val2lin = BrokenAxisAdditions.val2Lin;
            axis.setExtremes = function (newMin, newMax, redraw, animation, eventArguments) {
                // If trying to set extremes inside a break, extend min to
                // after, and max to before the break ( #3857 )
                if (brokenAxis.hasBreaks) {
                    var axisBreak, breaks = this.options.breaks;
                    while ((axisBreak = brokenAxis.findBreakAt(newMin, breaks))) {
                        newMin = axisBreak.to;
                    }
                    while ((axisBreak = brokenAxis.findBreakAt(newMax, breaks))) {
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
                brokenAxis.unitLength = null;
                if (brokenAxis.hasBreaks) {
                    var breaks = axis.options.breaks || [], 
                    // Temporary one:
                    breakArrayT = [], breakArray = [], length = 0, inBrk, repeat, min = axis.userMin || axis.min, max = axis.userMax || axis.max, pointRangePadding = pick(axis.pointRangePadding, 0), start, i;
                    // Min & max check (#4247)
                    breaks.forEach(function (brk) {
                        repeat = brk.repeat || Infinity;
                        if (BrokenAxisAdditions.isInBreak(brk, min)) {
                            min +=
                                (brk.to % repeat) -
                                    (min % repeat);
                        }
                        if (BrokenAxisAdditions.isInBreak(brk, max)) {
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
                    /**
                     * HC <= 8 backwards compatibility, used by demo samples.
                     * @deprecated
                     * @private
                     * @requires modules/broken-axis
                     */
                    axis.breakArray = brokenAxis.breakArray = breakArray;
                    // Used with staticScale, and below the actual axis length,
                    // when breaks are substracted.
                    brokenAxis.unitLength = max - min - length + pointRangePadding;
                    fireEvent(axis, 'afterBreaks');
                    if (axis.staticScale) {
                        axis.transA = axis.staticScale;
                    }
                    else if (brokenAxis.unitLength) {
                        axis.transA *=
                            (max - axis.min + pointRangePadding) /
                                brokenAxis.unitLength;
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
            axis.chart.redraw();
        }
    };
    return BrokenAxisAdditions;
}());
/**
 * Axis with support of broken data rows.
 * @private
 * @class
 */
var BrokenAxis = /** @class */ (function () {
    function BrokenAxis() {
    }
    /**
     * Adds support for broken axes.
     * @private
     */
    BrokenAxis.compose = function (AxisClass, SeriesClass) {
        AxisClass.keepProps.push('brokenAxis');
        var seriesProto = Series.prototype;
        /**
         * @private
         */
        seriesProto.drawBreaks = function (axis, keys) {
            var series = this, points = series.points, breaks, threshold, eventName, y;
            if (axis && // #5950
                axis.brokenAxis &&
                axis.brokenAxis.hasBreaks) {
                var brokenAxis_1 = axis.brokenAxis;
                keys.forEach(function (key) {
                    breaks = brokenAxis_1 && brokenAxis_1.breakArray || [];
                    threshold = axis.isXAxis ?
                        axis.min :
                        pick(series.options.threshold, axis.min);
                    points.forEach(function (point) {
                        y = pick(point['stack' + key.toUpperCase()], point[key]);
                        breaks.forEach(function (brk) {
                            if (isNumber(threshold) && isNumber(y)) {
                                eventName = false;
                                if ((threshold < brk.from && y > brk.to) ||
                                    (threshold > brk.from && y < brk.from)) {
                                    eventName = 'pointBreak';
                                }
                                else if ((threshold < brk.from && y > brk.from && y < brk.to) ||
                                    (threshold > brk.from && y > brk.to && y < brk.from)) {
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
        seriesProto.gappedPath = function () {
            var currentDataGrouping = this.currentDataGrouping, groupingSize = currentDataGrouping && currentDataGrouping.gapSize, gapSize = this.options.gapSize, points = this.points.slice(), i = points.length - 1, yAxis = this.yAxis, stack;
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
                        if (yAxis.stacking && this.options.stacking) {
                            stack = yAxis.stacking.stacks[this.stackKey][xRange] =
                                new StackItem(yAxis, yAxis.options
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
        /* eslint-disable no-invalid-this */
        addEvent(AxisClass, 'init', function () {
            var axis = this;
            if (!axis.brokenAxis) {
                axis.brokenAxis = new BrokenAxisAdditions(axis);
            }
        });
        addEvent(AxisClass, 'afterInit', function () {
            if (typeof this.brokenAxis !== 'undefined') {
                this.brokenAxis.setBreaks(this.options.breaks, false);
            }
        });
        addEvent(AxisClass, 'afterSetTickPositions', function () {
            var axis = this;
            var brokenAxis = axis.brokenAxis;
            if (brokenAxis &&
                brokenAxis.hasBreaks) {
                var tickPositions = this.tickPositions, info = this.tickPositions.info, newPositions = [], i;
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
        addEvent(AxisClass, 'afterSetOptions', function () {
            if (this.brokenAxis && this.brokenAxis.hasBreaks) {
                this.options.ordinal = false;
            }
        });
        addEvent(SeriesClass, 'afterGeneratePoints', function () {
            var _a = this, isDirty = _a.isDirty, connectNulls = _a.options.connectNulls, points = _a.points, xAxis = _a.xAxis, yAxis = _a.yAxis;
            // Set, or reset visibility of the points. Axis.setBreaks marks the
            // series as isDirty
            if (isDirty) {
                var i = points.length;
                while (i--) {
                    var point = points[i];
                    // Respect nulls inside the break (#4275)
                    var nullGap = point.y === null && connectNulls === false;
                    var isPointInBreak = (!nullGap && ((xAxis &&
                        xAxis.brokenAxis &&
                        xAxis.brokenAxis.isInAnyBreak(point.x, true)) || (yAxis &&
                        yAxis.brokenAxis &&
                        yAxis.brokenAxis.isInAnyBreak(point.y, true))));
                    // Set point.visible if in any break.
                    // If not in break, reset visible to original value.
                    point.visible = isPointInBreak ?
                        false :
                        point.options.visible !== false;
                }
            }
        });
        addEvent(SeriesClass, 'afterRender', function drawPointsWrapped() {
            this.drawBreaks(this.xAxis, ['x']);
            this.drawBreaks(this.yAxis, pick(this.pointArrayMap, ['y']));
        });
    };
    return BrokenAxis;
}());
BrokenAxis.compose(Axis, Series); // @todo remove automatism
export default BrokenAxis;
