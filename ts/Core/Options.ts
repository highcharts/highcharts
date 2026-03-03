/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ButtonThemeObject from './Renderer/SVG/ButtonThemeObject';
import type Chart from './Chart/Chart';
import type ColorString from './Color/ColorString';
import type CSSObject from './Renderer/CSSObject';
import type { SeriesTypePlotOptions } from './Series/SeriesType';
import type { SymbolKey } from './Renderer/SVG/SymbolType';
import type { LangOptionsCore } from '../Shared/LangOptionsCore';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Global options that don't apply to each chart. These options must be set
 * using the `Highcharts.setOptions` method.
 *
 * ```js
 * Highcharts.setOptions({
 *     global: {
 *         buttonTheme: {
 *             fill: '#d0d0d0'
 *         }
 *     }
 * });
 * ```
 */
interface GlobalOptions {
    /**
     * General theme for buttons. This applies to the zoom button, exporting
     * context menu, map navigation, range selector buttons and custom
     * buttons generated using the `SVGRenderer.button` function. However,
     * each of these may be overridden with more specific options.
     *
     * @sample highcharts/global/buttontheme
     *         General button theme
     * @since 11.4.2
     */
    buttonTheme: ButtonThemeObject;
    /** @deprecated */
    canvasToolsURL?: string;
    /** @deprecated */
    Date?: Function;
    /** @deprecated */
    getTimezoneOffset?: Function;
    /** @deprecated */
    timezone?: string;
    /** @deprecated */
    timezoneOffset?: number;
    /** @deprecated */
    useUTC?: boolean;
}

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
 */
export interface LangOptions extends LangOptionsCore {
    /**
     * The default chart title.
     *
     * @since 12.2.0
     */
    chartTitle: string;
    /**
     * The loading text that appears when the chart is set into the loading
     * state following a call to `chart.showLoading`.
     *
     * @default Loading...
     */
    loading: string;
    /**
     * The magnitude of [numericSymbols](#lang.numericSymbol) replacements.
     * Use 10000 for Japanese, Korean and various Chinese locales, which
     * use symbols for 10^4, 10^8 and 10^12.
     *
     * @sample highcharts/lang/numericsymbolmagnitude/
     *         10000 magnitude for Japanese
     *
     * @default   1000
     * @since     5.0.3
     */
    numericSymbolMagnitude?: number;
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
     * @default ["k", "M", "G", "T", "P", "E"]
     * @since   2.3.0
     */
    numericSymbols: Array<string> | undefined;
    /**
     * The default name for a pie slice (point).
     *
     * @default Slice
     * @since   12.2.0
     */
    pieSliceName: string;
    /**
     * The text for the label appearing when a chart is zoomed.
     *
     * @default Reset zoom
     * @since   1.2.4
     */
    resetZoom: string;
    /**
     * The tooltip title for the label appearing when a chart is zoomed.
     *
     * @default Reset zoom level 1:1
     * @since   1.2.4
     */
    resetZoomTitle: string;
    /**
     * [Format string](https://www.highcharts.com/docs/chart-concepts/templating)
     * for the default series name.
     *
     * @default Series {add index 1}
     * @since   12.2.0
     */
    seriesName: string;
    /**
     * The default title of the Y axis
     *
     * @default Values
     * @since 12.2.0
     */
    yAxisTitle: string;
    /**
     * The title appearing on hovering the zoom in button. The text itself
     * defaults to "+" and can be changed in the button options.
     *
     * @default   Zoom in
     * @product   highmaps
     */
    zoomIn?: string;
    /**
     * The title appearing on hovering the zoom out button. The text itself
     * defaults to "-" and can be changed in the button options.
     *
     * @default   Zoom out
     * @product   highmaps
     */
    zoomOut?: string;
}

/**
 * The loading options control the appearance of the loading screen
 * that covers the plot area on chart operations. This screen only
 * appears after an explicit call to `chart.showLoading()`. It is a
 * utility for developers to communicate to the end user that something
 * is going on, for example while retrieving new data via an XHR connection.
 * The "Loading..." text itself is not part of this configuration
 * object, but part of the `lang` object.
 */
