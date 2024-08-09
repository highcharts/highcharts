/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type TickPositionsArray from './Axis/TickPositionsArray';
import type TimeTicksInfoObject from './Axis/TimeTicksInfoObject';

import H from './Globals.js';
const {
    win
} = H;
import U from './Utilities.js';
const {
    defined,
    error,
    extend,
    isNumber,
    isObject,
    isString,
    merge,
    objectEach,
    pad,
    splat,
    timeUnits
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module './Options' {
    interface Options {
        time?: Time.TimeOptions;
    }
}

declare module './Axis/TickPositionsArray'{
    interface TickPositionsArray {
        info?: TimeTicksInfoObject;
    }
}

/* *
 *
 *  Constants
 *
 * */

// To do: Remove this when we no longer need support for Safari < v14.1
const hasOldSafariBug =
    H.isSafari &&
    win.Intl &&
    !win.Intl.DateTimeFormat.prototype.formatRange;

// We use the Spanish locale for internal weekday handling because it uses
// unique letters for narrow weekdays
const spanishWeekdayIndex = (weekday: string): number =>
    ['D', 'L', 'M', 'X', 'J', 'V', 'S'].indexOf(weekday);

/* *
 *
 *  Class
 *
 * */

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
 * const chart = Highcharts.chart('container', {
 *     time: {
 *         timezone: 'America/New_York'
 *     },
 *     series: [{
 *         data: [1, 4, 3, 5]
 *     }]
 * });
 *
 * // Use the Time object of a chart instance
 * console.log(
 *        'Current time in New York',
 *        chart.time.dateFormat('%Y-%m-%d %H:%M:%S', Date.now())
 * );
 *
 * // Standalone use
 * const time = new Highcharts.Time({
 *    timezone: 'America/New_York'
 * });
 * const s = time.dateFormat('%Y-%m-%d %H:%M:%S', Date.UTC(2020, 0, 1));
 * console.log(s); // => 2019-12-31 19:00:00
 *
 * @since 6.0.5
 *
 * @class
 * @name Highcharts.Time
 *
 * @param {Highcharts.TimeOptions} [options]
 * Time options as defined in [chart.options.time](/highcharts/time).
 */
class Time {

    public dTLCache!: Record<string, Intl.DateTimeFormat>;

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        options?: Time.TimeOptions
    ) {
        this.update(options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public options: Time.TimeOptions = {};

    public timezone?: string;

    public variableTimezone: boolean = false;

    public Date: typeof Date = win.Date;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Update the Time object with current options. It is called internally on
     * initializing Highcharts, after running `Highcharts.setOptions` and on
     * `Chart.update`.
     *
     * @private
     * @function Highcharts.Time#update
     *
     * @param {Highcharts.TimeOptions} [options]
     *
     */
    public update(
        options: Time.TimeOptions = {}
    ): void {

        let timezone = options.timezone;

        this.dTLCache = {};
        this.options = options = merge(true, this.options, options);

        const { timezoneOffset, useUTC = true } = options;

        // Allow using a different Date class
        this.Date = options.Date || win.Date || Date;

        timezone ??= useUTC ? 'UTC' : void 0;

        // The Etc/GMT time zones do not support offsets with half-hour
        // resolutions
        if (timezoneOffset && timezoneOffset % 60 === 0) {
            timezone = 'Etc/GMT' + (
                (timezoneOffset > 0 ? '+' : '')
            ) + timezoneOffset / 60;
        }

        /*
         * The time object has options allowing for variable time zones, meaning
         * the axis ticks or series data needs to consider this.
         */
        this.variableTimezone = timezone !== 'UTC' &&
            timezone?.indexOf('Etc/GMT') !== 0;

        this.timezone = timezone;
    }

    /**
     * Get a date in terms of numbers (year, month, day etc) for further
     * processing. Takes the current `timezone` setting into account. Inverse
     * of `makeTime`.
     *
     * The date is returned in array format with the following indices:
     *
     * 0: year,
     * 1: month (zero based),
     * 2: day,
     * 3: hours,
     * 4: minutes,
     * 5: seconds,
     * 6: milliseconds,
     * 7: weekday (Sunday as 0)
     *
     * @function Highcharts.Time#toParts
     *
     * @param {number} [timestamp]
     *                 The timestamp in milliseconds since January 1st 1970.
     *
     * @return {Array<number>} The date parts array format.
     */
    public toParts(timestamp?: number): number[] {
        const [
            weekday,
            dayOfMonth,
            month,
            year,
            hours,
            minutes,
            seconds
        ]: (number|string)[] = this.dateTimeFormat({
            weekday: 'narrow',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }, timestamp, 'es')
            .split(/(?:, |\/|:)/g);

        return [
            year,
            +month - 1,
            dayOfMonth,
            hours,
            minutes,
            seconds,
            // Milliseconds
            Math.floor(timestamp || 0) % 1000,
            // Weekday index
            spanishWeekdayIndex(weekday)
        ].map(Number);
    }

    /**
     * Shorthand to get a cached `Intl.DateTimeFormat` instance.
     */
    private dateTimeFormat(
        options: Intl.DateTimeFormatOptions,
        timestamp?: number|Date,
        locale?: string
    ): string {
        const cacheKey = JSON.stringify(options) + locale;

        let dTL = this.dTLCache[cacheKey];

        if (!dTL) {
            options = extend({
                timeZone: this.timezone
            }, options);
            try {
                dTL = new Intl.DateTimeFormat(locale, options);
            } catch (e) {
                if (/Invalid time zone/i.test((e as Error).message)) {
                    error(34);
                    options.timeZone = 'UTC';
                }
                dTL = new Intl.DateTimeFormat(locale, options);
            }
        }

        this.dTLCache[cacheKey] = dTL;

        return dTL.format(timestamp);
    }

    /**
     * Make a time and returns milliseconds. Similar to `Date.UTC`, but takes
     * the current `timezone` setting into account.
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
    public makeTime(
        year: number,
        month: number,
        date?: number,
        hours?: number,
        minutes?: number,
        seconds?: number,
        milliseconds?: number
    ): number {
        // eslint-disable-next-line new-cap
        let d = this.Date.UTC(
            year,
            month || 0,
            date ?? 1,
            hours || 0,
            minutes || 0,
            seconds || 0,
            milliseconds || 0
        );
        const offset = this.getTimezoneOffset(d);
        d += offset;
        const newOffset = this.getTimezoneOffset(d);

        if (offset !== newOffset) {
            d += newOffset - offset;

        // A special case for transitioning from summer time to winter time.
        // When the clock is set back, the same time is repeated twice, i.e.
        // 02:30 am is repeated since the clock is set back from 3 am to 2 am.
        // We need to make the same time as local Date does.
        } else if (
            offset - 36e5 === this.getTimezoneOffset(d - 36e5) &&
            !hasOldSafariBug
        ) {
            d -= 36e5;
        }
        return d;
    }

    /**
     * Parse a datetime string. Unless the string contains time zone
     * information, apply the current `timezone` from options. If the argument
     * is a number, return it.
     *
     * @function Highcharts.Time#parse
     * @param    {string|number|undefined} s The datetime string to parse
     * @return   {number|undefined}          Parsed JavaScript timestamp
     */
    public parse(s: string|number|undefined|null): number|undefined {
        if (!isString(s)) {
            return s ?? void 0;
        }
        s = s
            // Firefox fails on YYYY/MM/DD
            .replace(/\//g, '-')
            // Replace some non-standard notations
            .replace(/(GMT|UTC)/, '');
        // Extend shorthand hour timezone offset like +02
        // .replace(/([+-][0-9]{2})$/, '$1:00');

        const ts = Date.parse(s);

        if (isNumber(ts)) {
            // Unless the string contains time zone information, convert from
            // the local time result of `Date.parse` via UTC into the current
            // timezone of the time object.
            if (!/[+-][0-9]{2}:?[0-9]{2}|Z$/.test(s)) {
                // MMMM-YY-DD is parsed as UTC, all other formats are local
                // unless a time zone is specified
                const parsedAsUTC = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(s),
                    tsUTC = ts - (
                        parsedAsUTC ?
                            0 :
                            new Date(ts).getTimezoneOffset() * 60000
                    );
                return tsUTC + this.getTimezoneOffset(tsUTC);
            }
            return ts;
        }
    }

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
    public getTimezoneOffset(timestamp: number|Date): number {
        if (this.timezone !== 'UTC') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [date, gmt, hours, colon, minutes = 0] =
                this.dateTimeFormat(
                    { timeZoneName: 'shortOffset' },
                    timestamp,
                    'en'
                )
                    .split(/(GMT|:)/)
                    .map(Number),
                offset = -(hours + minutes / 60) * 60 * 60000;

            // Possible future NaNs stop here
            if (isNumber(offset)) {
                return offset;
            }
        }
        return 0;
    }

    /**
     * Formats a JavaScript date timestamp (milliseconds since Jan 1st 1970)
     * into a human readable date string. The available format keys are listed
     * below. Additional formats can be given in the
     * {@link Highcharts.dateFormats} hook.
     *
     * Supported format keys:
     * - `%a`: Short weekday, like 'Mon'
     * - `%A`: Long weekday, like 'Monday'
     * - `%d`: Two digit day of the month, 01 to 31
     * - `%e`: Day of the month, 1 through 31
     * - `%w`: Day of the week, 0 through 6
     * - `%b`: Short month, like 'Jan'
     * - `%B`: Long month, like 'January'
     * - `%m`: Two digit month number, 01 through 12
     * - `%y`: Two digits year, like 09 for 2009
     * - `%Y`: Four digits year, like 2009
     * - `%H`: Two digits hours in 24h format, 00 through 23
     * - `%k`: Hours in 24h format, 0 through 23
     * - `%I`: Two digits hours in 12h format, 00 through 11
     * - `%l`: Hours in 12h format, 1 through 12
     * - `%M`: Two digits minutes, 00 through 59
     * - `%p`: Upper case AM or PM
     * - `%P`: Lower case AM or PM
     * - `%S`: Two digits seconds, 00 through 59
     * - `%L`: Milliseconds (naming from Ruby)
     *
     * @example
     * const time = new Highcharts.Time();
     * const s = time.dateFormat('%Y-%m-%d %H:%M:%S', Date.UTC(2020, 0, 1));
     * console.log(s); // => 2020-01-01 00:00:00
     *
     * @function Highcharts.Time#dateFormat
     *
     * @param {string} format
     *        The desired format where various time representations are
     *        prefixed with %.
     *
     * @param {number} [timestamp]
     *        The JavaScript timestamp.
     *
     * @param {boolean} [capitalize=false]
     *        Upper case first letter in the return.
     *
     * @return {string}
     *         The formatted date.
     */
    public dateFormat(
        format: string,
        timestamp?: number,
        capitalize?: boolean
    ): string {
        if (!defined(timestamp) || isNaN(timestamp)) {
            return H.defaultOptions.lang?.invalidDate || '';
        }
        format = format ?? '%Y-%m-%d %H:%M:%S';

        const time = this,
            [
                fullYear,
                month,
                dayOfMonth,
                hours,
                minutes,
                seconds,
                milliseconds,
                weekday
            ] = this.toParts(timestamp),
            lang = H.defaultOptions.lang,
            langWeekdays = (lang && lang.weekdays as any),
            shortWeekdays = (lang && lang.shortWeekdays),

            // List all format keys. Custom formats can be added from the
            // outside.
            replacements = extend(
                {

                    // Day
                    // Short weekday, like 'Mon'
                    a: shortWeekdays ?
                        shortWeekdays[weekday] :
                        langWeekdays[weekday].substr(0, 3),
                    // Long weekday, like 'Monday'
                    A: langWeekdays[weekday],
                    // Two digit day of the month, 01 to 31
                    d: pad(dayOfMonth),
                    // Day of the month, 1 through 31
                    e: pad(dayOfMonth, 2, ' '),
                    // Day of the week, 0 through 6
                    w: weekday,

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
                    M: pad(minutes),
                    // Upper case AM or PM
                    p: hours < 12 ? 'AM' : 'PM',
                    // Lower case AM or PM
                    P: hours < 12 ? 'am' : 'pm',
                    // Two digits seconds, 00 through 59
                    S: pad(seconds),
                    // Milliseconds (naming from Ruby)
                    L: pad(milliseconds, 3)
                },

                H.dateFormats
            );

        // Do the replaces
        objectEach(replacements, function (
            val: (string|Function),
            key: string
        ): void {
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
            (
                format.substr(0, 1).toUpperCase() +
                format.substr(1)
            ) :
            format;
    }

    /**
     * Resolve legacy formats of dateTimeLabelFormats (strings and arrays) into
     * an object.
     * @private
     * @param {string|Array<T>|Highcharts.Dictionary<T>} f
     * General format description
     * @return {Highcharts.Dictionary<T>}
     * The object definition
     */
    public resolveDTLFormat(
        f: Time.DateTimeLabelFormatOption
    ): Time.DateTimeLabelFormatObject {
        if (!isObject(f, true)) { // Check for string or array
            f = splat(f);
            return {
                main: f[0],
                from: f[1],
                to: f[2]
            };
        }
        return f;
    }

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
     * Time positions
     */
    public getTimeTicks(
        normalizedInterval: Time.TimeNormalizedObject,
        min?: number,
        max?: number,
        startOfWeek?: number
    ): TickPositionsArray {
        const time = this,
            tickPositions = [] as TickPositionsArray,
            higherRanks = {} as Record<string, string>,
            { count = 1, unitRange } = normalizedInterval;

        let [
                year,
                month,
                dayOfMonth,
                hours,
                minutes,
                seconds
            ] = time.toParts(min),
            milliseconds = (min || 0) % 1000,
            variableDayLength: boolean|undefined;

        startOfWeek ??= 1;

        if (defined(min)) { // #1300
            milliseconds = unitRange >= timeUnits.second ?
                0 : // #3935
                count * Math.floor(milliseconds / count);

            if (unitRange >= timeUnits.second) { // Second
                seconds = unitRange >= timeUnits.minute ?
                    0 : // #3935
                    count * Math.floor(seconds / count);
            }


            if (unitRange >= timeUnits.minute) { // Minute
                minutes = unitRange >= timeUnits.hour ?
                    0 :
                    count * Math.floor(minutes / count);
            }

            if (unitRange >= timeUnits.hour) { // Hour
                hours = unitRange >= timeUnits.day ?
                    0 :
                    count * Math.floor(hours / count);
            }

            if (unitRange >= timeUnits.day) { // Day
                dayOfMonth = unitRange >= timeUnits.month ?
                    1 :
                    Math.max(
                        1,
                        count * Math.floor(dayOfMonth / count)
                    );
            }

            if (unitRange >= timeUnits.month) { // Month
                month = unitRange >= timeUnits.year ? 0 :
                    count * Math.floor(month / count);
            }

            if (unitRange >= timeUnits.year) { // Year
                year -= year % count;
            }

            // Week is a special case that runs outside the hierarchy
            if (unitRange === timeUnits.week) {
                if (count) {
                    min = time.makeTime(
                        year,
                        month,
                        dayOfMonth,
                        hours,
                        minutes,
                        seconds,
                        milliseconds
                    );
                }

                // Get start of current week, independent of count
                const weekday = this.dateTimeFormat({
                        timeZone: this.timezone,
                        weekday: 'narrow'
                    }, min, 'es'),
                    weekdayNo = spanishWeekdayIndex(weekday);

                dayOfMonth += -weekdayNo + startOfWeek +
                    // We don't want to skip days that are before
                    // startOfWeek (#7051)
                    (weekdayNo < startOfWeek ? -7 : 0);

            }

            min = time.makeTime(
                year,
                month,
                dayOfMonth,
                hours,
                minutes,
                seconds,
                milliseconds
            );

            // Handle local timezone offset
            if (time.variableTimezone && defined(max)) {
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
                    time.getTimezoneOffset(max)
                );
            }

            // Iterate and add tick positions at appropriate values
            let t = min,
                i = 1;
            while (t < (max as any)) {
                tickPositions.push(t);

                // Increase the years
                if (unitRange === timeUnits.year) {
                    t = time.makeTime(year + i * count, 0);

                // Increase the months
                } else if (unitRange === timeUnits.month) {
                    t = time.makeTime(year, month + i * count);

                // If we're using local time, the interval is not fixed as it
                // jumps one hour at the DST crossover
                } else if (
                    variableDayLength && (
                        unitRange === timeUnits.day ||
                        unitRange === timeUnits.week
                    )
                ) {
                    t = time.makeTime(
                        year,
                        month,
                        dayOfMonth +
                            i * count * (unitRange === timeUnits.day ? 1 : 7)
                    );

                } else if (
                    variableDayLength &&
                    unitRange === timeUnits.hour &&
                    count > 1
                ) {
                    // Make sure higher ranks are preserved across DST (#6797,
                    // #7621)
                    t = time.makeTime(
                        year,
                        month,
                        dayOfMonth,
                        hours + i * count
                    );

                // Else, the interval is fixed and we use simple addition
                } else {
                    t += unitRange * count;
                }

                i++;
            }

            // Push the last time
            tickPositions.push(t);


            // Handle higher ranks. Mark new days if the time is on midnight
            // (#950, #1649, #1760, #3349). Use a reasonable dropout threshold
            // to prevent looping over dense data grouping (#6156).
            if (unitRange <= timeUnits.hour && tickPositions.length < 10000) {
                tickPositions.forEach((t: number): void => {
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


        // Record information on the chosen unit - for dynamic label formatter
        tickPositions.info = extend<Time.TimeNormalizedObject|TimeTicksInfoObject>(
            normalizedInterval,
            {
                higherRanks,
                totalRange: unitRange * count
            }
        ) as TimeTicksInfoObject;

        return tickPositions;
    }

    /**
     * Get the optimal date format for a point, based on a range.
     *
     * @private
     * @function Highcharts.Time#getDateFormat
     *
     * @param {number} range
     *        The time range
     *
     * @param {number} timestamp
     *        The timestamp of the date
     *
     * @param {number} startOfWeek
     *        An integer representing the first day of the week, where 0 is
     *        Sunday.
     *
     * @param {Highcharts.Dictionary<string>} dateTimeLabelFormats
     *        A map of time units to formats.
     *
     * @return {string}
     *         The optimal date format for a point.
     */
    public getDateFormat(
        range: number,
        timestamp: number,
        startOfWeek: number,
        dateTimeLabelFormats: Time.DateTimeLabelFormatsOption
    ): string|undefined {
        const dateStr = this.dateFormat('%m-%d %H:%M:%S.%L', timestamp),
            blank = '01-01 00:00:00.000',
            strpos = {
                millisecond: 15,
                second: 12,
                minute: 9,
                hour: 6,
                day: 3
            } as Record<Time.TimeUnit, number>;

        let n: Time.TimeUnit = 'millisecond',
            // For sub-millisecond data, #4223
            lastN: Time.TimeUnit = n;

        for (n in timeUnits) { // eslint-disable-line guard-for-in
            // If the range is exactly one week and we're looking at a
            // Sunday/Monday, go for the week format
            if (
                range === timeUnits.week &&
                +this.dateFormat('%w', timestamp) === startOfWeek &&
                dateStr.substr(6) === blank.substr(6)
            ) {
                n = 'week';
                break;
            }

            // The first format that is too great for the range
            if (timeUnits[n] > range) {
                n = lastN;
                break;
            }

            // If the point is placed every day at 23:59, we need to show
            // the minutes as well. #2637.
            if (
                strpos[n] &&
                dateStr.substr(strpos[n]) !== blank.substr(strpos[n])
            ) {
                break;
            }

            // Weeks are outside the hierarchy, only apply them on
            // Mondays/Sundays like in the first condition
            if (n !== 'week') {
                lastN = n;
            }
        }

        return this.resolveDTLFormat(dateTimeLabelFormats[n]).main;
    }
}

/* *
 *
 * Class namespace
 *
 * */

namespace Time {
    export interface DateTimeLabelFormatObject {
        from?: string;
        list?: string[];
        main: string;
        range?: boolean;
        to?: string;
    }
    export type DateTimeLabelFormatOption = (
        string|
        Array<string>|
        Time.DateTimeLabelFormatObject
    );
    export type DateTimeLabelFormatsOption = (
        Record<TimeUnit, DateTimeLabelFormatOption>
    );
    export interface TimeOptions {
        Date?: any;
        /// getTimezoneOffset?: Function;
        timezone?: string;
        timezoneOffset?: number;
        useUTC?: boolean;
    }
    export interface TimeFormatCallbackFunction {
        (timestamp: number): string;
    }
    export interface TimeNormalizedObject {
        count: number;
        unitName: TimeUnit;
        unitRange: number;
    }
    export type TimeUnit = (
        'millisecond'|
        'second'|
        'minute'|
        'hour'|
        'day'|
        'week'|
        'month'|
        'year'
    );
    export type TimeUnitValue = (
        'Date'|
        'Day'|
        'FullYear'|
        'Hours'|
        'Milliseconds'|
        'Minutes'|
        'Month'|
        'Seconds'
    );
}

/* *
 *
 * Default export
 *
 * */

export default Time;

/* *
 *
 * API Declarations
 *
 * */

/**
 * Normalized interval.
 *
 * @interface Highcharts.TimeNormalizedObject
 *//**
 * The count.
 *
 * @name Highcharts.TimeNormalizedObject#count
 * @type {number|undefined}
 *//**
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
 * Time ticks.
 *
 * @interface Highcharts.AxisTickPositionsArray
 * @extends global.Array<number>
 *//**
 * @name Highcharts.AxisTickPositionsArray#info
 * @type {Highcharts.TimeTicksInfoObject|undefined}
 */

/**
 * A callback to return the time zone offset for a given datetime. It
 * takes the timestamp in terms of milliseconds since January 1 1970,
 * and returns the timezone offset in minutes. This provides a hook
 * for drawing time based charts in specific time zones using their
 * local DST crossover dates, with the help of external libraries.
 *
 * @callback Highcharts.TimezoneOffsetCallbackFunction
 *
 * @param {number} timestamp
 * Timestamp in terms of milliseconds since January 1 1970.
 *
 * @return {number}
 * Timezone offset in minutes.
 */

''; // Keeps doclets above in JS file
