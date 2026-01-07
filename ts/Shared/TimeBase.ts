/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { LangOptionsCore } from './LangOptionsCore';

import H from '../Core/Globals.js';
const {
    pageLang,
    win
} = H;
import U from '../Core/Utilities.js';
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
    timeUnits,
    ucfirst
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Options' {
    interface Options {
        time?: TimeBase.TimeOptions;
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

const isDateTimeFormatOptions = (
    obj: Intl.DateTimeFormatOptions|TimeBase.DateTimeLabelFormatObject
): obj is Intl.DateTimeFormatOptions =>
    (obj as TimeBase.DateTimeLabelFormatObject).main === void 0;

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
 * The Time object is available from {@link Highcharts.Chart#time}, which refers
 * to  `Highcharts.time` unless individual time settings are applied for each
 * chart.
 *
 * When configuring time settings for individual chart instances, be aware that
 * using `Highcharts.dateFormat` or `Highcharts.time.dateFormat` within
 * formatter callbacks relies on the global time object, which applies the
 * global language and time zone settings. To ensure charts with local time
 * settings function correctly, use `chart.time.dateFormat? instead. However,
 * the recommended best practice is to use `setOptions` to define global time
 * settings unless specific configurations are needed for each chart.
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
 * @param {Highcharts.TimeOptions} [options] Time options as defined in
 * [chart.options.time](/highcharts/time).
 */
class TimeBase {

    public dTLCache!: Record<string, Intl.DateTimeFormat>;

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        options?: TimeBase.TimeOptions,
        lang?: LangOptionsCore
    ) {
        this.update(options);
        this.lang = lang;
    }

    /* *
     *
     *  Properties
     *
     * */

    public options: TimeBase.TimeOptions = {
        timezone: 'UTC'
    };

    private lang?: LangOptionsCore;

    public timezone?: string;

    public variableTimezone: boolean = false;

    public Date: typeof Date = win.Date;

    private months!: Array<string>;

    private shortMonths!: Array<string>;

    private weekdays!: Array<string>;

    private shortWeekdays!: Array<string>;


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
        options: TimeBase.TimeOptions = {}
    ): void {

        this.dTLCache = {};
        this.options = options = merge(true, this.options, options);

        const { timezoneOffset, useUTC, locale } = options;

        // Allow using a different Date class
        this.Date = options.Date || win.Date || Date;

        // Assign the time zone. Handle the legacy, deprecated `useUTC` option.
        let timezone = options.timezone;
        if (defined(useUTC)) {
            timezone = useUTC ? 'UTC' : void 0;
        }

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

        // Update locale.
        if (this.lang && locale) {
            this.lang.locale = locale;
        }

        // Assign default time formats from locale strings
        (
            ['months', 'shortMonths', 'weekdays', 'shortWeekdays'] as
            Array<'months'|'shortMonths'|'weekdays'|'shortWeekdays'>
        ).forEach(
            (name): void => {
                const isMonth = /months/i.test(name),
                    isShort = /short/.test(name),
                    options: TimeBase.DateTimeFormatOptions = {
                        timeZone: 'UTC'
                    };

                options[
                    isMonth ? 'month' : 'weekday'
                ] = isShort ? 'short' : 'long';
                this[name] = (
                    isMonth ?
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] :
                        [3, 4, 5, 6, 7, 8, 9]
                ).map(
                    (position): string => this.dateFormat(
                        options,
                        (isMonth ? 31 : 1) * 24 * 36e5 * position
                    )
                );
            }
        );
    }

    /**
     * Get a date in terms of numbers (year, month, day etc) for further
     * processing. Takes the current `timezone` setting into account. Inverse of
     * `makeTime` and the native `Date` constructor and `Date.UTC`.
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
     * @param {number|Date} [timestamp]
     *                 The timestamp in milliseconds since January 1st 1970.
     *                 A Date object is also accepted.
     *
     * @return {Array<number>} The date parts in array format.
     */
    public toParts(timestamp?: number|Date): number[] {
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
            // The ', ' splitter is for all modern browsers:
            //      L, 6/3/2023, 14:30:00
            // The ' ' splitter is for legacy Safari with no comma between date
            // and time (#22445):
            //      L, 6/3/2023 14:30:00
            .split(/(?:, | |\/|:)/g);
        return [
            year,
            +month - 1,
            dayOfMonth,
            hours,
            minutes,
            seconds,
            // Milliseconds
            Math.floor(Number(timestamp) || 0) % 1000,
            // Spanish weekday index
            'DLMXJVS'.indexOf(weekday)
        ].map(Number);
    }

    /**
     * Shorthand to get a cached `Intl.DateTimeFormat` instance.
     */
    public dateTimeFormat(
        options: Intl.DateTimeFormatOptions|string,
        timestamp?: number|Date,
        locale: string|Array<string>|undefined = this.options.locale || pageLang
    ): string {
        const cacheKey = JSON.stringify(options) + locale;
        if (isString(options)) {
            options = this.str2dtf(options);
        }

        let dTL = this.dTLCache[cacheKey];

        if (!dTL) {
            options.timeZone ??= this.timezone;
            try {
                dTL = new Intl.DateTimeFormat(locale, options);
            } catch (e) {
                if (/Invalid time zone/i.test((e as Error).message)) {
                    error(34);
                    options.timeZone = 'UTC';
                    dTL = new Intl.DateTimeFormat(locale, options);
                } else {
                    error((e as Error).message, false);
                }
            }
        }

        this.dTLCache[cacheKey] = dTL;

        return dTL?.format(timestamp) || '';
    }

    /**
     * Take a locale-aware string format and return a full DateTimeFormat in
     * object form.
     */
    private str2dtf(
        s: string,
        dtf: TimeBase.DateTimeFormatOptions = {}
    ): TimeBase.DateTimeFormatOptions {
        const mapping: Record<string, TimeBase.DateTimeFormatOptions> = {
            L: { fractionalSecondDigits: 3 },
            S: { second: '2-digit' },
            M: { minute: 'numeric' },
            H: { hour: '2-digit' },
            k: { hour: 'numeric' },
            E: { weekday: 'narrow' },
            a: { weekday: 'short' },
            A: { weekday: 'long' },
            d: { day: '2-digit' },
            e: { day: 'numeric' },
            b: { month: 'short' },
            B: { month: 'long' },
            m: { month: '2-digit' },
            o: { month: 'numeric' },
            y: { year: '2-digit' },
            Y: { year: 'numeric' }
        };

        Object.keys(mapping).forEach((key): void => {
            if (s.indexOf(key) !== -1) {
                extend(dtf, mapping[key]);
            }
        });
        return dtf;
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
        date: number = 1,
        hours: number = 0,
        minutes?: number,
        seconds?: number,
        milliseconds?: number
    ): number {
        // eslint-disable-next-line new-cap
        let d = this.Date.UTC(
            year,
            month,
            date,
            hours,
            minutes || 0,
            seconds || 0,
            milliseconds || 0
        );

        if (this.timezone !== 'UTC') {
            const offset = this.getTimezoneOffset(d);
            d += offset;

            // Adjustments close to DST transitions
            if (
                // Optimize for speed by limiting the number of calls to
                // `getTimezoneOffset`. According to
                // https://en.wikipedia.org/wiki/Daylight_saving_time_by_country,
                // DST change may only occur in these months.
                [2, 3, 8, 9, 10, 11].indexOf(month) !== -1 &&

                // DST transitions occur only in the night-time
                (hours < 5 || hours > 20)
            ) {
                const newOffset = this.getTimezoneOffset(d);

                if (offset !== newOffset) {
                    d += newOffset - offset;

                // A special case for transitioning from summer time to winter
                // time. When the clock is set back, the same time is repeated
                // twice, i.e. 02:30 am is repeated since the clock is set back
                // from 3 am to 2 am. We need to make the same time as local
                // Date does.
                } else if (
                    offset - 36e5 === this.getTimezoneOffset(d - 36e5) &&
                    !hasOldSafariBug
                ) {
                    d -= 36e5;
                }
            }
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

        // Check if the string has time zone information
        const hasTimezone = s.indexOf('Z') > -1 ||
                /([+-][0-9]{2}):?[0-9]{2}$/.test(s),
            // YYYY-MM-DD and YYYY-MM are always UTC
            isYYYYMMDD = /^[0-9]{4}-[0-9]{2}(-[0-9]{2}|)$/.test(s);

        if (!hasTimezone && !isYYYYMMDD) {
            s += 'Z';
        }

        const ts = Date.parse(s);

        if (isNumber(ts)) {
            // Unless the string contains time zone information, convert from
            // the local time result of `Date.parse` via UTC into the current
            // timezone of the time object.
            return ts + (
                (!hasTimezone || isYYYYMMDD) ?
                    this.getTimezoneOffset(ts) :
                    0
            );
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
     * Formats a JavaScript date timestamp (milliseconds since January 1 1970)
     * into a human readable date string.
     *
     * The `format` parameter accepts two types of values:
     * - An object containing settings that are passed directly on to
     *   [Intl.DateTimeFormat.prototype.format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format).
     * - A format string containing either individual or locale-aware format
     *   keys. **Individual keys**, for example `%Y-%m-%d`, are listed below.
     *   **Locale-aware keys** are grouped by square brackets, for example
     *   `%[Ymd]`. The order of keys within the square bracket doesn't affect
     *   the output, which is determined by the locale. See example below.
     *   Internally, the locale-aware format keys are just a shorthand for the
     *   full object formats, but are particularly practical in
     *   [templating](https://www.highcharts.com/docs/chart-concepts/templating)
     *   where full object definitions are not an option.
     *
     * The available string format keys are listed below. Additional formats can
     * be given in the {@link Highcharts.dateFormats} hook.
     *
     * Supported format keys:
     * | Key  | Description                     | Notes on locale-aware format |
     * -------|----------------------------------------------|-------|
     * | `%A` | Long weekday, like 'Monday'                  |       |
     * | `%a` | Short weekday, like 'Mon'                    |       |
     * | `%E` | Narrow weekday, single character             |       |
     * | `%d` | Two digit day of the month, 01 to 31         |       |
     * | `%e` | Day of the month, 1 through 31               |       |
     * | `%w` | Day of the week, 0 through 6                 | N/A   |
     * | `%v` | The prefix "week from", read from `lang.weekFrom` | N/A |
     * | `%b` | Short month, like 'Jan'                      |       |
     * | `%B` | Long month, like 'January'                   |       |
     * | `%m` | Two digit month number, 01 through 12        |       |
     * | `%o` | Month number, 1 through 12                   |       |
     * | `%y` | Two digits year, like 24 for 2024            |       |
     * | `%Y` | Four digits year, like 2024                  |       |
     * | `%H` | Two digits hours in 24h format, 00 through 23 | Depending on the locale, 12h format may be instered. |
     * | `%k` | Hours in 24h format, 0 through 23            | Depending on the locale, 12h format may be instered. |
     * | `%I` | Two digits hours in 12h format, 00 through 11 | N/A. The locale determines the hour format. |
     * | `%l` | Hours in 12h format, 1 through 12            | N/A. The locale determines the hour format. |
     * | `%M` | Two digits minutes, 00 through 59            |       |
     * | `%p` | Upper case AM or PM                          | N/A. The locale determines whether to add AM and PM. |
     * | `%P` | Lower case AM or PM                          | N/A. The locale determines whether to add AM and PM. |
     * | `%S` | Two digits seconds, 00 through 59            |       |
     * | `%L` | Milliseconds (naming from Ruby)              |       |
     *
     * @example
     * // Object format, US English
     * const time1 = new Highcharts.Time({ locale: 'en-US' });
     * console.log(
     *     time1.dateFormat({
     *         day: 'numeric',
     *         month: 'short',
     *         year: 'numeric',
     *         hour: 'numeric',
     *         minute: 'numeric'
     *     }, Date.UTC(2024, 11, 31))
     * ); // => Dec 31, 2024, 12:00 AM
     *
     * // Object format, British English
     * const time2 = new Highcharts.Time({ locale: 'en-GB' });
     * console.log(
     *     time2.dateFormat({
     *         day: 'numeric',
     *         month: 'short',
     *         year: 'numeric',
     *         hour: 'numeric',
     *         minute: 'numeric'
     *     }, Date.UTC(2024, 11, 31))
     * ); // => 31 Dec 2024, 00:00
     *
     * // Individual key string replacement
     * const time3 = new Highcharts.Time();
     * console.log(
     *     time3.dateFormat('%Y-%m-%d %H:%M:%S', Date.UTC(2024, 11, 31))
     * ); // => 2024-12-31 00:00:00
     *
     * // Locale-aware keys, US English
     * const time4 = new Highcharts.Time({ locale: 'en-US' });
     * console.log(
     *     time4.dateFormat('%[YebHM]', Date.UTC(2024, 11, 31))
     * ); // => Dec 31, 2024, 12:00 AM
     *
     * // Locale-aware keys, British English
     * const time5 = new Highcharts.Time({ locale: 'en-GB' });
     * console.log(
     *     time5.dateFormat('%[YebHM]', Date.UTC(2024, 11, 31))
     * ); // => 31 Dec 2024, 00:00
     *
     * // Mixed locale-aware and individual keys
     * console.log(
     *     time5.dateFormat('%[Yeb], %H:%M', Date.UTC(2024, 11, 31))
     * ); // => 31 Dec 2024, 00:00
     *
     * @function Highcharts.Time#dateFormat
     *
     * @param {string|Highcharts.DateTimeFormatOptions} format
     *        The desired string format where various time representations are
     *        prefixed with %, or an object representing the locale-aware format
     *        options.
     *
     * @param {number} [timestamp]
     *        The JavaScript timestamp.
     *
     * @param {boolean} [upperCaseFirst=false]
     *        Upper case first letter in the return.
     *
     * @return {string}
     *         The formatted date.
     */
    public dateFormat(
        format?: TimeBase.DateTimeFormat|null,
        timestamp?: number,
        upperCaseFirst?: boolean
    ): string {
        const lang = this.lang;

        if (!defined(timestamp) || isNaN(timestamp)) {
            return lang?.invalidDate || '';
        }

        format = format ?? '%Y-%m-%d %H:%M:%S';

        // First, identify and replace locale-aware formats like %[Ymd]
        if (isString(format)) {
            const localeAwareRegex = /%\[([a-zA-Z]+)\]/g;
            let match;
            while ((match = localeAwareRegex.exec(format))) {
                format = format.replace(match[0], this.dateTimeFormat(
                    match[1],
                    timestamp,
                    lang?.locale
                ));
            }
        }

        // Then, replace static formats like %Y, %m, %d etc.
        if (isString(format) && format.indexOf('%') !== -1) {
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
                langWeekdays = lang?.weekdays || this.weekdays,
                shortWeekdays = lang?.shortWeekdays || this.shortWeekdays,
                months = lang?.months || this.months,
                shortMonths = lang?.shortMonths || this.shortMonths,

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
                        v: lang?.weekFrom ?? '',

                        // Month
                        // Short month, like 'Jan'
                        b: shortMonths[month],
                        // Long month, like 'January'
                        B: months[month],
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
                val: (string|number|Function),
                key: string
            ): void {
                if (isString(format)) {
                    // Regex would do it in one line, but this is faster
                    while (format.indexOf('%' + key) !== -1) {
                        format = format.replace(
                            '%' + key,
                            typeof val === 'function' ?
                                val.call(time, timestamp) :
                                val
                        );
                    }
                }
            });

        } else if (isObject(format)) {
            const tzHours = (this.getTimezoneOffset(timestamp) || 0) /
                    (60000 * 60),
                timeZone = this.timezone || (
                    'Etc/GMT' + (tzHours >= 0 ? '+' : '') + tzHours
                ),
                { prefix = '', suffix = '' } = format;

            format = prefix + this.dateTimeFormat(
                extend({ timeZone }, format),
                timestamp
            ) + suffix;
        }

        // Optionally sentence-case the string and return
        return upperCaseFirst ? ucfirst(format) : format;
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
        f: TimeBase.DateTimeLabelFormatOption
    ): TimeBase.DateTimeLabelFormatObject {
        if (!isObject(f, true)) { // Check for string or array
            f = splat(f);
            return {
                main: f[0],
                from: f[1],
                to: f[2]
            };
        }

        // Type-check DateTimeFormatOptions against DateTimeLabelFormatObject
        if (isObject(f, true) && isDateTimeFormatOptions(f)) {
            return { main: f };
        }

        return f;
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
        range: number | undefined,
        timestamp: number,
        startOfWeek: number,
        dateTimeLabelFormats: TimeBase.DateTimeLabelFormatsOption
    ): TimeBase.DateTimeFormat|undefined {
        const dateStr = this.dateFormat('%m-%d %H:%M:%S.%L', timestamp),
            blank = '01-01 00:00:00.000',
            strpos = {
                millisecond: 15,
                second: 12,
                minute: 9,
                hour: 6,
                day: 3
            } as Record<TimeBase.TimeUnit, number>;

        let n: TimeBase.TimeUnit = 'millisecond',
            // For sub-millisecond data, #4223
            lastN: TimeBase.TimeUnit = n;

        for (n in timeUnits) { // eslint-disable-line guard-for-in
            // If the range is exactly one week and we're looking at a
            // Sunday/Monday, go for the week format
            if (
                range &&
                range === timeUnits.week &&
                +this.dateFormat('%w', timestamp) === startOfWeek &&
                dateStr.substr(6) === blank.substr(6)
            ) {
                n = 'week';
                break;
            }

            // The first format that is too great for the range
            if (range && timeUnits[n] > range) {
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

namespace TimeBase {

    export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
        dateStyle?: 'full'|'long'|'medium'|'short';
        fractionalSecondDigits?: 1|2|3;
        prefix?: string;
        suffix?: string;
        timeStyle?: 'full'|'long'|'medium'|'short';
    }

    export type DateTimeFormat = string|DateTimeFormatOptions;

    export interface DateTimeLabelFormatObject {
        from?: DateTimeFormat;
        list?: DateTimeFormat[];
        main: DateTimeFormat;
        range?: boolean;
        to?: DateTimeFormat;
    }

    export type DateTimeLabelFormatOption = (
        DateTimeFormat|
        Array<string>|
        TimeBase.DateTimeLabelFormatObject
    );
    export type DateTimeLabelFormatsOption = (
        Record<TimeUnit, DateTimeLabelFormatOption>
    );
    export interface TimeOptions {
        Date?: any;
        locale?: string|Array<string>;
        timezone?: string;
        timezoneOffset?: number;
        useUTC?: boolean;
    }
    export interface TimeFormatCallbackFunction {
        (this: TimeBase, timestamp: number): string;
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

export default TimeBase;

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

/**
 * Options for formatting dates and times using the [Intl.DateTimeFormat](
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 * ) API, and extended with some custom options for Highcharts.
 *
 * @interface Highcharts.DateTimeFormatOptions
 *//**
 * The locale matching algorithm to use.
 *
 * @name Highcharts.DateTimeFormatOptions#localeMatcher
 * @type {string|undefined}
 *//**
 * The time zone to use. The default is the browser's default time zone.
 *
 * @name Highcharts.DateTimeFormatOptions#timeZone
 * @type {string|undefined}
 *//**
 * Whether to use 12-hour time (as opposed to 24-hour time).
 *
 * @name Highcharts.DateTimeFormatOptions#hour12
 * @type {'auto'|'always'|'never'|undefined}
 *//**
 * The format matching algorithm to use.
 *
 * @name Highcharts.DateTimeFormatOptions#formatMatcher
 * @type {string|undefined}
 *//**
 * The representation of the weekday.
 *
 * @name Highcharts.DateTimeFormatOptions#weekday
 * @type {'narrow'|'short'|'long'|undefined}
 *//**
 * The representation of the era.
 *
 * @name Highcharts.DateTimeFormatOptions#era
 * @type {'narrow'|'short'|'long'|undefined}
 *//**
 * The representation of the year.
 *
 * @name Highcharts.DateTimeFormatOptions#year
 * @type {'numeric'|'2-digit'|undefined}
 *//**
 * The representation of the month.
 * "narrow", "short", "long".
 *
 * @name Highcharts.DateTimeFormatOptions#month
 * @type {'numeric'|'2-digit'|'narrow'|'short'|'long'|undefined}
 *//**
 * The representation of the day.
 *
 * @name Highcharts.DateTimeFormatOptions#day
 * @type {'numeric'|'2-digit'|undefined}
 *//**
 * The representation of the hour.
 *
 * @name Highcharts.DateTimeFormatOptions#hour
 * @type {'numeric'|'2-digit'|undefined}
 *//**
 * The representation of the minute.
 *
 * @name Highcharts.DateTimeFormatOptions#minute
 * @type {'numeric'|'2-digit'|undefined}
 *//**
 * The representation of the second.
 *
 * @name Highcharts.DateTimeFormatOptions#second
 * @type {'numeric'|'2-digit'|undefined}
 *//**
 * The number of fractional digits to use. 3 means milliseconds.
 *
 * @name Highcharts.DateTimeFormatOptions#fractionalSecondDigits
 * @type {1|2|3|undefined}
 *//**
 * The representation of the time zone name.
 *
 * @name Highcharts.DateTimeFormatOptions#timeZoneName
 * @type {'short'|'long'|undefined}
 *//**
 * A prefix for the time string. Custom Highcharts option.
 *
 * @name Highcharts.DateTimeFormatOptions#prefix
 * @type {'string'|undefined}
 *//**
 * A suffix for the time string. Custom Highcharts option.
 *
 * @name Highcharts.DateTimeFormatOptions#suffix
 * @type {'string'|undefined}
 */

''; // Keeps doclets above in JS file
