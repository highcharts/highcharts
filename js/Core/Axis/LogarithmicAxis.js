/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Axis from './Axis.js';
import U from '../Utilities.js';
var addEvent = U.addEvent, getMagnitude = U.getMagnitude, normalizeTickInterval = U.normalizeTickInterval, pick = U.pick;
/* eslint-disable valid-jsdoc */
/**
 * Provides logarithmic support for axes.
 *
 * @private
 * @class
 */
var LogarithmicAxisAdditions = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function LogarithmicAxisAdditions(axis) {
        this.axis = axis;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Set the tick positions of a logarithmic axis.
     */
    LogarithmicAxisAdditions.prototype.getLogTickPositions = function (interval, min, max, minor) {
        var log = this;
        var axis = log.axis;
        var axisLength = axis.len;
        var options = axis.options;
        // Since we use this method for both major and minor ticks,
        // use a local variable and return the result
        var positions = [];
        // Reset
        if (!minor) {
            log.minorAutoInterval = void 0;
        }
        // First case: All ticks fall on whole logarithms: 1, 10, 100 etc.
        if (interval >= 0.5) {
            interval = Math.round(interval);
            positions = axis.getLinearTickPositions(interval, min, max);
            // Second case: We need intermediary ticks. For example
            // 1, 2, 4, 6, 8, 10, 20, 40 etc.
        }
        else if (interval >= 0.08) {
            var roundedMin = Math.floor(min), intermediate, i, j, len, pos, lastPos, break2;
            if (interval > 0.3) {
                intermediate = [1, 2, 4];
                // 0.2 equals five minor ticks per 1, 10, 100 etc
            }
            else if (interval > 0.15) {
                intermediate = [1, 2, 4, 6, 8];
            }
            else { // 0.1 equals ten minor ticks per 1, 10, 100 etc
                intermediate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            }
            for (i = roundedMin; i < max + 1 && !break2; i++) {
                len = intermediate.length;
                for (j = 0; j < len && !break2; j++) {
                    pos = log.log2lin(log.lin2log(i) * intermediate[j]);
                    // #1670, lastPos is #3113
                    if (pos > min &&
                        (!minor || lastPos <= max) &&
                        typeof lastPos !== 'undefined') {
                        positions.push(lastPos);
                    }
                    if (lastPos > max) {
                        break2 = true;
                    }
                    lastPos = pos;
                }
            }
            // Third case: We are so deep in between whole logarithmic values that
            // we might as well handle the tick positions like a linear axis. For
            // example 1.01, 1.02, 1.03, 1.04.
        }
        else {
            var realMin = log.lin2log(min), realMax = log.lin2log(max), tickIntervalOption = minor ?
                axis.getMinorTickInterval() :
                options.tickInterval, filteredTickIntervalOption = tickIntervalOption === 'auto' ?
                null :
                tickIntervalOption, tickPixelIntervalOption = options.tickPixelInterval / (minor ? 5 : 1), totalPixelLength = minor ?
                axisLength / axis.tickPositions.length :
                axisLength;
            interval = pick(filteredTickIntervalOption, log.minorAutoInterval, (realMax - realMin) *
                tickPixelIntervalOption / (totalPixelLength || 1));
            interval = normalizeTickInterval(interval, void 0, getMagnitude(interval));
            positions = axis.getLinearTickPositions(interval, realMin, realMax).map(log.log2lin);
            if (!minor) {
                log.minorAutoInterval = interval / 5;
            }
        }
        // Set the axis-level tickInterval variable
        if (!minor) {
            axis.tickInterval = interval;
        }
        return positions;
    };
    LogarithmicAxisAdditions.prototype.lin2log = function (num) {
        return Math.pow(10, num);
    };
    LogarithmicAxisAdditions.prototype.log2lin = function (num) {
        return Math.log(num) / Math.LN10;
    };
    return LogarithmicAxisAdditions;
}());
var LogarithmicAxis = /** @class */ (function () {
    function LogarithmicAxis() {
    }
    /**
     * Provides logarithmic support for axes.
     *
     * @private
     */
    LogarithmicAxis.compose = function (AxisClass) {
        AxisClass.keepProps.push('logarithmic');
        // HC <= 8 backwards compatibility, allow wrapping
        // Axis.prototype.lin2log and log2lin
        // @todo Remove this in next major
        var axisProto = AxisClass.prototype;
        var logAxisProto = LogarithmicAxisAdditions.prototype;
        axisProto.log2lin = logAxisProto.log2lin;
        axisProto.lin2log = logAxisProto.lin2log;
        /* eslint-disable no-invalid-this */
        addEvent(AxisClass, 'init', function (e) {
            var axis = this;
            var options = e.userOptions;
            var logarithmic = axis.logarithmic;
            if (options.type !== 'logarithmic') {
                axis.logarithmic = void 0;
            }
            else {
                if (!logarithmic) {
                    logarithmic = axis.logarithmic = new LogarithmicAxisAdditions(axis);
                }
                // HC <= 8 backwards compatibility, allow wrapping
                // Axis.prototype.lin2log and log2lin
                // @todo Remove this in next major
                if (axis.log2lin !== logarithmic.log2lin) {
                    logarithmic.log2lin = axis.log2lin.bind(axis);
                }
                if (axis.lin2log !== logarithmic.lin2log) {
                    logarithmic.lin2log = axis.lin2log.bind(axis);
                }
            }
        });
        addEvent(AxisClass, 'afterInit', function () {
            var axis = this;
            var log = axis.logarithmic;
            // extend logarithmic axis
            if (log) {
                axis.lin2val = function (num) {
                    return log.lin2log(num);
                };
                axis.val2lin = function (num) {
                    return log.log2lin(num);
                };
            }
        });
    };
    return LogarithmicAxis;
}());
LogarithmicAxis.compose(Axis); // @todo move to factory functions
export default LogarithmicAxis;
