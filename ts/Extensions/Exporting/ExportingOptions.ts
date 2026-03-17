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

/* *
 *
 *  Imports
 *
 * */

import type {
    AlignValue,
    VerticalAlignValue
} from '../../Core/Renderer/AlignObject';
import type ButtonThemeObject from '../../Core/Renderer/SVG/ButtonThemeObject';
import type ColorString from '../../Core/Color/ColorString';
import type { Exporting } from './Exporting';
import type Options from '../../Core/Options';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';
import type HTMLAttributes from '../../Core/Renderer/HTML/HTMLAttributes';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options' {
    interface LangOptions {
        /**
         * Exporting module menu. The tooltip title for the context menu holding
         * print and export menu items.
         *
         * @since    3.0
         * @requires modules/exporting
         */
        contextButtonTitle?: string;

        /**
         * Exporting module only. The text for the menu item to exit the chart
         * from full screen.
         *
         * @since 8.0.1
         * @requires modules/exporting
         */
        exitFullscreen?: string;

        /**
         * Exporting module only. The text for the JPEG download menu item.
         *
         * @since    2.0
         * @requires modules/exporting
         */
        downloadJPEG?: string;

        /**
         * Exporting module only. The text for the PDF download menu item.
         *
         * @since    2.0
         * @requires modules/exporting
         */
        downloadPDF?: string;

        /**
         * Exporting module only. The text for the PNG download menu item.
         *
         * @since    2.0
         * @requires modules/exporting
         */
        downloadPNG?: string;

        /**
         * Exporting module only. The text for the SVG download menu item.
         *
         * @since    2.0
         * @requires modules/exporting
         */
        downloadSVG?: string;

        /**
         * Exporting module only. The text for the menu item to print the chart.
         *
         * @since    3.0.1
         * @requires modules/exporting
         */
        printChart?: string;

        /**
         * Exporting module only. The text for the menu item to view the chart
         * in full screen.
         *
         * @since 8.0.1
         * @requires modules/exporting
         */
        viewFullscreen?: string;
    }

    interface Options {
        /**
         * Options for the exporting module. For an overview on the matter, see
         * [the docs](https://www.highcharts.com/docs/export-module/export-module-overview) and
         * read our [Fair Usage Policy](https://www.highcharts.com/docs/export-module/privacy-disclaimer-export).
         *
         * @requires modules/exporting
         */
        exporting?: ExportingOptions;
    }
}

export interface PdfFontOptions {
    /**
     * The TTF font file for bold text.
     */
    bold?: string;

    /**
     * The TTF font file for bold and italic text.
     */
    bolditalic?: string;

    /**
     * The TTF font file for italic text.
     */
    italic?: string;

    /**
     * The TTF font file for normal `font-style`. If font variations like
     * `bold` or `italic` are not defined, the `normal` font will be used
     * for those too.
     */
    normal?: string;
}

export interface ExportingOptions {
    /**
     * Experimental setting to allow HTML inside the chart (added through
     * the `useHTML` options), directly in the exported image. This allows
     * you to preserve complicated HTML structures like tables or bi-directional
     * text in exported charts.
     *
     * Disclaimer: The HTML is rendered in a `foreignObject` tag in the
     * generated SVG. The official export server is based on PhantomJS,
     * which supports this, but other SVG clients, like Batik, does not
     * support it. This also applies to downloaded SVG that you want to
     * open in a desktop client.
     *
     * @default false
     * @since   4.1.8
     */
    allowHTML?: boolean;

    /**
     * Allows the end user to sort the data table by clicking on column headers.
     *
     * @since 10.3.3
     */
    allowTableSorting?: boolean;

    /**
     * Allow exporting a chart retaining any user-applied CSS.
     *
     * Note that this is is default behavior in [styledMode](#chart.styledMode).
     *
     * @see [styledMode](#chart.styledMode)
     *
     * @sample {highcharts} highcharts/exporting/apply-stylesheets/
     *
     * @default false
     * @since   12.0.0
     */
    applyStyleSheets?: boolean;

    /**
     * Options for the export related buttons, print and export. In addition
     * to the default buttons listed here, custom buttons can be added.
     * See [navigation.buttonOptions](#navigation.buttonOptions) for general
     * options.
     *
     * @requires modules/exporting
     */
    buttons?: ExportingButtonsOptions;