export interface LoadingOptions {
    /**
     * The duration in milliseconds of the fade out effect.
     *
     * @sample highcharts/loading/hideduration/
     *         Fade in and out over a second
     *
     * @default   100
     * @since     1.2.0
     */
    hideDuration?: number;
    /**
     * CSS styles for the loading label `span`.
     *
     * @see In styled mode, the loading label is styled with the
     *      `.highcharts-loading-inner` class.
     *
     * @sample {highcharts|highmaps} highcharts/loading/labelstyle/
     *         Vertically centered
     * @sample {highstock} stock/loading/general/
     *         Label styles
     *
     * @default {"fontWeight": "bold", "position": "relative", "top": "45%"}
     * @since   1.2.0
     */
    labelStyle?: CSSObject;
    /**
     * The duration in milliseconds of the fade in effect.
     *
     * @sample highcharts/loading/hideduration/
     *         Fade in and out over a second
     *
     * @default   100
     * @since     1.2.0
     */
    showDuration?: number;
    /**
     * CSS styles for the loading screen that covers the plot area.
     *
     * In styled mode, the loading label is styled with the
     * `.highcharts-loading` class.
     *
     * @sample  {highcharts|highmaps} highcharts/loading/style/
     *          Gray plot area, white text
     * @sample  {highstock} stock/loading/general/
     *          Gray plot area, white text
     *
     * @default {"position": "absolute", "backgroundColor": "#ffffff", "opacity": 0.5, "textAlign": "center"}
     * @since   1.2.0
     */
    style?: CSSObject;
}

/**
 * Format a number and return a string based on input settings.
 *
 * @callback Highcharts.NumberFormatterCallbackFunction
 *
 * @param {number} number
 * The input number to format.
 *
 * @param {number} decimals
 * The amount of decimals. A value of -1 preserves the amount in the inpu
 * number.
 *
 * @param {string} [decimalPoint]
 * The decimal point, defaults to the one given in the lang options, or a dot.
 *
 * @param {string} [thousandsSep]
 * The thousands separator, defaults to the one given in the lang options, or a
 * space character.
 *
 * @return {string}
 * The formatted number.
 */
export interface NumberFormatterCallbackFunction {
    (
        this: Chart|object|void,
        number: number,
        decimals: number,
        decimalPoint?: string,
        thousandsSep?: string
    ): string;
}

/**
 * Global options for all charts.
 */
export interface Options {
    /**
     * An array containing the default colors for the chart's series. When
     * all colors are used, new colors are pulled from the start again.
     *
     * Default colors can also be set on a series or series.type basis,
     * see [column.colors](#plotOptions.column.colors),
     * [pie.colors](#plotOptions.pie.colors).
     *
     * In styled mode, the colors option doesn't exist. Instead, colors
     * are defined in CSS and applied either through series or point class
     * names, or through the [chart.colorCount](#chart.colorCount) option.
     *
     * @sample {highcharts} highcharts/chart/colors/
     *         Assign a global color theme
     * @sample highcharts/members/theme-v10/
     *         Latest release styled like version 10
     *
     * @default [
     *     "#2caffe",
     *     "#544fc5",
     *     "#00e272",
     *     "#fe6a35",
     *     "#6b8abc",
     *     "#d568fb",
     *     "#2ee0ca",
     *     "#fa4b42",
     *     "#feb56a",
     *     "#91e8e1"
     * ]
     */
    colors?: Array<ColorString>;
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
     */
    lang: LangOptions;
    /**
     * The loading text that appears when the chart is set into the loading
     * state following a call to `chart.showLoading`.
     */
    loading?: LoadingOptions;
    /**
     * The plotOptions is a wrapper object for config objects for each series
     * type. The config objects for each series can also be overridden for
     * each series item as given in the series array.
     *
     * Configuration options for the series are given in three levels. Options
     * for all series in a chart are given in the [plotOptions.series](
     * #plotOptions.series) object. Then options for all series of a specific
     * type are given in the plotOptions of that type, for example
     * `plotOptions.line`. Next, options for one single series are given in
     * [the series array](#series).
     */
    plotOptions: SeriesTypePlotOptions;
    /**
     * Global options that don't apply to each chart. These options must be set
     * using the `Highcharts.setOptions` method.
     *
     * ```js
     * Highcharts.setOptions({
     *     global: {
     *         buttonTheme: {
     *             fill: '#d0d0d0'
     *         }
     *     }
     * });
     * ```
     */
    global: GlobalOptions;
    /** @internal */
    symbols?: Array<SymbolKey>;
}

/**
 * Global default settings.
 */
export interface DefaultOptions extends Options {
}

export type OptionsOverflowValue = ('allow'|'justify');

/* *
 *
 *  Default Export
 *
 * */

export default Options;
