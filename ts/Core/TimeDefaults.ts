/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type TimeBase from '../Shared/TimeBase';

import Time from './Time.js';
import LangDefaults from './LangDefaults.js';

/* *
 *
 *  API Options
 *
 * */

/**
 * Time options that can apply globally or to individual charts. These
 * settings affect how `datetime` axes are laid out, how tooltips are
 * formatted, how series
 * [pointIntervalUnit](#plotOptions.series.pointIntervalUnit) works and how
 * the Highcharts Stock range selector handles time.
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
 * const chart = Highcharts.chart('container', {
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
 * Since v6.0.5, the time options were moved from the `global` object to the
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
const TimeDefaults: TimeBase.TimeOptions = {
    /**
     * A custom `Date` class for advanced date handling. For example,
     * [JDate](https://github.com/tahajahangir/jdate) can be hooked in to
     * handle Jalali dates.
     *
     * @type      {*}
     * @since     4.0.4
     * @product   highcharts highstock gantt
     */
    Date: void 0,

    /**
     * A named time zone. Supported time zone names rely on the browser
     * implementations, as described in the [mdn
     * docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#timezone).
     * If the given time zone is not recognized by the browser, Highcharts
     * provides a warning and falls back to returning a 0 offset,
     * corresponding to the UTC time zone.
     *
     * The time zone affects axis scaling, tickmark placement and
     * time display in `Highcharts.dateFormat`.
     *
     * Setting `timezone` to `undefined` falls back to the default browser
     * timezone setting.
     *
     * Until v11.2.0, this option depended on moment.js.
     *
     * @sample {highcharts|highstock} highcharts/time/timezone/ Europe/Oslo
     *
     * @type      {string}
     * @since     5.0.7
     * @product   highcharts highstock gantt
     */
    timezone: 'UTC',

    /**
     * The timezone offset in minutes. Positive values are west, negative
     * values are east of UTC, as in the ECMAScript
     * [getTimezoneOffset](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset)
     * method. Use this to display UTC based data in a predefined time zone.
     *
     * This option is deprecated as of v11.4.1 and will be removed in a
     * future release. Use the [time.timezone](#time.timezone) option
     * instead.
     *
     * @see [time.getTimezoneOffset](#time.getTimezoneOffset)
     *
     * @sample {highcharts|highstock} highcharts/time/timezoneoffset/
     *         Timezone offset
     *
     * @since     3.0.8
     * @deprecated 11.4.2
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
     * Setting `useUTC` to true is equivalent to setting `time.timezone` to
     * `"UTC"`. Setting `useUTC` to false is equivalent to setting
     * `time.timezone` to `undefined`.
     *
     * @see [timezone](#time.timezone)
     *
     * @sample {highcharts} highcharts/time/useutc-true/
     *         True by default
     * @sample {highcharts} highcharts/time/useutc-false/
     *         False
     *
     * @deprecated 12.0.0
     */
    useUTC: void 0
};

export const defaultTime = new Time(TimeDefaults, LangDefaults);

/* *
 *
 *  Default Export
 *
 * */

export default TimeDefaults;