    /**
     * Additional chart options to be merged into the chart before exporting to
     * an image format. This does not apply to printing the chart via the export
     * menu.
     *
     * For example, a common use case is to add data labels to improve
     * readability of the exported chart, or to add a printer-friendly color
     * scheme to exported PDFs.
     *
     * @sample {highcharts} highcharts/exporting/chartoptions-data-labels/
     *         Added data labels
     * @sample {highstock} highcharts/exporting/chartoptions-data-labels/
     *         Added data labels
     */
    chartOptions?: Options;

    /**
     * Whether to enable the exporting module. Disabling the module will
     * hide the context button, but API methods will still be available.
     *
     * @sample {highcharts} highcharts/exporting/enabled-false/
     *         Exporting module is loaded but disabled
     * @sample {highstock} highcharts/exporting/enabled-false/
     *         Exporting module is loaded but disabled
     *
     * @default true
     * @since   2.0
     */
    enabled?: boolean;

    /**
     * Function to call if the offline-exporting module fails to export
     * a chart on the client side, and [fallbackToExportServer](
     * #exporting.fallbackToExportServer) is disabled. If left undefined, an
     * exception is thrown instead. Receives two parameters, the exporting
     * options, and the error from the module.
     *
     * @see [fallbackToExportServer](#exporting.fallbackToExportServer)
     *
     * @since     5.0.0
     * @requires  modules/exporting
     * @requires  modules/offline-exporting
     */
    error?: Exporting.ErrorCallbackFunction;

    /**
     * Whether or not to fall back to the export server if the offline-exporting
     * module is unable to export the chart on the client side. This happens for
     * certain browsers, and certain features (e.g.
     * [allowHTML](#exporting.allowHTML)), depending on the image type exporting
     * to. For very complex charts, it is possible that export can fail in
     * browsers that don't support Blob objects, due to data URL length limits.
     * It is recommended to define the [exporting.error](#exporting.error)
     * handler if disabling fallback, in order to notify users in case export
     * fails.
     *
     * @default  true
     * @since    4.1.8
     * @requires modules/exporting
     * @requires modules/offline-exporting
     */
    fallbackToExportServer?: boolean;

    /**
     * Options for the fetch request used when sending the SVG to the export
     * server.
     *
     * See [MDN](https://developer.mozilla.org/en-US/docs/Web/API/fetch)
     * for more information
     *
     * @since 11.3.0
     */
    fetchOptions?: RequestInit;

    /**
     * The filename, without extension, to use for the exported chart.
     *
     * @sample {highcharts} highcharts/exporting/filename/
     *         Custom file name
     * @sample {highstock} highcharts/exporting/filename/
     *         Custom file name
     *
     * @default 'chart'
     * @since   2.0
     */
    filename?: string;

    /**
     * Highcharts v11.2.0 and older. An object containing additional key value
     * data for the POST form that sends the SVG to the export server. For
     * example, a `target` can be set to make sure the generated image is
     * received in another frame, or a custom `enctype` or `encoding` can be
     * set.
     *
     * With Highcharts v11.3.0, the `fetch` API replaced the old HTML form. To
     * modify the request, now use [fetchOptions](#exporting.fetchOptions)
     * instead.
     *
     * @deprecated 11.3.0
     * @since      3.0.8
     */
    formAttributes?: HTMLAttributes;

    /**
     * Path where Highcharts will look for export module dependencies to
     * load on demand if they don't already exist on `window`. Should currently
     * point to location of [CanVG](https://github.com/canvg/canvg) library,
     * [jsPDF](https://github.com/parallax/jsPDF) and
     * [svg2pdf.js](https://github.com/yWorks/svg2pdf.js), required for client
     * side export in certain browsers.
     *
     * @default https://code.highcharts.com/{version}/lib
     * @since   5.0.0
     */
    libURL?: string;

    /**
     * Whether the chart should be exported using the browser's built-in
     * capabilities, allowing offline exports without requiring access to the
     * Highcharts export server, or sent directly to the export server for
     * processing and downloading.
     *
     * This option is different from `exporting.fallbackToExportServer`, which
     * controls whether the export server should be used as a fallback only if
     * the local export fails. In contrast, `exporting.local` explicitly defines
     * which export method to use.
     *
     * @see [fallbackToExportServer](#exporting.fallbackToExportServer)
     *
     * @default  true
     * @since    12.3.0
     * @requires modules/exporting
     */
    local?: boolean;

