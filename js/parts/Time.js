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
 * - Review function naming and structure
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
			GET = useUTC ? 'getUTC' : 'get',
			SET = useUTC ? 'setUTC' : 'set',
			setters = ['Minutes', 'Hours', 'Day', 'Date', 'Month', 'FullYear'],
			getters = setters.concat(['Milliseconds', 'Seconds']),
			n;

		// Allow using a different Date class
		this.Date = options.Date || win.Date;

		this.useUTC = useUTC;
		this.timezoneOffset = useUTC && options.timezoneOffset;
		this.getTimezoneOffset = this.getTimezoneOffsetOption();
		this.hasTimeZone = !!(this.timezoneOffset || this.getTimezoneOffset);

		// Dynamically set setters and getters. Use for loop, H.each is not yet 
		// overridden in oldIE.
		for (n = 0; n < setters.length; n++) {
			this['get' + setters[n]] = GET + setters[n];
		}
		for (n = 0; n < getters.length; n++) {
			this['set' + getters[n]] = SET + getters[n];
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
			d += this.getTZOffset(d);
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
	 * Get the time zone offset based on the current timezone information as set
	 * in the global options.
	 *
	 * @param  {Number} timestamp
	 *         The JavaScript timestamp to inspect.
	 * @return {Number}
	 *         The timezone offset in minutes compared to UTC.
	 */
	getTZOffset: function (timestamp) {
		return (
			(
				this.getTimezoneOffset &&
				this.getTimezoneOffset(timestamp)
			) ||
			this.timezoneOffset || 0
		) * 60000;
	},

	/**
	 * Sets the getTimezoneOffset function. If the timezone option is set, a
	 * default getTimezoneOffset function with that timezone is returned. If
	 * not, the specified getTimezoneOffset function is returned. If neither are
	 * specified, undefined is returned.
	 * @return {function} A getTimezoneOffset function or undefined
	 */
	getTimezoneOffsetOption: function () {
		var globalOptions = H.defaultOptions.global,
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
					).utcOffset();
				};
			}
		}

		// If not timezone is set, look for the getTimezoneOffset callback
		return globalOptions.useUTC && globalOptions.getTimezoneOffset;
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
			date = new D(timestamp - this.getTZOffset(timestamp)),
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

