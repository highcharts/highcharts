/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
/* eslint max-len: ["warn", 80, 4] */
'use strict';
import H from './Globals.js';

var extend = H.extend,
	pick = H.pick,
	win = H.win;

/**
 * The Time class.
 *
 * @todo for #5168
 * - Search for direct access to time options in the code. For example, acess
 *   to defaultOptions.global.useUTC should be replaced with H.time.useUTC
 * - Implement time options on chart level
 * - Go over doclets, review class reference
 * - Mark global object time options deprecated
 * - Implement Chart.update and Chart.time.update
 */
var Time = H.Time = function (chart) {
	this.init(chart);
};

extend(Time.prototype, /** @lends Highcharts.Time.prototype */ {

	init: function (chart) {
		this.chart = chart;
		this.update(chart ? chart.global : H.defaultOptions.global);
	},

	/**
	 * Set the time methods globally based on the options. Time methods can be
	 * either local time or UTC (default). It is called internally on initiating
	 * Highcharts and after running `Highcharts.setOptions`.
	 *
	 * @private
	 */
	update: function (options) {
		var useUTC = options.useUTC,
			getters = ['Minutes', 'Hours', 'Day', 'Date', 'Month', 'FullYear'],
			setters = getters.concat(['Milliseconds', 'Seconds']),
			n;

		// Allow using a different Date class
		this.Date = options.Date || win.Date;

		this.useUTC = useUTC;
		this.timezoneOffset = useUTC && options.timezoneOffset;

		/**
		 * Get the time zone offset based on the current timezone information as
		 * set in the global options.
		 *
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
		var d;
		if (this.useUTC) {
			d = this.Date.UTC.apply(0, arguments);
			d += this.getTimezoneOffset(d);
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
	 * @return {Function} A getTimezoneOffset function
	 */
	timezoneOffsetFunction: function () {
		var time = this,
			globalOptions = H.defaultOptions.global,
			moment = win.moment;

		if (globalOptions.timezone) {
			if (!moment) {
				// getTimezoneOffset-function stays undefined because it depends
				// on Moment.js
				H.error(25);
				
			} else {
				return function (timestamp) {
					return -moment.tz(
						timestamp,
						globalOptions.timezone
					).utcOffset() * 60000;
				};
			}
		}

		// If not timezone is set, look for the getTimezoneOffset callback
		if (globalOptions.useUTC && globalOptions.getTimezoneOffset) {
			return function (timestamp) {
				return globalOptions.getTimezoneOffset(timestamp) * 60000;
			};
		}

		// Last, use the `timezoneOffset` option if set
		return function () {
			return (time.timezoneOffset || 0) * 60000;
		};
	},

	/**
	 * The dateFormat function. `Highcharts.dateFormat` redirects here.
	 *
	 * @private
	 */
	dateFormat: function (format, timestamp, capitalize) {
		if (!H.defined(timestamp) || isNaN(timestamp)) {
			return H.defaultOptions.lang.invalidDate || '';
		}
		format = H.pick(format, '%Y-%m-%d %H:%M:%S');

		var D = this.Date,
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
					typeof val === 'function' ? val(timestamp) : val
				);
			}
			
		});

		// Optionally capitalize the string and return
		return capitalize ?
			format.substr(0, 1).toUpperCase() + format.substr(1) :
			format;
	}

}); // end of Time

