/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
/* eslint max-len: ["warn", { "ignoreUrls": true}] */
'use strict';
import Highcharts from './Globals.js';

var H = Highcharts,
	defined = H.defined,
	each = H.each,
	extend = H.extend,
	merge = H.merge,
	pick = H.pick,
	timeUnits = H.timeUnits,
	win = H.win;

/**
 * The Time class. Time settings are applied in general for each page using
 * `Highcharts.setOptions`, or individually for each Chart item through the
 * [time](https://api.highcharts.com/highcharts/time) options set.
 *
 * The Time object is available from
 * [Chart.time](http://api.highcharts.com/class-reference/Highcharts.Chart#.time),
 * which refers to  `Highcharts.time` if no individual time settings are
 * applied.
 *
 * @example
 * // Apply time settings globally
 * Highcharts.setOptions({
 *     time: {
 *         timezone: 'Europe/London'
 *     }
 * });
 * 
 * // Apply time settings by instance
 * var chart = Highcharts.chart('container', {
 *     time: {
 *         timezone: 'America/New_York'
 *     },
 *     series: [{
 *         data: [1, 4, 3, 5]
 *     }]
 * });
 *
 * // Use the Time object
 * console.log(
 * 	   'Current time in New York',
 *	    chart.time.dateFormat('%Y-%m-%d %H:%M:%S', Date.now())
 * );
 *
 * @param  options {Object}
 *         Time options as defined in [chart.options.time](/highcharts/time).
 * @since  6.0.5
 * @class
 */
Highcharts.Time = function (options) {
	this.update(options, false);
};

