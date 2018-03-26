/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from './Globals.js';
import './Utilities.js';
var Axis = H.Axis,
    getMagnitude = H.getMagnitude,
    normalizeTickInterval = H.normalizeTickInterval,
    timeUnits = H.timeUnits;
/**
 * Set the tick positions to a time unit that makes sense, for example
 * on the first of each month or on every Monday. Return an array
 * with the time positions. Used in datetime axes as well as for grouping
 * data on a datetime axis.
 *
 * @param {Object} normalizedInterval
 *        The interval in axis values (ms) and thecount
 * @param {Number} min The minimum in axis values
 * @param {Number} max The maximum in axis values
 * @param {Number} startOfWeek
 */
Axis.prototype.getTimeTicks = function () {
    return this.chart.time.getTimeTicks.apply(this.chart.time, arguments);
};

/**
 * Get a normalized tick interval for dates. Returns a configuration object with
 * unit range (interval), count and name. Used to prepare data for getTimeTicks.
 * Previously this logic was part of getTimeTicks, but as getTimeTicks now runs
 * of segments in stock charts, the normalizing logic was extracted in order to
 * prevent it for running over again for each segment having the same interval.
 * #662, #697.
 */
Axis.prototype.normalizeTimeTickInterval = function (
    tickInterval,
    unitsOption
) {
    var units = unitsOption || [[
            'millisecond', // unit name
            [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
        ], [
            'second',
            [1, 2, 5, 10, 15, 30]
        ], [
            'minute',
            [1, 2, 5, 10, 15, 30]
        ], [
            'hour',
            [1, 2, 3, 4, 6, 8, 12]
        ], [
            'day',
            [1, 2]
        ], [
            'week',
            [1, 2]
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ], [
            'year',
            null
        ]],
        unit = units[units.length - 1], // default unit is years
        interval = timeUnits[unit[0]],
        multiples = unit[1],
        count,
        i;

    // loop through the units to find the one that best fits the tickInterval
    for (i = 0; i < units.length; i++) {
        unit = units[i];
        interval = timeUnits[unit[0]];
        multiples = unit[1];


        if (units[i + 1]) {
            // lessThan is in the middle between the highest multiple and the
            // next unit.
            var lessThan = (interval * multiples[multiples.length - 1] +
                        timeUnits[units[i + 1][0]]) / 2;

            // break and keep the current unit
            if (tickInterval <= lessThan) {
                break;
            }
        }
    }

    // prevent 2.5 years intervals, though 25, 250 etc. are allowed
    if (interval === timeUnits.year && tickInterval < 5 * interval) {
        multiples = [1, 2, 5];
    }

    // get the count
    count = normalizeTickInterval(
        tickInterval / interval,
        multiples,
        unit[0] === 'year' ?
            Math.max(getMagnitude(tickInterval / interval), 1) : // #1913, #2360
            1
    );

    return {
        unitRange: interval,
        count: count,
        unitName: unit[0]
    };
};
