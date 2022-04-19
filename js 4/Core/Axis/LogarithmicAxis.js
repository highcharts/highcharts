/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import U from '../Utilities.js';
var addEvent = U.addEvent, getMagnitude = U.getMagnitude, normalizeTickInterval = U.normalizeTickInterval, pick = U.pick;
/* *
 *
 *  Class
 *
 * */
/**
 * @private
 */
var LogarithmicAxis;
(function (LogarithmicAxis) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Constants
     *
     * */
    var composedClasses = [];
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Provides logarithmic support for axes.
     * @private
     */
    function compose(AxisClass) {
        if (composedClasses.indexOf(AxisClass) === -1) {
            composedClasses.push(AxisClass);
            AxisClass.keepProps.push('logarithmic');
            addEvent(AxisClass, 'init', onInit);
            addEvent(AxisClass, 'afterInit', onAfterInit);
        }
        return AxisClass;
    }
    LogarithmicAxis.compose = compose;
    /**
     * @private
     */
    function onInit(e) {
        var axis = this;
        var options = e.userOptions;
        var logarithmic = axis.logarithmic;
        if (options.type !== 'logarithmic') {
            axis.logarithmic = void 0;
        }
        else {
            if (!logarithmic) {
                logarithmic = axis.logarithmic = new Additions(axis);
            }
        }
    }
    /**
     * @private
     */
    function onAfterInit() {
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
    }
    /* *
     *
     *  Class
     *
     * */
    /**
     * Provides logarithmic support for axes.
     * @private
     * @class
     */
    var Additions = /** @class */ (function () {
        /* *
        *
        *  Constructors
        *
        * */
        function Additions(axis) {
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
        Additions.prototype.getLogTickPositions = function (interval, min, max, minor) {
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
                var roundedMin = Math.floor(min);
                var intermediate = void 0, i = void 0, j = void 0, len = void 0, pos = void 0, lastPos = void 0, break2 = void 0;
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
                // Third case: We are so deep in between whole logarithmic values,
                // that we might as well handle the tick positions like a linear
                // axis. For example 1.01, 1.02, 1.03, 1.04.
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
        Additions.prototype.lin2log = function (num) {
            return Math.pow(10, num);
        };
        Additions.prototype.log2lin = function (num) {
            return Math.log(num) / Math.LN10;
        };
        return Additions;
    }());
    LogarithmicAxis.Additions = Additions;
})(LogarithmicAxis || (LogarithmicAxis = {}));
/* *
 *
 *  Default Export
 *
 * */
export default LogarithmicAxis;