Highcharts.Time.prototype = {

	/**
	 * Time options that can apply globally or to individual charts. These
	 * settings affect how `datetime` axes are laid out, how tooltips are
	 * formatted, how series
	 * [pointIntervalUnit](#plotOptions.series.pointIntervalUnit) works and how
	 * the Highstock range selector handles time.
	 * 
	 * The common use case is that all charts in the same Highcharts object
	 * share the same time settings, in which case the global settings are set
	 * using `setOptions`.
	 * 
	 * ```js
	 * // Apply time settings globally
	 * Highcharts.setOptions({
	 *     time: {
	 *         timezone: 'Europe/London'
	 *     }
	 * });
	 * // Apply time settings by instance
	 * var chart = Highcharts.chart('container', {
	 *     time: {
	 *         timezone: 'America/New_York'
	 *     },
	 *     series: [{
	 *         data: [1, 4, 3, 5]
	 *     }]
	 * });
	 *
	 * // Use the Time object
	 * console.log(
	 * 	   'Current time in New York',
	 *	    chart.time.dateFormat('%Y-%m-%d %H:%M:%S', Date.now())
	 * );
	 * ```
	 *
	 * Since v6.0.5, the time options were moved from the `global` obect to the
	 * `time` object, and time options can be set on each individual chart.
	 *
	 * @sample {highcharts|highstock}
	 *         highcharts/time/timezone/
	 *         Set the timezone globally
	 * @sample {highcharts}
	 *         highcharts/time/individual/
	 *         Set the timezone per chart instance
	 * @sample {highstock}
	 *         stock/time/individual/
	 *         Set the timezone per chart instance
	 * @since 6.0.5
	 * @apioption time
	 */
	defaultOptions: {
		/**
		 * Whether to use UTC time for axis scaling, tickmark placement and
		 * time display in `Highcharts.dateFormat`. Advantages of using UTC
		 * is that the time displays equally regardless of the user agent's
		 * time zone settings. Local time can be used when the data is loaded
		 * in real time or when correct Daylight Saving Time transitions are
		 * required.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/time/useutc-true/ True by default
		 * @sample {highcharts} highcharts/time/useutc-false/ False
		 * @apioption time.useUTC
		 * @default true
		 */

		/**
		 * A custom `Date` class for advanced date handling. For example,
		 * [JDate](https://githubcom/tahajahangir/jdate) can be hooked in to
		 * handle Jalali dates.
		 * 
		 * @type {Object}
		 * @since 4.0.4
		 * @product highcharts highstock
		 * @apioption time.Date
		 */

		/**
		 * A callback to return the time zone offset for a given datetime. It
		 * takes the timestamp in terms of milliseconds since January 1 1970,
		 * and returns the timezone offset in minutes. This provides a hook
		 * for drawing time based charts in specific time zones using their
		 * local DST crossover dates, with the help of external libraries.
		 * 
		 * @type {Function}
		 * @see [global.timezoneOffset](#global.timezoneOffset)
		 * @sample {highcharts|highstock}
		 *         highcharts/time/gettimezoneoffset/
		 *         Use moment.js to draw Oslo time regardless of browser locale
		 * @since 4.1.0
		 * @product highcharts highstock
		 * @apioption time.getTimezoneOffset
		 */

		/**
		 * Requires [moment.js](http://momentjs.com/). If the timezone option
		 * is specified, it creates a default
		 * [getTimezoneOffset](#time.getTimezoneOffset) function that looks
		 * up the specified timezone in moment.js. If moment.js is not included,
		 * this throws a Highcharts error in the console, but does not crash the
		 * chart.
		 * 
		 * @type {String}
		 * @see [getTimezoneOffset](#time.getTimezoneOffset)
		 * @sample {highcharts|highstock}
		 *         highcharts/time/timezone/
		 *         Europe/Oslo
		 * @default undefined
		 * @since 5.0.7
		 * @product highcharts highstock
		 * @apioption time.timezone
		 */		

		/**
		 * The timezone offset in minutes. Positive values are west, negative
		 * values are east of UTC, as in the ECMAScript
		 * [getTimezoneOffset](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset)
		 * method. Use this to display UTC based data in a predefined time zone.
		 * 
		 * @type {Number}
		 * @see [time.getTimezoneOffset](#time.getTimezoneOffset)
		 * @sample {highcharts|highstock}
		 *         highcharts/time/timezoneoffset/
		 *         Timezone offset
		 * @default 0
		 * @since 3.0.8
		 * @product highcharts highstock
		 * @apioption time.timezoneOffset
		 */

	},

	/**
	 * Update the Time object with current options. It is called internally on
	 * initiating Highcharts, after running `Highcharts.setOptions` and on
	 * `Chart.update`.
	 *
	 * @private
	 */
	update: function (options) {
		var useUTC = pick(options && options.useUTC, true),
			getters = ['Minutes', 'Hours', 'Day', 'Date', 'Month', 'FullYear'],
			setters = getters.concat(['Milliseconds', 'Seconds']),
			n,
			time = this;

		this.options = options = merge(true, this.options || {}, options);

		// Allow using a different Date class
		this.Date = options.Date || win.Date;

		this.useUTC = useUTC;
		this.timezoneOffset = useUTC && options.timezoneOffset;

		/**
		 * Get the time zone offset based on the current timezone information as
		 * set in the global options.
		 *
		 * @function #getTimezoneOffset
		 * @memberOf Highcharts.Time
		 * @param  {Number} timestamp
		 *         The JavaScript timestamp to inspect.
		 * @return {Number}
		 *         The timezone offset in minutes compared to UTC.
		 */
		this.getTimezoneOffset = this.timezoneOffsetFunction();

		/*
		 * The time object has options allowing for variable time zones, meaning
		 * the axis ticks or series data needs to consider this.
		 */
		this.variableTimezone = !!(
			options.getTimezoneOffset ||
			options.timezone
		);

		// Dynamically set setters and getters. Sets strings pointing to the
		// appropriate Date function to use depending on useUTC. Use `for` loop,
		// H.each is not yet overridden in oldIE.
		for (n = 0; n < getters.length; n++) {
			this['get' + getters[n]] = (useUTC ? 'getUTC' : 'get') + getters[n];
		}
		for (n = 0; n < setters.length; n++) {
			this['set' + setters[n]] = (useUTC ? 'setUTC' : 'set') + setters[n];
		}

		// UTC time with timezone handling
		// @todo Optimize for lower levels - no need to adjust to timezone
		// when dealing with minutes (except half hour time zones), seconds
		// and milliseconds
		if (this.variableTimezone) {
			this.get = function (unit, date) {
				var realMs = date.getTime(),
					ms = realMs - time.getTimezoneOffset(date),
					ret;

				date.setTime(ms); // Temporary adjust to timezone
				ret = date['getUTC' + unit]();
				date.setTime(realMs); // Reset

				return ret;
			};
			this.set = function (unit, date, value) {
				var ms;

				// Adjust by timezone
				ms = date.getTime() - time.getTimezoneOffset(date);
				date.setTime(ms);

				date['setUTC' + unit](value);
				ms = date.getTime() + time.getTimezoneOffset(date);
				date.setTime(ms);

			};

		// UTC time with no timezone handling
		} else if (useUTC) {
			this.get = function (unit, date) {
				return date['getUTC' + unit]();
			};
			this.set = function (unit, date, value) {
				return date['setUTC' + unit](value);
			};

		// Local time
		} else {
			this.get = function (unit, date) {
				return date['get' + unit]();
			};
			this.set = function (unit, date, value) {
				return date['set' + unit](value);
			};
		}

	},

	/**
	 * Make a time and returns milliseconds. Interprets the inputs as UTC time,
	 * local time or a specific timezone time depending on the current time
	 * settings.
	 * 
	 * @param  {Number} year
	 *         The year
	 * @param  {Number} month
	 *         The month. Zero-based, so January is 0.
	 * @param  {Number} date
	 *         The day of the month
	 * @param  {Number} hours
	 *         The hour of the day, 0-23.
	 * @param  {Number} minutes
	 *         The minutes
	 * @param  {Number} seconds
	 *         The seconds
	 *
	 * @return {Number}
	 *         The time in milliseconds since January 1st 1970.
	 */
	makeTime: function (year, month, date, hours, minutes, seconds) {
		var d, offset, newOffset;
		if (this.useUTC) {
			d = this.Date.UTC.apply(0, arguments);
			offset = this.getTimezoneOffset(d);
			d += offset;
			newOffset = this.getTimezoneOffset(d);
				
			if (offset !== newOffset) {
				d += newOffset - offset;
			}

		} else {
			d = new this.Date(
				year,
				month,
				pick(date, 1),
				pick(hours, 0),
				pick(minutes, 0),
				pick(seconds, 0)
			).getTime();
		}
		return d;
	},

	/**
	 * Sets the getTimezoneOffset function. If the `timezone` option is set, a
	 * default getTimezoneOffset function with that timezone is returned. If
	 * a `getTimezoneOffset` option is defined, it is returned. If neither are
	 * specified, the function using the `timezoneOffset` option or 0 offset is
	 * returned.
	 *
	 * @private
	 * @return {Function} A getTimezoneOffset function
	 */
	timezoneOffsetFunction: function () {
		var time = this,
			options = this.options,
			moment = win.moment;

		if (!this.useUTC) {
			return function (timestamp) {
				return new Date(timestamp).getTimezoneOffset() * 60000;
			};
		}

		if (options.timezone) {
			if (!moment) {
				// getTimezoneOffset-function stays undefined because it depends
				// on Moment.js
				H.error(25);
				
			} else {
				return function (timestamp) {
					return -moment.tz(
						timestamp,
						options.timezone
					).utcOffset() * 60000;
				};
			}
		}

		// If not timezone is set, look for the getTimezoneOffset callback
		if (this.useUTC && options.getTimezoneOffset) {
			return function (timestamp) {
				return options.getTimezoneOffset(timestamp) * 60000;
			};
		}

		// Last, use the `timezoneOffset` option if set
		return function () {
			return (time.timezoneOffset || 0) * 60000;
		};
	},

	/**
	 * Formats a JavaScript date timestamp (milliseconds since Jan 1st 1970)
	 * into a human readable date string. The format is a subset of the formats
	 * for PHP's [strftime](http://www.php.net/manual/en/function.strftime.php)
	 * function. Additional formats can be given in the
	 * {@link Highcharts.dateFormats} hook.
	 *
	 * @param {String} format
	 *        The desired format where various time
	 *        representations are prefixed with %.
	 * @param {Number} timestamp
	 *        The JavaScript timestamp.
	 * @param {Boolean} [capitalize=false]
	 *        Upper case first letter in the return.
	 * @returns {String} The formatted date.
	 */
	dateFormat: function (format, timestamp, capitalize) {
		if (!H.defined(timestamp) || isNaN(timestamp)) {
			return H.defaultOptions.lang.invalidDate || '';
		}
		format = H.pick(format, '%Y-%m-%d %H:%M:%S');

		var time = this,
			D = this.Date,
			date = new D(timestamp - this.getTimezoneOffset(timestamp)),
			// get the basic time values
			hours = date[this.getHours](),
			day = date[this.getDay](),
			dayOfMonth = date[this.getDate](),
			month = date[this.getMonth](),
			fullYear = date[this.getFullYear](),
			lang = H.defaultOptions.lang,
			langWeekdays = lang.weekdays,
			shortWeekdays = lang.shortWeekdays,
			pad = H.pad,

			// List all format keys. Custom formats can be added from the
			// outside. 
			replacements = H.extend(
				{

					// Day
					// Short weekday, like 'Mon'
					'a': shortWeekdays ?
						shortWeekdays[day] :
						langWeekdays[day].substr(0, 3),
					// Long weekday, like 'Monday'
					'A': langWeekdays[day],
					// Two digit day of the month, 01 to 31
					'd': pad(dayOfMonth),
					// Day of the month, 1 through 31
					'e': pad(dayOfMonth, 2, ' '),
					'w': day,

					// Week (none implemented)
					// 'W': weekNumber(),

					// Month
					// Short month, like 'Jan'
					'b': lang.shortMonths[month],
					// Long month, like 'January'
					'B': lang.months[month],
					// Two digit month number, 01 through 12
					'm': pad(month + 1),

					// Year
					// Two digits year, like 09 for 2009
					'y': fullYear.toString().substr(2, 2),
					// Four digits year, like 2009
					'Y': fullYear,

					// Time
					// Two digits hours in 24h format, 00 through 23
					'H': pad(hours),
					// Hours in 24h format, 0 through 23
					'k': hours,
					// Two digits hours in 12h format, 00 through 11
					'I': pad((hours % 12) || 12),
					// Hours in 12h format, 1 through 12
					'l': (hours % 12) || 12,
					// Two digits minutes, 00 through 59
					'M': pad(date[this.getMinutes]()),
					// Upper case AM or PM
					'p': hours < 12 ? 'AM' : 'PM',
					// Lower case AM or PM
					'P': hours < 12 ? 'am' : 'pm',
					// Two digits seconds, 00 through  59
					'S': pad(date.getSeconds()),
					// Milliseconds (naming from Ruby)
					'L': pad(Math.round(timestamp % 1000), 3)
				},
				
				/**
				 * A hook for defining additional date format specifiers. New
				 * specifiers are defined as key-value pairs by using the
				 * specifier as key, and a function which takes the timestamp as
				 * value. This function returns the formatted portion of the
				 * date.
				 *
				 * @type {Object}
				 * @name dateFormats
				 * @memberOf Highcharts
				 * @sample highcharts/global/dateformats/
				 *         Adding support for week
				 * number
				 */
				H.dateFormats
			);


		// Do the replaces
		H.objectEach(replacements, function (val, key) {
			// Regex would do it in one line, but this is faster
			while (format.indexOf('%' + key) !== -1) {
				format = format.replace(
					'%' + key,
					typeof val === 'function' ? val.call(time, timestamp) : val
				);
			}
			
		});

		// Optionally capitalize the string and return
		return capitalize ?
			format.substr(0, 1).toUpperCase() + format.substr(1) :
			format;
	},

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
	getTimeTicks: function (
		normalizedInterval,
		min,
		max,
		startOfWeek
	) {
		var time = this,
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
			minDate[time.setMilliseconds](interval >= timeUnits.second ?
				0 : // #3935
				count * Math.floor(minDate.getMilliseconds() / count)
			); // #3652, #3654

			if (interval >= timeUnits.second) { // second
				minDate[time.setSeconds](interval >= timeUnits.minute ?
					0 : // #3935
					count * Math.floor(minDate.getSeconds() / count)
				);
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
				minDate[time.setDate](
					minDate[time.getDate]() -
					minDate[time.getDay]() +
					pick(startOfWeek, 1)
				);
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
					t = time.makeTime(
						minYear,
						minMonth,
						minDateDate +
							i * count * (interval === timeUnits.day ? 1 : 7)
					);

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
	}

}; // end of Time

