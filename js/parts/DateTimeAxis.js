/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
var Axis = H.Axis,
	defined = H.defined,
	each = H.each,
	extend = H.extend,
	getMagnitude = H.getMagnitude,
	normalizeTickInterval = H.normalizeTickInterval,
	pick = H.pick,
	timeUnits = H.timeUnits;
/**
 * Set the tick positions to a time unit that makes sense, for example
 * on the first of each month or on every Monday. Return an array
 * with the time positions. Used in datetime axes as well as for grouping
 * data on a datetime axis.
 *
 * @param {Object} normalizedInterval The interval in axis values (ms) and the count
 * @param {Number} min The minimum in axis values
 * @param {Number} max The maximum in axis values
 * @param {Number} startOfWeek
 */
Axis.prototype.getTimeTicks = function (normalizedInterval, min, max, startOfWeek) {
	var time = this.chart.time,
		Date = time.Date,
		tickPositions = [],
		i,
		higherRanks = {},
		minYear, // used in months and years as a basis for Date.UTC()
		// When crossing DST, use the max. Resolves #6278.
		minDate = new Date(
			min - Math.max(
				time.getTimezoneOffset(min),
				time.getTimezoneOffset(max)
			)
		),
		interval = normalizedInterval.unitRange,
		count = normalizedInterval.count,
		baseOffset, // #6797
		variableDayLength;

	if (defined(min)) { // #1300
		minDate[time.setMilliseconds](interval >= timeUnits.second ? 0 : // #3935
			count * Math.floor(minDate.getMilliseconds() / count)); // #3652, #3654

		if (interval >= timeUnits.second) { // second
			minDate[time.setSeconds](interval >= timeUnits.minute ? 0 : // #3935
				count * Math.floor(minDate.getSeconds() / count));
		}

		if (interval >= timeUnits.minute) { // minute
			minDate[time.setMinutes](interval >= timeUnits.hour ? 0 :
				count * Math.floor(minDate[time.getMinutes]() / count));
		}

		if (interval >= timeUnits.hour) { // hour
			minDate[time.setHours](interval >= timeUnits.day ? 0 :
				count * Math.floor(minDate[time.getHours]() / count));
		}

		if (interval >= timeUnits.day) { // day
			minDate[time.setDate](interval >= timeUnits.month ? 1 :
				count * Math.floor(minDate[time.getDate]() / count));
		}

		if (interval >= timeUnits.month) { // month
			minDate[time.setMonth](interval >= timeUnits.year ? 0 :
				count * Math.floor(minDate[time.getMonth]() / count));
			minYear = minDate[time.getFullYear]();
		}

		if (interval >= timeUnits.year) { // year
			minYear -= minYear % count;
			minDate[time.setFullYear](minYear);
		}

		// week is a special case that runs outside the hierarchy
		if (interval === timeUnits.week) {
			// get start of current week, independent of count
			minDate[time.setDate](minDate[time.getDate]() - minDate[time.getDay]() +
				pick(startOfWeek, 1));
		}


		// Get basics for variable time spans
		minYear = minDate[time.getFullYear]();
		var minMonth = minDate[time.getMonth](),
			minDateDate = minDate[time.getDate](),
			minHours = minDate[time.getHours]();
		
		// Redefine min to the floored/rounded minimum time (#7432)
		min = minDate.getTime();

		// Handle local timezone offset
		if (time.variableTimezone) {

			// Detect whether we need to take the DST crossover into
			// consideration. If we're crossing over DST, the day length may be
			// 23h or 25h and we need to compute the exact clock time for each
			// tick instead of just adding hours. This comes at a cost, so first
			// we find out if it is needed (#4951).
			variableDayLength = (
				// Long range, assume we're crossing over.
				max - min > 4 * timeUnits.month ||
				// Short range, check if min and max are in different time 
				// zones.
				time.getTimezoneOffset(min) !== time.getTimezoneOffset(max)
			);
		}


		// Adjust minDate to the offset date
		baseOffset = time.getTimezoneOffset(minDate);
		if (baseOffset) {
			minDate = new Date(min + baseOffset);
		}
		

		// Iterate and add tick positions at appropriate values
		var t = minDate.getTime();
		i = 1;
		while (t < max) {
			tickPositions.push(t);

			// if the interval is years, use Date.UTC to increase years
			if (interval === timeUnits.year) {
				t = time.makeTime(minYear + i * count, 0);

			// if the interval is months, use Date.UTC to increase months
			} else if (interval === timeUnits.month) {
				t = time.makeTime(minYear, minMonth + i * count);

			// if we're using global time, the interval is not fixed as it jumps
			// one hour at the DST crossover
			} else if (
					variableDayLength &&
					(interval === timeUnits.day || interval === timeUnits.week)
				) {
				t = time.makeTime(minYear, minMonth, minDateDate +
					i * count * (interval === timeUnits.day ? 1 : 7));

			} else if (
				variableDayLength &&
				interval === timeUnits.hour &&
				count > 1
			) {
				// make sure higher ranks are preserved across DST (#6797,
				// #7621)
				t = time.makeTime(
					minYear,
					minMonth,
					minDateDate,
					minHours + i * count
				);

			// else, the interval is fixed and we use simple addition
			} else {
				t += interval * count;
			}

			i++;
		}

		// push the last time
		tickPositions.push(t);


		// Handle higher ranks. Mark new days if the time is on midnight
		// (#950, #1649, #1760, #3349). Use a reasonable dropout threshold to 
		// prevent looping over dense data grouping (#6156).
		if (interval <= timeUnits.hour && tickPositions.length < 10000) {
			each(tickPositions, function (t) {
				if (
					// Speed optimization, no need to run dateFormat unless
					// we're on a full or half hour
					t % 1800000 === 0 &&
					// Check for local or global midnight
					time.dateFormat('%H%M%S%L', t) === '000000000'
				) {
					higherRanks[t] = 'day';	
				}
			});
		}
	}


	// record information on the chosen unit - for dynamic label formatter
	tickPositions.info = extend(normalizedInterval, {
		higherRanks: higherRanks,
		totalRange: interval * count
	});

	return tickPositions;
};

/**
 * Get a normalized tick interval for dates. Returns a configuration object with
 * unit range (interval), count and name. Used to prepare data for getTimeTicks.
 * Previously this logic was part of getTimeTicks, but as getTimeTicks now runs
 * of segments in stock charts, the normalizing logic was extracted in order to
 * prevent it for running over again for each segment having the same interval.
 * #662, #697.
 */
Axis.prototype.normalizeTimeTickInterval = function (tickInterval, unitsOption) {
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
			// lessThan is in the middle between the highest multiple and the next unit.
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
		unit[0] === 'year' ? Math.max(getMagnitude(tickInterval / interval), 1) : 1 // #1913, #2360
	);

	return {
		unitRange: interval,
		count: count,
		unitName: unit[0]
	};
};
