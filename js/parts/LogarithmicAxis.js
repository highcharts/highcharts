/* *
 * (c) 2010-2019 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from './Globals.js';
import './Utilities.js';

var Axis = H.Axis,
    getMagnitude = H.getMagnitude,
    normalizeTickInterval = H.normalizeTickInterval,
    pick = H.pick;

/* ************************************************************************** *
 * Methods defined on the Axis prototype
 * ************************************************************************** */

/**
 * Set the tick positions of a logarithmic axis.
 *
 * @private
 * @function Highcharts.Axis#getLogTickPositions
 *
 * @param {number} interval
 *
 * @param {number} min
 *
 * @param {number} max
 *
 * @param {number} minor
 *
 * @return {Array<number>}
 */
Axis.prototype.getLogTickPositions = function (interval, min, max, minor) {
    var axis = this,
        options = axis.options,
        axisLength = axis.len,
        // Since we use this method for both major and minor ticks,
        // use a local variable and return the result
        positions = [];

    // Reset
    if (!minor) {
        axis._minorAutoInterval = null;
    }

    // First case: All ticks fall on whole logarithms: 1, 10, 100 etc.
    if (interval >= 0.5) {
        interval = Math.round(interval);
        positions = axis.getLinearTickPositions(interval, min, max);

    // Second case: We need intermediary ticks. For example
    // 1, 2, 4, 6, 8, 10, 20, 40 etc.
    } else if (interval >= 0.08) {
        var roundedMin = Math.floor(min),
            intermediate,
            i,
            j,
            len,
            pos,
            lastPos,
            break2;

        if (interval > 0.3) {
            intermediate = [1, 2, 4];

        // 0.2 equals five minor ticks per 1, 10, 100 etc
        } else if (interval > 0.15) {
            intermediate = [1, 2, 4, 6, 8];
        } else { // 0.1 equals ten minor ticks per 1, 10, 100 etc
            intermediate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        }

        for (i = roundedMin; i < max + 1 && !break2; i++) {
            len = intermediate.length;
            for (j = 0; j < len && !break2; j++) {
                pos = axis.log2lin(axis.lin2log(i) * intermediate[j]);
                // #1670, lastPos is #3113
                if (
                    pos > min &&
                    (!minor || lastPos <= max) &&
                    lastPos !== undefined
                ) {
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
    } else {
        var realMin = axis.lin2log(min),
            realMax = axis.lin2log(max),
            tickIntervalOption = minor ?
                this.getMinorTickInterval() :
                options.tickInterval,
            filteredTickIntervalOption = tickIntervalOption === 'auto' ?
                null :
                tickIntervalOption,
            tickPixelIntervalOption =
                options.tickPixelInterval / (minor ? 5 : 1),
            totalPixelLength = minor ?
                axisLength / axis.tickPositions.length :
                axisLength;

        interval = pick(
            filteredTickIntervalOption,
            axis._minorAutoInterval,
            (realMax - realMin) *
                tickPixelIntervalOption / (totalPixelLength || 1)
        );

        interval = normalizeTickInterval(
            interval,
            null,
            getMagnitude(interval)
        );

        positions = axis.getLinearTickPositions(
            interval,
            realMin,
            realMax
        ).map(axis.log2lin);

        if (!minor) {
            axis._minorAutoInterval = interval / 5;
        }
    }

    // Set the axis-level tickInterval variable
    if (!minor) {
        axis.tickInterval = interval;
    }
    return positions;
};

/**
 * @private
 * @function Highcharts.Axis#log2lin
 *
 * @param {number} num
 *
 * @return {number}
 */
Axis.prototype.log2lin = function (num) {
    return Math.log(num) / Math.LN10;
};

/**
 * @private
 * @function Highcharts.Axis#lin2log
 *
 * @param {number} num
 *
 * @return {number}
 */
Axis.prototype.lin2log = function (num) {
    return Math.pow(10, num);
};
