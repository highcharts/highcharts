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

import type { LangOptions } from './Options';

/* *
 *
 *  API Options
 *
 * */

/**
 * An object containing language-related strings and settings. A typical
 * setup uses `Highcharts.setOptions` to make the options apply to all
 * charts in the same page.
 *
 * Some language options, like `months` and `weekdays`, are only used
 * with non-locale-aware date formats.
 *
 * ```js
 * Highcharts.setOptions({
 *     lang: {
 *         locale: 'fr'
 *     }
 * });
 * ```
 *
 * @optionparent lang
 */
const LangDefaults: LangOptions = {
    weekFrom: 'week from',

    /**
     * The default chart title.
     *
     * @since 12.2.0
     */
    chartTitle: 'Chart title',

    /**
     * The browser locale to use for date and number formatting. The actual
     * locale used for each chart is determined in three steps:
     * 1. If this `lang.locale` option is specified, it is used.
     * 2. Else, look for the closest ancestor HTML element with a `lang`
     *    attribute, typically the `<html>` element.
     * 3. If no 'lang' attribute is found, use the default browser locale.
     *
     * Use `en-GB`, British English, for approximate consistency with
     * Highcharts v < 12.
     *
     * @sample highcharts/lang/locale/
     *         Set the locale using the `lang.locale` option
     * @sample highcharts/lang/locale-attribute/
     *         Pick up the locale from the HTML `lang` attribute
     * @sample highcharts/members/highcharts-numberformat
     *         Arabic locale with digits and dates         *
     *
     * @since 12.0.0
     * @type {string|Array<string>}
     */
    locale: void 0,

    /**
     * The loading text that appears when the chart is set into the loading
     * state following a call to `chart.showLoading`.
     */
    loading: 'Loading...',

    /**
     * An array containing the months names. Corresponds to the `%B` format
     * in `Highcharts.dateFormat()`. Defaults to 'undefined',
     * meaning the default month names are used according to the
     * `lang.locale` or browser settings.
     *
     * @type    {Array<string>}
     */
    months: void 0,

    /**
     * [Format string](https://www.highcharts.com/docs/chart-concepts/templating) for the default series name.
     *
     * @since 12.2.0
     */
    seriesName: 'Series {add index 1}',

    /**
     * An array containing the months names in abbreviated form. Corresponds
     * to the `%b` format in `Highcharts.dateFormat()`. Defaults to
     * 'undefined', meaning the default short month names are used according
     * to the `lang.locale` or browser settings.
     *
     * @type    {Array<string>}
     */
    shortMonths: void 0,

    /**
     * An array containing the weekday names. Corresponds
     * to the `%A` format in `Highcharts.dateFormat()`. Defaults to
     * 'undefined', meaning the default weekday names are used according to
     * the `lang.locale` or browser settings.
     *
     * @type    {Array<string>}
     */
    weekdays: void 0,

    /**
     * Short week days, starting Sunday. Corresponds to the `%a` format in
     * `Highcharts.dateFormat()`. Defaults to 'undefined', meaning
     * the default short weekday names are used according to the
     * `lang.locale` or browser settings.
     *
     * @sample highcharts/lang/shortweekdays/
     *         Finnish two-letter abbreviations
     *
     * @type      {Array<string>}
     * @since     4.2.4
     * @apioption lang.shortWeekdays
     */

    /**
     * What to show in a date field for invalid dates. Defaults to an empty
     * string.
     *
     * @type      {string}
     * @since     4.1.8
     * @product   highcharts highstock
     * @apioption lang.invalidDate
     */

    /**
     * The title appearing on hovering the zoom in button. The text itself
     * defaults to "+" and can be changed in the button options.
     *
     * @type      {string}
     * @default   Zoom in
     * @product   highmaps
     * @apioption lang.zoomIn
     */

    /**
     * The title appearing on hovering the zoom out button. The text itself
     * defaults to "-" and can be changed in the button options.
     *
     * @type      {string}
     * @default   Zoom out
     * @product   highmaps
     * @apioption lang.zoomOut
     */

    /**
     * The default decimal point used in the `Highcharts.numberFormat`
     * method unless otherwise specified in the function arguments. Defaults
     * to the locale decimal point as determined by `lang.locale`.
     *
     * @type      {string}
     * @default   undefined
     * @since     1.2.2
     * @apioption lang.decimalPoint
     */

    /**
     * [Metric prefixes](https://en.wikipedia.org/wiki/Metric_prefix) used
     * to shorten high numbers in axis labels. Replacing any of the
     * positions with `null` causes the full number to be written. Setting
     * `numericSymbols` to `undefined` disables shortening altogether.
     *
     * @sample {highcharts} highcharts/lang/numericsymbols/
     *         Replacing the symbols with text
     * @sample {highstock} highcharts/lang/numericsymbols/
     *         Replacing the symbols with text
     *
     * @type    {Array<string>}
     * @default ["k", "M", "G", "T", "P", "E"]
     * @since   2.3.0
     */
    numericSymbols: ['k', 'M', 'G', 'T', 'P', 'E'],

    /**
     * The default name for a pie slice (point).
     * @since 12.2.0
     */

    pieSliceName: 'Slice',

    /**
     * The magnitude of [numericSymbols](#lang.numericSymbol) replacements.
     * Use 10000 for Japanese, Korean and various Chinese locales, which
     * use symbols for 10^4, 10^8 and 10^12.
     *
     * @sample highcharts/lang/numericsymbolmagnitude/
     *         10000 magnitude for Japanese
     *
     * @type      {number}
     * @default   1000
     * @since     5.0.3
     * @apioption lang.numericSymbolMagnitude
     */

    /**
     * The default thousands separator used in the `Highcharts.numberFormat`
     * method unless otherwise specified in the function arguments. Defaults
     * to the locale thousands separator as determined by `lang.locale`.
     *
     * @type      {string}
     * @default   undefined
     * @since     1.2.2
     * @apioption lang.thousandsSep
     */

    /**
     * The text for the label appearing when a chart is zoomed.
     *
     * @since 1.2.4
     */
    resetZoom: 'Reset zoom',

    /**
     * The default title of the Y axis
     *
     * @since 12.2.0
     */
    yAxisTitle: 'Values',

    /**
     * The tooltip title for the label appearing when a chart is zoomed.
     *
     * @since 1.2.4
     */
    resetZoomTitle: 'Reset zoom level 1:1'
};

/* *
 *
 *  Default Export
 *
 * */

export default LangDefaults;
