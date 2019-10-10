/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Highcharts from './Globals.js';
import U from './Utilities.js';
var defined = U.defined, extend = U.extend, isObject = U.isObject, objectEach = U.objectEach, pick = U.pick, splat = U.splat;
/**
 * Normalized interval.
 *
 * @interface Highcharts.TimeNormalizedObject
 */ /**
* The count.
*
* @name Highcharts.TimeNormalizedObject#count
* @type {number}
*/ /**
* The interval in axis values (ms).
*
* @name Highcharts.TimeNormalizedObject#unitRange
* @type {number}
*/
/**
 * Function of an additional date format specifier.
 *
 * @callback Highcharts.TimeFormatCallbackFunction
 *
 * @param {number} timestamp
 *        The time to format.
 *
 * @return {string}
 *         The formatted portion of the date.
 */
/**
 * Additonal time tick information.
 *
 * @interface Highcharts.TimeTicksInfoObject
 * @augments Highcharts.TimeNormalizedObject
 */ /**
* @name Highcharts.TimeTicksInfoObject#higherRanks
* @type {Array<string>}
*/ /**
* @name Highcharts.TimeTicksInfoObject#totalRange
* @type {number}
*/
/**
 * Time ticks.
 *
 * @interface Highcharts.AxisTickPositionsArray
 */ /**
* @name Highcharts.AxisTickPositionsArray#info
* @type {Highcharts.TimeTicksInfoObject}
*/
var H = Highcharts, merge = H.merge, timeUnits = H.timeUnits, win = H.win;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * The Time class. Time settings are applied in general for each page using
 * `Highcharts.setOptions`, or individually for each Chart item through the
 * [time](https://api.highcharts.com/highcharts/time) options set.
 *
 * The Time object is available from {@link Highcharts.Chart#time},
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
 *        'Current time in New York',
 *        chart.time.dateFormat('%Y-%m-%d %H:%M:%S', Date.now())
 * );
 *
 * @class
 * @name Highcharts.Time
 *
 * @param {Highcharts.TimeOptions} options
 *        Time options as defined in [chart.options.time](/highcharts/time).
 *
 * @since 6.0.5
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
     *        'Current time in New York',
     *        chart.time.dateFormat('%Y-%m-%d %H:%M:%S', Date.now())
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
     *
     * @since     6.0.5
     * @optionparent time
     */
    defaultOptions: {
        /**
         * A custom `Date` class for advanced date handling. For example,
         * [JDate](https://github.com/tahajahangir/jdate) can be hooked in to
         * handle Jalali dates.
         *
         * @type      {*}
         * @since     4.0.4
         * @product   highcharts highstock gantt
         */
        Date: undefined,
        /**
         * A callback to return the time zone offset for a given datetime. It
         * takes the timestamp in terms of milliseconds since January 1 1970,
         * and returns the timezone offset in minutes. This provides a hook
         * for drawing time based charts in specific time zones using their
         * local DST crossover dates, with the help of external libraries.
         *
         * @see [global.timezoneOffset](#global.timezoneOffset)
         *
         * @sample {highcharts|highstock} highcharts/time/gettimezoneoffset/
         *         Use moment.js to draw Oslo time regardless of browser locale
         *
         * @since     4.1.0
         * @product   highcharts highstock gantt
         */
        getTimezoneOffset: undefined,
        /**
         * Requires [moment.js](http://momentjs.com/). If the timezone option
         * is specified, it creates a default
         * [getTimezoneOffset](#time.getTimezoneOffset) function that looks
         * up the specified timezone in moment.js. If moment.js is not included,
         * this throws a Highcharts error in the console, but does not crash the
         * chart.
         *
         * @see [getTimezoneOffset](#time.getTimezoneOffset)
         *
         * @sample {highcharts|highstock} highcharts/time/timezone/
         *         Europe/Oslo
         *
         * @type      {string}
         * @since     5.0.7
         * @product   highcharts highstock gantt
         */
        timezone: undefined,
        /**
         * The timezone offset in minutes. Positive values are west, negative
         * values are east of UTC, as in the ECMAScript
         * [getTimezoneOffset](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset)
         * method. Use this to display UTC based data in a predefined time zone.
         *
         * @see [time.getTimezoneOffset](#time.getTimezoneOffset)
         *
         * @sample {highcharts|highstock} highcharts/time/timezoneoffset/
         *         Timezone offset
         *
         * @since     3.0.8
         * @product   highcharts highstock gantt
         */
        timezoneOffset: 0,
        /**
         * Whether to use UTC time for axis scaling, tickmark placement and
         * time display in `Highcharts.dateFormat`. Advantages of using UTC
         * is that the time displays equally regardless of the user agent's
         * time zone settings. Local time can be used when the data is loaded
         * in real time or when correct Daylight Saving Time transitions are
         * required.
         *
         * @sample {highcharts} highcharts/time/useutc-true/
         *         True by default
         * @sample {highcharts} highcharts/time/useutc-false/
         *         False
         */
        useUTC: true
    },
    /**
     * Update the Time object with current options. It is called internally on
     * initializing Highcharts, after running `Highcharts.setOptions` and on
     * `Chart.update`.
     *
     * @private
     * @function Highcharts.Time#update
     *
     * @param {Highcharts.TimeOptions} options
     *
     * @return {void}
     */
    update: function (options) {
        var useUTC = pick(options && options.useUTC, true), time = this;
        this.options = options = merge(true, this.options || {}, options);
        // Allow using a different Date class
        this.Date = options.Date || win.Date || Date;
        this.useUTC = useUTC;
        this.timezoneOffset = (useUTC && options.timezoneOffset);
        /**
         * Get the time zone offset based on the current timezone information as
         * set in the global options.
         *
         * @function Highcharts.Time#getTimezoneOffset
         *
         * @param {number} timestamp
         *        The JavaScript timestamp to inspect.
         *
         * @return {number}
         *         The timezone offset in minutes compared to UTC.
         */
        this.getTimezoneOffset = this.timezoneOffsetFunction();
        /*
         * The time object has options allowing for variable time zones, meaning
         * the axis ticks or series data needs to consider this.
         */
        this.variableTimezone = !!(!useUTC ||
            options.getTimezoneOffset ||
            options.timezone);
        // UTC time with timezone handling
        if (this.variableTimezone || this.timezoneOffset) {
            this.get = function (unit, date) {
                var realMs = date.getTime(), ms = realMs - time.getTimezoneOffset(date), ret;
                date.setTime(ms); // Temporary adjust to timezone
                ret = date['getUTC' + unit]();
                date.setTime(realMs); // Reset
                return ret;
            };
            this.set = function (unit, date, value) {
                var ms, offset, newOffset;
                // For lower order time units, just set it directly using local
                // time
                if (unit === 'Milliseconds' ||
                    unit === 'Seconds' ||
                    // If we're dealting with minutes, we only need to
                    // consider timezone if we're in Indian time zones with
                    // half-hour offsets (#8768).
                    (unit === 'Minutes' &&
                        date.getTimezoneOffset() % 60 === 0)) {
                    date['set' + unit](value);
                    // Higher order time units need to take the time zone into
                    // account
                }
                else {
                    // Adjust by timezone
                    offset = time.getTimezoneOffset(date);
                    ms = date.getTime() - offset;
                    date.setTime(ms);
                    date['setUTC' + unit](value);
                    newOffset = time.getTimezoneOffset(date);
                    ms = date.getTime() + newOffset;
                    date.setTime(ms);
                }
            };
            // UTC time with no timezone handling
        }
        else if (useUTC) {
            this.get = function (unit, date) {
                return date['getUTC' + unit]();
            };
            this.set = function (unit, date, value) {
                return date['setUTC' + unit](value);
            };
            // Local time
        }
        else {
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
     * @function Highcharts.Time#makeTime
     *
     * @param {number} year
     *        The year
     *
     * @param {number} month
     *        The month. Zero-based, so January is 0.
     *
     * @param {number} [date=1]
     *        The day of the month
     *
     * @param {number} [hours=0]
     *        The hour of the day, 0-23.
     *
     * @param {number} [minutes=0]
     *        The minutes
     *
     * @param {number} [seconds=0]
     *        The seconds
     *
     * @return {number}
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
                // A special case for transitioning from summer time to winter time.
                // When the clock is set back, the same time is repeated twice, i.e.
                // 02:30 am is repeated since the clock is set back from 3 am to
                // 2 am. We need to make the same time as local Date does.
            }
            else if (offset - 36e5 === this.getTimezoneOffset(d - 36e5) &&
                !H.isSafari) {
                d -= 36e5;
            }
        }
        else {
            d = new this.Date(year, month, pick(date, 1), pick(hours, 0), pick(minutes, 0), pick(seconds, 0)).getTime();
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
     * @function Highcharts.Time#timezoneOffsetFunction
     *
     * @return {Function}
     *         A getTimezoneOffset function
     */
    timezoneOffsetFunction: function () {
        var time = this, options = this.options, moment = win.moment;
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
            }
            else {
                return function (timestamp) {
                    return -moment.tz(timestamp, options.timezone).utcOffset() * 60000;
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
     * @function Highcharts.Time#dateFormat
     *
     * @param {string} [format]
     *        The desired format where various time representations are
     *        prefixed with %.
     *
     * @param {number} timestamp
     *        The JavaScript timestamp.
     *
     * @param {boolean} [capitalize=false]
     *        Upper case first letter in the return.
     *
     * @return {string}
     *         The formatted date.
     */
    dateFormat: function (format, timestamp, capitalize) {
        if (!defined(timestamp) || isNaN(timestamp)) {
            return H.defaultOptions.lang.invalidDate || '';
        }
        format = pick(format, '%Y-%m-%d %H:%M:%S');
        var time = this, date = new this.Date(timestamp), 
        // get the basic time values
        hours = this.get('Hours', date), day = this.get('Day', date), dayOfMonth = this.get('Date', date), month = this.get('Month', date), fullYear = this.get('FullYear', date), lang = H.defaultOptions.lang, langWeekdays = lang.weekdays, shortWeekdays = lang.shortWeekdays, pad = H.pad, 
        // List all format keys. Custom formats can be added from the
        // outside.
        replacements = extend({
            // Day
            // Short weekday, like 'Mon'
            a: shortWeekdays ?
                shortWeekdays[day] :
                langWeekdays[day].substr(0, 3),
            // Long weekday, like 'Monday'
            A: langWeekdays[day],
            // Two digit day of the month, 01 to 31
            d: pad(dayOfMonth),
            // Day of the month, 1 through 31
            e: pad(dayOfMonth, 2, ' '),
            w: day,
            // Week (none implemented)
            // 'W': weekNumber(),
            // Month
            // Short month, like 'Jan'
            b: lang.shortMonths[month],
            // Long month, like 'January'
            B: lang.months[month],
            // Two digit month number, 01 through 12
            m: pad(month + 1),
            // Month number, 1 through 12 (#8150)
            o: month + 1,
            // Year
            // Two digits year, like 09 for 2009
            y: fullYear.toString().substr(2, 2),
            // Four digits year, like 2009
            Y: fullYear,
            // Time
            // Two digits hours in 24h format, 00 through 23
            H: pad(hours),
            // Hours in 24h format, 0 through 23
            k: hours,
            // Two digits hours in 12h format, 00 through 11
            I: pad((hours % 12) || 12),
            // Hours in 12h format, 1 through 12
            l: (hours % 12) || 12,
            // Two digits minutes, 00 through 59
            M: pad(time.get('Minutes', date)),
            // Upper case AM or PM
            p: hours < 12 ? 'AM' : 'PM',
            // Lower case AM or PM
            P: hours < 12 ? 'am' : 'pm',
            // Two digits seconds, 00 through  59
            S: pad(date.getSeconds()),
            // Milliseconds (naming from Ruby)
            L: pad(Math.floor(timestamp % 1000), 3)
        }, H.dateFormats);
        // Do the replaces
        objectEach(replacements, function (val, key) {
            // Regex would do it in one line, but this is faster
            while (format.indexOf('%' + key) !== -1) {
                format = format.replace('%' + key, typeof val === 'function' ? val.call(time, timestamp) : val);
            }
        });
        // Optionally capitalize the string and return
        return capitalize ?
            (format.substr(0, 1).toUpperCase() +
                format.substr(1)) :
            format;
    },
    /**
     * Resolve legacy formats of dateTimeLabelFormats (strings and arrays) into
     * an object.
     * @private
     * @param {string|Array<T>|Highcharts.Dictionary<T>} f - General format description
     * @return {Highcharts.Dictionary<T>} - The object definition
     */
    resolveDTLFormat: function (f) {
        if (!isObject(f, true)) { // check for string or array
            f = splat(f);
            return {
                main: f[0],
                from: f[1],
                to: f[2]
            };
        }
        return f;
    },
    /**
     * Return an array with time positions distributed on round time values
     * right and right after min and max. Used in datetime axes as well as for
     * grouping data on a datetime axis.
     *
     * @function Highcharts.Time#getTimeTicks
     *
     * @param {Highcharts.TimeNormalizedObject} normalizedInterval
     *        The interval in axis values (ms) and the count
     *
     * @param {number} [min]
     *        The minimum in axis values
     *
     * @param {number} [max]
     *        The maximum in axis values
     *
     * @param {number} [startOfWeek=1]
     *
     * @return {Highcharts.AxisTickPositionsArray}
     */
    getTimeTicks: function (normalizedInterval, min, max, startOfWeek) {
        var time = this, Date = time.Date, tickPositions = [], i, higherRanks = {}, minYear, // used in months and years as a basis for Date.UTC()
        // When crossing DST, use the max. Resolves #6278.
        minDate = new Date(min), interval = normalizedInterval.unitRange, count = normalizedInterval.count || 1, variableDayLength, minDay;
        startOfWeek = pick(startOfWeek, 1);
        if (defined(min)) { // #1300
            time.set('Milliseconds', minDate, interval >= timeUnits.second ?
                0 : // #3935
                count * Math.floor(time.get('Milliseconds', minDate) / count)); // #3652, #3654
            if (interval >= timeUnits.second) { // second
                time.set('Seconds', minDate, interval >= timeUnits.minute ?
                    0 : // #3935
                    count * Math.floor(time.get('Seconds', minDate) / count));
            }
            if (interval >= timeUnits.minute) { // minute
                time.set('Minutes', minDate, interval >= timeUnits.hour ?
                    0 :
                    count * Math.floor(time.get('Minutes', minDate) / count));
            }
            if (interval >= timeUnits.hour) { // hour
                time.set('Hours', minDate, interval >= timeUnits.day ?
                    0 :
                    count * Math.floor(time.get('Hours', minDate) / count));
            }
            if (interval >= timeUnits.day) { // day
                time.set('Date', minDate, interval >= timeUnits.month ?
                    1 :
                    Math.max(1, count * Math.floor(time.get('Date', minDate) / count)));
            }
            if (interval >= timeUnits.month) { // month
                time.set('Month', minDate, interval >= timeUnits.year ? 0 :
                    count * Math.floor(time.get('Month', minDate) / count));
                minYear = time.get('FullYear', minDate);
            }
            if (interval >= timeUnits.year) { // year
                minYear -= minYear % count;
                time.set('FullYear', minDate, minYear);
            }
            // week is a special case that runs outside the hierarchy
            if (interval === timeUnits.week) {
                // get start of current week, independent of count
                minDay = time.get('Day', minDate);
                time.set('Date', minDate, (time.get('Date', minDate) -
                    minDay + startOfWeek +
                    // We don't want to skip days that are before
                    // startOfWeek (#7051)
                    (minDay < startOfWeek ? -7 : 0)));
            }
            // Get basics for variable time spans
            minYear = time.get('FullYear', minDate);
            var minMonth = time.get('Month', minDate), minDateDate = time.get('Date', minDate), minHours = time.get('Hours', minDate);
            // Redefine min to the floored/rounded minimum time (#7432)
            min = minDate.getTime();
            // Handle local timezone offset
            if (time.variableTimezone) {
                // Detect whether we need to take the DST crossover into
                // consideration. If we're crossing over DST, the day length may
                // be 23h or 25h and we need to compute the exact clock time for
                // each tick instead of just adding hours. This comes at a cost,
                // so first we find out if it is needed (#4951).
                variableDayLength = (
                // Long range, assume we're crossing over.
                max - min > 4 * timeUnits.month ||
                    // Short range, check if min and max are in different time
                    // zones.
                    time.getTimezoneOffset(min) !==
                        time.getTimezoneOffset(max));
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
                }
                else if (interval === timeUnits.month) {
                    t = time.makeTime(minYear, minMonth + i * count);
                    // if we're using global time, the interval is not fixed as it
                    // jumps one hour at the DST crossover
                }
                else if (variableDayLength &&
                    (interval === timeUnits.day || interval === timeUnits.week)) {
                    t = time.makeTime(minYear, minMonth, minDateDate +
                        i * count * (interval === timeUnits.day ? 1 : 7));
                }
                else if (variableDayLength &&
                    interval === timeUnits.hour &&
                    count > 1) {
                    // make sure higher ranks are preserved across DST (#6797,
                    // #7621)
                    t = time.makeTime(minYear, minMonth, minDateDate, minHours + i * count);
                    // else, the interval is fixed and we use simple addition
                }
                else {
                    t += interval * count;
                }
                i++;
            }
            // push the last time
            tickPositions.push(t);
            // Handle higher ranks. Mark new days if the time is on midnight
            // (#950, #1649, #1760, #3349). Use a reasonable dropout threshold
            // to prevent looping over dense data grouping (#6156).
            if (interval <= timeUnits.hour && tickPositions.length < 10000) {
                tickPositions.forEach(function (t) {
                    if (
                    // Speed optimization, no need to run dateFormat unless
                    // we're on a full or half hour
                    t % 1800000 === 0 &&
                        // Check for local or global midnight
                        time.dateFormat('%H%M%S%L', t) === '000000000') {
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