    /**
     * An object consisting of definitions for the menu items in the context
     * menu. Each key value pair has a `key` that is referenced in the
     * [menuItems](#exporting.buttons.contextButton.menuItems) setting,
     * and a `value`, which is an object with the following properties:
     *
     * - **onclick:** The click handler for the menu item
     *
     * - **text:** The text for the menu item
     *
     * - **textKey:** If internationalization is required, the key to a language
     *   string
     *
     * Custom text for the "exitFullScreen" can be set only in lang options
     * (it is not a separate button).
     *
     * @sample highcharts/exporting/menuitemdefinitions/
     *         Menu item definitions
     * @sample highcharts/exporting/menuitemdefinitions-webp/
     *         Adding a custom menu item for WebP export
     *
     * @since 5.0.13
     */
    menuItemDefinitions?: ExportingMenuItemDefinitionsOptions;

    /**
     * Settings for a custom font for the exported PDF, when using the
     * `offline-exporting` module. This is used for languages containing
     * non-ASCII characters, like Chinese, Russian, Japanese etc.
     *
     * As described in the [jsPDF
     * docs](https://github.com/parallax/jsPDF#use-of-unicode-characters--utf-8),
     * the 14 standard fonts in PDF are limited to the ASCII-codepage.
     * Therefore, in order to support other text in the exported PDF, one or
     * more TTF font files have to be passed on to the exporting module.
     *
     * See more in [the
     * docs](https://www.highcharts.com/docs/export-module/client-side-export).
     *
     * @sample {highcharts} highcharts/exporting/offline-download-pdffont/
     *         Download PDF in a language containing non-Latin characters.
     *
     * @since    10.0.0
     * @requires modules/offline-exporting
     */
    pdfFont?: PdfFontOptions;

    /**
     * When printing the chart from the menu item in the burger menu, if
     * the on-screen chart exceeds this width, it is resized. After printing
     * or cancelled, it is restored. The default width makes the chart
     * fit into typical paper format. Note that this does not affect the
     * chart when printing the web page as a whole.
     *
     * @since 4.2.5
     */
    printMaxWidth?: number;

    /**
     * Defines the scale or zoom factor for the exported image compared
     * to the on-screen display. While for instance a 600px wide chart
     * may look good on a website, it will look bad in print. The default
     * scale of 2 makes this chart export to a 1200px PNG or JPG.
     *
     * @see [chart.width](#chart.width)
     * @see [exporting.sourceWidth](#exporting.sourceWidth)
     *
     * @sample {highcharts} highcharts/exporting/scale/
     *         Scale demonstrated
     * @sample {highstock} highcharts/exporting/scale/
     *         Scale demonstrated
     * @sample {highmaps} maps/exporting/scale/
     *         Scale demonstrated
     *
     * @since 3.0
     */
    scale?: number;

    /**
     * Analogous to [sourceWidth](#exporting.sourceWidth).
     *
     * @since 3.0
     */
    sourceHeight?: number;

    /**
     * The width of the original chart when exported, unless an explicit
     * [chart.width](#chart.width) is set, or a pixel width is set on the
     * container. The width exported raster image is then multiplied by
     * [scale](#exporting.scale).
     *
     * @sample {highcharts} highcharts/exporting/sourcewidth/
     *         Source size demo
     * @sample {highstock} highcharts/exporting/sourcewidth/
     *         Source size demo
     * @sample {highmaps} maps/exporting/sourcewidth/
     *         Source size demo
     *
     * @since 3.0
     */
    sourceWidth?: number;

    /**
     * Default MIME type for exporting if `chart.exportChart()` is called
     * without specifying a `type` option. Possible values are `image/png`,
     *  `image/jpeg`, `application/pdf` and `image/svg+xml`.
     *
     * @since 2.0
     */
    type?: ExportingMimeTypeValue;

    /**
     * The URL for the server module converting the SVG string to an image
     * format. By default this points to Highcharts free web service.
     *
     * @since 2.0
     */
    url?: string;

    /**
     * The pixel width of charts exported to PNG or JPG. As of Highcharts
     * 3.0, the default pixel width is a function of the [chart.width](
     * #chart.width) or [exporting.sourceWidth](#exporting.sourceWidth) and the
     * [exporting.scale](#exporting.scale).
     *
     * @sample {highcharts} highcharts/exporting/width/
     *         Export to 200px wide images
     * @sample {highstock} highcharts/exporting/width/
     *         Export to 200px wide images
     *
     * @since 2.0
     */
    width?: number;
}

/**
 * Possible MIME types for exporting.
 *
 * @typedef {"image/png" | "image/jpeg" | "application/pdf" | "image/svg+xml"}
 * Highcharts.ExportingMimeTypeValue
 */
