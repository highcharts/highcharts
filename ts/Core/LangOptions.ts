/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { LangOptionsCore } from '../Shared/LangOptionsCore';

/* *
 *
 *  Declarations
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
     * @default 'Loading...'
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
     * @default 'Slice'
     * @since   12.2.0
     */
    pieSliceName: string;
    /**
     * The text for the label appearing when a chart is zoomed.
     *
     * @default 'Reset zoom'
     * @since   1.2.4
     */
    resetZoom: string;
    /**
     * The tooltip title for the label appearing when a chart is zoomed.
     *
     * @default 'Reset zoom level 1:1'
     * @since   1.2.4
     */
    resetZoomTitle: string;
    /**
     * [Format string](https://www.highcharts.com/docs/chart-concepts/templating)
     * for the default series name.
     *
     * @default 'Series {add index 1}'
     * @since   12.2.0
     */
    seriesName: string;
    /**
     * The default title of the Y axis
     *
     * @default 'Values'
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

/* *
 *
 *  Default Export
 *
 * */

export default LangOptions;