export type ExportingMimeTypeValue = 'image/png' | 'image/jpeg' |
    'application/pdf' | 'image/svg+xml';

export type ExportingMenuItemDefinitionsOptions =
    Record<string, Exporting.MenuObject> &
    ExportMenuItemDefinitionsDefaults;

export interface ExportMenuItemDefinitionsDefaults {
    viewFullscreen?: Exporting.MenuObject & {
        /**
         * @see [lang.viewFullscreen](#lang.viewFullscreen)
         * @default 'viewFullscreen'
         */
        textKey?: Exporting.MenuObject['textKey'];
    };

    printChart?: Exporting.MenuObject & {
        /**
         * @see [lang.printChart](#lang.printChart)
         * @default 'printChart'
         */
        textKey?: Exporting.MenuObject['textKey'];
    };

    separator?: Exporting.MenuObject & {
        /**
         * @default true
         */
        separator?: Exporting.MenuObject['separator'];
    };

    downloadPNG?: Exporting.MenuObject & {
        /**
         * @see [lang.downloadPNG](#lang.downloadPNG)
         * @default 'downloadPNG'
         */
        textKey?: Exporting.MenuObject['textKey'];
    };

    downloadJPEG?: Exporting.MenuObject & {
        /**
         * @see [lang.downloadJPEG](#lang.downloadJPEG)
         * @default 'downloadJPEG'
         */
        textKey?: Exporting.MenuObject['textKey'];
    };

    downloadPDF?: Exporting.MenuObject & {
        /**
         * @see [lang.downloadPDF](#lang.downloadPDF)
         * @default 'downloadPDF'
         */
        textKey?: Exporting.MenuObject['textKey'];
    };

    downloadSVG?: Exporting.MenuObject & {
        /**
         * @see [lang.downloadSVG](#lang.downloadSVG)
         * @default 'downloadSVG'
         */
        textKey?: Exporting.MenuObject['textKey'];
    };
}

// TODO: Based on the docs, this should be limited to an extension of
// NavigationOptions.buttonOptions, but all options are here instead.
export interface ExportingButtonOptions {
    /** @internal */
    _titleKey?: string;

    /**
     * Alignment for the buttons.
     *
     * @sample highcharts/navigation/buttonoptions-align/
     *         Center aligned
     *
     * @since 2.0
     */
    align?: AlignValue;

    /**
     * The pixel spacing between buttons, and between the context button and
     * the title.
     *
     * @sample highcharts/title/widthadjust
     *         Adjust the spacing when using text button
     *
     * @since 2.0
     */
    buttonSpacing?: number;

    /**
     * The class name of the context button.
     */
    className?: string;

    /**
     * Whether to enable buttons.
     *
     * @sample highcharts/navigation/buttonoptions-enabled/
     *         Exporting module loaded but buttons disabled
     *
     * @default true
     * @since   2.0
     */
    enabled?: boolean;

    /**
     * Pixel height of the buttons.
     *
     * @sample highcharts/navigation/buttonoptions-height/
     *         Bigger buttons
     *
     * @since 2.0
     */
    height?: number;

    /**
     * The class name of the menu appearing from the button.
     */
    menuClassName?: string;

    /**
     * A collection of strings pointing to config options for the menu
     * items. The config options are defined in the
     * `menuItemDefinitions` option.
     *
     * By default, there is the "View in full screen" and "Print" menu
     * items, plus one menu item for each of the available export types.
     *
     * @sample highcharts/exporting/menuitemdefinitions/
     *         Menu item definitions
     * @sample highcharts/exporting/menuitemdefinitions-webp/
     *         Adding a custom menu item for WebP export
     *
     * @default ["viewFullscreen", "printChart", "separator", "downloadPNG", "downloadJPEG", "downloadSVG"]
     * @since   2.0
     */
    menuItems?: Array<string>;

    /**
     * A click handler callback to use on the button directly instead of
     * the popup menu.
     *
     * @sample highcharts/exporting/buttons-contextbutton-onclick/
     *         Skip the menu and export the chart directly
     *
     * @since 2.0
     */
    onclick?: Function;

    /**
     * The symbol for the button. Points to a definition function in
     * the `Highcharts.Renderer.symbols` collection. The default
     * `menu` function is part of the exporting module. Possible
     * values are "circle", "square", "diamond", "triangle",
     * "triangle-down", "menu", "menuball" or custom shape.
     *
     * @sample highcharts/exporting/buttons-contextbutton-symbol/
     *         Use a circle for symbol
     * @sample highcharts/exporting/buttons-contextbutton-symbol-custom/
     *         Custom shape as symbol
     *
     * @since 2.0
     */
    symbol?: ('menu' | 'menuball' | SymbolKey);

    /**
     * Fill color for the symbol within the button.
     *
     * @sample highcharts/navigation/buttonoptions-symbolfill/
     *         Blue symbol stroke for one of the buttons
     *
     * @since 2.0
     */
    symbolFill?: ColorString;

    /**
     * The pixel size of the symbol on the button.
     *
     * @sample highcharts/navigation/buttonoptions-height/
     *         Bigger buttons
     *
     * @since 2.0
     */
    symbolSize?: number;

    /**
     * The color of the symbol's stroke or line.
     *
     * @sample highcharts/navigation/buttonoptions-symbolstroke/
     *         Blue symbol stroke
     *
     * @since 2.0
     */
    symbolStroke?: ColorString;

    /**
     * The pixel stroke width of the symbol on the button.
     *
     * @sample highcharts/navigation/buttonoptions-height/
     *         Bigger buttons
     *
     * @since 2.0
     */
    symbolStrokeWidth?: number;

    /**
     * The x position of the center of the symbol inside the button.
     *
     * @sample highcharts/navigation/buttonoptions-height/
     *         Bigger buttons
     *
     * @since 2.0
     */
    symbolX?: number;

    /**
     * The y position of the center of the symbol inside the button.
     *
     * @sample highcharts/navigation/buttonoptions-height/
     *         Bigger buttons
     *
     * @since 2.0
     */
    symbolY?: number;

    /**
     * A text string to add to the individual button.
     *
     * @sample highcharts/exporting/buttons-text/
     *         Full text button
     * @sample highcharts/exporting/buttons-text-usehtml/
     *         Icon using CSS font in text
     * @sample highcharts/exporting/buttons-text-symbol/
     *         Combined symbol and text
     *
     * @default null
     * @since   3.0
     */
    text?: string;

    /**
     * A configuration object for the button theme. The object accepts
     * SVG properties like `stroke-width`, `stroke` and `fill`.
     * Tri-state button styles are supported by the `states.hover` and
     * `states.select` objects.
     *
     * @sample highcharts/navigation/buttonoptions-theme/
     *         Theming the buttons
     *
     * @requires modules/exporting
     *
     * @since 3.0
     */
    theme?: ButtonThemeObject;

    /**
     * The key to a [lang](#lang) option setting that is used for the
     * button's title tooltip. When the key is `contextButtonTitle`, it
     * refers to [lang.contextButtonTitle](#lang.contextButtonTitle)
     * that defaults to "Chart context menu".
     *
     * @since 6.1.4
     */
    titleKey?: string;

    /**
     * Whether to use HTML for rendering the button. HTML allows for things
     * like inline CSS or image-based icons.
     *
     * @sample highcharts/exporting/buttons-text-usehtml/
     *         Icon using CSS font in text
     *
     * @default false
     * @since   10.3.0
     */
    useHTML?: boolean;

    /**
     * The vertical alignment of the buttons. Can be one of `"top"`,
     * `"middle"` or `"bottom"`.
     *
     * @sample highcharts/navigation/buttonoptions-verticalalign/
     *         Buttons at lower right
     *
     * @since 2.0
     */
    verticalAlign?: VerticalAlignValue;

    /**
     * The pixel width of the button.
     *
     * @sample highcharts/navigation/buttonoptions-height/
     *         Bigger buttons
     *
     * @since 2.0
     */
    width?: number;

    /**
     * The horizontal position of the button relative to the `align`
     * option.
     *
     * @default -10
     * @since   2.0
     */
    x?: number;

    /**
     * The vertical offset of the button's position relative to its
     * `verticalAlign`. By default adjusted for the chart title alignment.
     *
     * @sample highcharts/navigation/buttonoptions-verticalalign/
     *         Buttons at lower right
     *
     * @since 2.0
     */
    y?: number;
}

export interface ExportingButtonsOptions {
    [key: string]: ExportingButtonOptions;

    /**
     * Options for the export button.
     *
     * In styled mode, export button styles can be applied with the
     * `.highcharts-contextbutton` class.
     *
     * @declare  Highcharts.ExportingButtonsOptionsObject
     * @extends  navigation.buttonOptions
     * @requires modules/exporting
     */
    contextButton: ExportingButtonOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default ExportingOptions;
