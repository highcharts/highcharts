/* *
 *
 *  Exporting module
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import Chart from '../Core/Chart/Chart.js';
import chartNavigationMixin from '../mixins/navigation.js';
import H from '../Core/Globals.js';
const {
    doc,
    isTouchDevice,
    win
} = H;
import O from '../Core/Options.js';
const {
    defaultOptions
} = O;
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    css,
    createElement,
    discardElement,
    extend,
    find,
    fireEvent,
    isObject,
    merge,
    objectEach,
    pick,
    removeEvent,
    uniqueKey
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface ChartLike {
            btnCount?: number;
            buttonOffset?: number;
            exportContextMenu?: ExportingDivElement;
            exportDivElements?: Array<ExportingDivElement>;
            exportEvents?: Array<Function>;
            exporting?: ChartExportingObject;
            exportingGroup?: SVGElement;
            exportMenuHeight?: number;
            exportMenuWidth?: number;
            exportSVGElements?: Array<SVGElement>;
            forExport?: boolean;
            isDirtyExporting?: boolean;
            isPrinting?: boolean;
            openMenu?: boolean;
            printReverseInfo?: PrintReverseInfoObject;
            /** @requires modules/exporting */
            addButton(options: ExportingButtonOptions): void;
            /** @requires modules/exporting */
            afterPrint(): void;
            /** @requires modules/exporting */
            beforePrint(): void;
            /** @requires modules/exporting */
            contextMenu(
                className: string,
                items: Array<(string|ExportingMenuObject)>,
                x: number,
                y: number,
                width: number,
                height: number,
                button: SVGElement
            ): void;
            /** @requires modules/exporting */
            destroyExport(e?: Event): void;
            /** @requires modules/exporting */
            exportChart(
                exportingOptions?: ExportingOptions,
                chartOptions?: Options
            ): void;
            /** @requires modules/exporting */
            getChartHTML(): string;
            /** @requires modules/exporting */
            getFilename(): string;
            /** @requires modules/exporting */
            getSVG(chartOptions?: Options): string;
            /** @requires modules/exporting */
            getSVGForExport(
                options: ExportingOptions,
                chartOptions: Options
            ): string;
            /** @requires modules/exporting */
            inlineStyles(): void;
            /** @requires modules/exporting */
            moveContainers(moveTo: HTMLDOMElement): void;
            /** @requires modules/exporting */
            print(): void;
            /** @requires modules/exporting */
            renderExporting(): void;
            /** @requires modules/exporting */
            sanitizeSVG(svg: string, options: Options): string;
        }
        interface ChartEventsOptions {
            afterPrint?: ExportingAfterPrintCallbackFunction;
            beforePrint?: ExportingBeforePrintCallbackFunction;
        }
        interface ChartExportingObject {
            update(options: ExportingOptions, redraw?: boolean): void;
        }
        interface ExportingAfterPrintCallbackFunction {
            (chart: Chart, event: Event): void;
        }
        interface ExportingBeforePrintCallbackFunction {
            (chart: Chart, event: Event): void;
        }
        interface ExportingButtonOptions {
            _titleKey?: string;
            align?: AlignValue;
            buttonSpacing?: number;
            className?: string;
            enabled?: boolean;
            height?: number;
            menuClassName?: string;
            menuItems?: Array<string>;
            onclick?: Function;
            symbol?: ('menu'|'menuball'|'exportIcon'|string|SymbolKeyValue);
            symbolFill?: ColorString;
            symbolSize?: number;
            symbolStroke?: ColorString;
            symbolStrokeWidth?: number;
            symbolX?: number;
            symbolY?: number;
            text?: string;
            theme?: SVGAttributes;
            titleKey?: string;
            verticalAlign?: VerticalAlignValue;
            width?: number;
            x?: number;
            y?: number;
        }
        interface ExportingButtonsOptions {
            [key: string]: ExportingButtonOptions;
            contextButton: ExportingButtonOptions;
        }
        interface ExportingErrorCallbackFunction {
            (options: ExportingOptions, err: Error): void;
        }
        interface ExportingDivElement extends HTMLDOMElement {
            hideTimer?: number;
            hideMenu(): void;
        }
        interface ExportingMenuObject {
            onclick?: EventCallbackFunction<Chart>;
            separator?: boolean;
            text?: string;
            textKey?: string;
        }
        interface ExportingOptions {
            allowHTML?: boolean;
            buttons?: ExportingButtonsOptions;
            chartOptions?: Options;
            enabled?: boolean;
            error?: ExportingErrorCallbackFunction;
            fallbackToExportServer?: boolean;
            filename?: string;
            formAttributes?: HTMLAttributes;
            libURL?: string;
            menuItemDefinitions?: Dictionary<ExportingMenuObject>;
            printMaxWidth?: number;
            scale?: number;
            sourceHeight?: number;
            sourceWidth?: number;
            type?: string;
            url?: string;
            useMultiLevelHeaders?: boolean;
            useRowspanHeaders?: boolean;
            width?: number;
        }
        interface NavigationOptions {
            bindingsClassName?: string;
            buttonOptions?: ExportingButtonOptions;
            menuItemHoverStyle?: CSSObject;
            menuItemStyle?: CSSObject;
            menuStyle?: CSSObject;
        }
        interface LangOptions {
            contextButtonTitle?: string;
            exitFullscreen?: string;
            downloadJPEG?: string;
            downloadPDF?: string;
            downloadPNG?: string;
            downloadSVG?: string;
            printChart?: string;
            viewFullscreen?: string;
        }
        interface Options {
            exporting?: ExportingOptions;
            navigation?: NavigationOptions;
        }
        interface PrintReverseInfoObject {
            childNodes: NodeListOf<ChildNode>;
            origDisplay: Array<(string|null)> ;
            resetParams?: [
                (number|null)?,
                (number|null)?,
                (boolean|Partial<AnimationOptionsObject>)?
            ];
        }
        interface SVGRenderer {
            inlineBlacklist?: Array<RegExp>;
            inlineToAttributes?: Array<string>;
            unstyledElements?: Array<string>;
        }
        interface XAxisOptions {
            internalKey?: string;
        }
        /** @requires modules/exporting */
        function post(
            url: string,
            data: object,
            formAttributes?: Dictionary<string>
        ): void;

        let printingChart: (Chart|undefined);
    }
}

/**
 * Gets fired after a chart is printed through the context menu item or the
 * Chart.print method.
 *
 * @callback Highcharts.ExportingAfterPrintCallbackFunction
 *
 * @param {Highcharts.Chart} chart
 *        The chart on which the event occured.
 *
 * @param {global.Event} event
 *        The event that occured.
 */

/**
 * Gets fired before a chart is printed through the context menu item or the
 * Chart.print method.
 *
 * @callback Highcharts.ExportingBeforePrintCallbackFunction
 *
 * @param {Highcharts.Chart} chart
 *        The chart on which the event occured.
 *
 * @param {global.Event} event
 *        The event that occured.
 */

/**
 * Function to call if the offline-exporting module fails to export a chart on
 * the client side.
 *
 * @callback Highcharts.ExportingErrorCallbackFunction
 *
 * @param {Highcharts.ExportingOptions} options
 *        The exporting options.
 *
 * @param {global.Error} err
 *        The error from the module.
 */

/**
 * Definition for a menu item in the context menu.
 *
 * @interface Highcharts.ExportingMenuObject
 *//**
 * The text for the menu item.
 *
 * @name Highcharts.ExportingMenuObject#text
 * @type {string|undefined}
 *//**
 * If internationalization is required, the key to a language string.
 *
 * @name Highcharts.ExportingMenuObject#textKey
 * @type {string|undefined}
 *//**
 * The click handler for the menu item.
 *
 * @name Highcharts.ExportingMenuObject#onclick
 * @type {Highcharts.EventCallbackFunction<Highcharts.Chart>|undefined}
 *//**
 * Indicates a separator line instead of an item.
 *
 * @name Highcharts.ExportingMenuObject#separator
 * @type {boolean|undefined}
 */

/**
 * Possible MIME types for exporting.
 *
 * @typedef {"image/png"|"image/jpeg"|"application/pdf"|"image/svg+xml"} Highcharts.ExportingMimeTypeValue
 */

// create shortcuts
var userAgent = win.navigator.userAgent,
    symbols = H.Renderer.prototype.symbols,
    isMSBrowser = /Edge\/|Trident\/|MSIE /.test(userAgent),
    isFirefoxBrowser = /firefox/i.test(userAgent);

// Add language
extend(defaultOptions.lang
    /**
     * @optionparent lang
     */
    , {

        /**
         * Exporting module only. The text for the menu item to view the chart
         * in full screen.
         *
         * @since 8.0.1
         *
         * @private
         */
        viewFullscreen: 'View in full screen',

        /**
         * Exporting module only. The text for the menu item to exit the chart
         * from full screen.
         *
         * @since 8.0.1
         *
         * @private
         */
        exitFullscreen: 'Exit from full screen',


        /**
         * Exporting module only. The text for the menu item to print the chart.
         *
         * @since    3.0.1
         * @requires modules/exporting
         *
         * @private
         */
        printChart: 'Print chart',

        /**
         * Exporting module only. The text for the PNG download menu item.
         *
         * @since    2.0
         * @requires modules/exporting
         *
         * @private
         */
        downloadPNG: 'Download PNG image',

        /**
         * Exporting module only. The text for the JPEG download menu item.
         *
         * @since    2.0
         * @requires modules/exporting
         *
         * @private
         */
        downloadJPEG: 'Download JPEG image',

        /**
         * Exporting module only. The text for the PDF download menu item.
         *
         * @since    2.0
         * @requires modules/exporting
         *
         * @private
         */
        downloadPDF: 'Download PDF document',

        /**
         * Exporting module only. The text for the SVG download menu item.
         *
         * @since    2.0
         * @requires modules/exporting
         *
         * @private
         */
        downloadSVG: 'Download SVG vector image',

        /**
         * Exporting module menu. The tooltip title for the context menu holding
         * print and export menu items.
         *
         * @since    3.0
         * @requires modules/exporting
         *
         * @private
         */
        contextButtonTitle: 'Chart context menu'

    });

if (!defaultOptions.navigation) {
    // Buttons and menus are collected in a separate config option set called
    // 'navigation'. This can be extended later to add control buttons like
    // zoom and pan right click menus.
    /**
     * A collection of options for buttons and menus appearing in the exporting
     * module.
     *
     * @requires     modules/exporting
     * @optionparent navigation
     */
    defaultOptions.navigation = {};
}
merge(true, defaultOptions.navigation, {

    /**
     * @optionparent navigation.buttonOptions
     *
     * @private
     */
    buttonOptions: {

        theme: {},

        /**
         * Whether to enable buttons.
         *
         * @sample highcharts/navigation/buttonoptions-enabled/
         *         Exporting module loaded but buttons disabled
         *
         * @type      {boolean}
         * @default   true
         * @since     2.0
         * @apioption navigation.buttonOptions.enabled
         */

        /**
         * The pixel size of the symbol on the button.
         *
         * @sample highcharts/navigation/buttonoptions-height/
         *         Bigger buttons
         *
         * @since 2.0
         */
        symbolSize: 14,

        /**
         * The x position of the center of the symbol inside the button.
         *
         * @sample highcharts/navigation/buttonoptions-height/
         *         Bigger buttons
         *
         * @since 2.0
         */
        symbolX: 12.5,

        /**
         * The y position of the center of the symbol inside the button.
         *
         * @sample highcharts/navigation/buttonoptions-height/
         *         Bigger buttons
         *
         * @since 2.0
         */
        symbolY: 10.5,

        /**
         * Alignment for the buttons.
         *
         * @sample highcharts/navigation/buttonoptions-align/
         *         Center aligned
         *
         * @type  {Highcharts.AlignValue}
         * @since 2.0
         */
        align: 'right',

        /**
         * The pixel spacing between buttons.
         *
         * @since 2.0
         */
        buttonSpacing: 3,

        /**
         * Pixel height of the buttons.
         *
         * @sample highcharts/navigation/buttonoptions-height/
         *         Bigger buttons
         *
         * @since 2.0
         */
        height: 22,

        /**
         * A text string to add to the individual button.
         *
         * @sample highcharts/exporting/buttons-text/
         *         Full text button
         * @sample highcharts/exporting/buttons-text-symbol/
         *         Combined symbol and text
         *
         * @type      {string}
         * @default   null
         * @since     3.0
         * @apioption navigation.buttonOptions.text
         */

        /**
         * The vertical offset of the button's position relative to its
         * `verticalAlign`.
         *
         * @sample highcharts/navigation/buttonoptions-verticalalign/
         *         Buttons at lower right
         *
         * @type      {number}
         * @default   0
         * @since     2.0
         * @apioption navigation.buttonOptions.y
         */

        /**
         * The vertical alignment of the buttons. Can be one of `"top"`,
         * `"middle"` or `"bottom"`.
         *
         * @sample highcharts/navigation/buttonoptions-verticalalign/
         *         Buttons at lower right
         *
         * @type  {Highcharts.VerticalAlignValue}
         * @since 2.0
         */
        verticalAlign: 'top',

        /**
         * The pixel width of the button.
         *
         * @sample highcharts/navigation/buttonoptions-height/
         *         Bigger buttons
         *
         * @since 2.0
         */
        width: 24

    }

});

// Presentational attributes
merge(true, defaultOptions.navigation
    /**
     * A collection of options for buttons and menus appearing in the exporting
     * module.
     *
     * @optionparent navigation
     */
    , {

        /**
         * CSS styles for the popup menu appearing by default when the export
         * icon is clicked. This menu is rendered in HTML.
         *
         * @see In styled mode, the menu is styled with the `.highcharts-menu`
         *      class.
         *
         * @sample highcharts/navigation/menustyle/
         *         Light gray menu background
         *
         * @type    {Highcharts.CSSObject}
         * @default {"border": "1px solid #999999", "background": "#ffffff", "padding": "5px 0"}
         * @since   2.0
         *
         * @private
         */
        menuStyle: {
            /** @ignore-option */
            border: '1px solid ${palette.neutralColor40}',
            /** @ignore-option */
            background: '${palette.backgroundColor}',
            /** @ignore-option */
            padding: '5px 0'
        },

        /**
         * CSS styles for the individual items within the popup menu appearing
         * by default when the export icon is clicked. The menu items are
         * rendered in HTML. Font size defaults to `11px` on desktop and `14px`
         * on touch devices.
         *
         * @see In styled mode, the menu items are styled with the
         *      `.highcharts-menu-item` class.
         *
         * @sample {highcharts} highcharts/navigation/menuitemstyle/
         *         Add a grey stripe to the left
         *
         * @type    {Highcharts.CSSObject}
         * @default {"padding": "0.5em 1em", "color": "#333333", "background": "none", "fontSize": "11px/14px", "transition": "background 250ms, color 250ms"}
         * @since   2.0
         *
         * @private
         */
        menuItemStyle: {
            /** @ignore-option */
            padding: '0.5em 1em',
            /** @ignore-option */
            color: '${palette.neutralColor80}',
            /** @ignore-option */
            background: 'none',
            /** @ignore-option */
            fontSize: isTouchDevice ? '14px' : '11px',
            /** @ignore-option */
            transition: 'background 250ms, color 250ms'
        },

        /**
         * CSS styles for the hover state of the individual items within the
         * popup menu appearing by default when the export icon is clicked. The
         * menu items are rendered in HTML.
         *
         * @see In styled mode, the menu items are styled with the
         *      `.highcharts-menu-item` class.
         *
         * @sample highcharts/navigation/menuitemhoverstyle/
         *         Bold text on hover
         *
         * @type    {Highcharts.CSSObject}
         * @default {"background": "#335cad", "color": "#ffffff"}
         * @since   2.0
         *
         * @private
         */
        menuItemHoverStyle: {
            /** @ignore-option */
            background: '${palette.highlightColor80}',
            /** @ignore-option */
            color: '${palette.backgroundColor}'
        },

        /**
         * A collection of options for buttons appearing in the exporting
         * module.
         *
         * In styled mode, the buttons are styled with the
         * `.highcharts-contextbutton` and `.highcharts-button-symbol` classes.
         *
         * @requires modules/exporting
         *
         * @private
         */
        buttonOptions: {

            /**
             * Fill color for the symbol within the button.
             *
             * @sample highcharts/navigation/buttonoptions-symbolfill/
             *         Blue symbol stroke for one of the buttons
             *
             * @type  {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @since 2.0
             */
            symbolFill: '${palette.neutralColor60}',

            /**
             * The color of the symbol's stroke or line.
             *
             * @sample highcharts/navigation/buttonoptions-symbolstroke/
             *         Blue symbol stroke
             *
             * @type  {Highcharts.ColorString}
             * @since 2.0
             */
            symbolStroke: '${palette.neutralColor60}',

            /**
             * The pixel stroke width of the symbol on the button.
             *
             * @sample highcharts/navigation/buttonoptions-height/
             *         Bigger buttons
             *
             * @since 2.0
             */
            symbolStrokeWidth: 3,

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
            theme: {

                /**
                 * The default fill exists only to capture hover events.
                 *
                 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @default   ${palette.backgroundColor}
                 * @apioption navigation.buttonOptions.theme.fill
                 */

                /**
                 * Default stroke for the buttons.
                 * @type      {Highcharts.ColorString}
                 * @default   none
                 * @apioption navigation.buttonOptions.theme.stroke
                 */

                /**
                 * Padding for the button.
                 */
                padding: 5

            }

        }

    });


// Add the export related options

/**
 * Options for the exporting module. For an overview on the matter, see
 * [the docs](https://www.highcharts.com/docs/export-module/export-module-overview).
 *
 * @requires     modules/exporting
 * @optionparent exporting
 */
defaultOptions.exporting = {

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
     * @type      {boolean}
     * @default   false
     * @since     4.1.8
     * @apioption exporting.allowHTML
     */

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
     *
     * @type      {Highcharts.Options}
     * @apioption exporting.chartOptions
     */

    /**
     * Whether to enable the exporting module. Disabling the module will
     * hide the context button, but API methods will still be available.
     *
     * @sample {highcharts} highcharts/exporting/enabled-false/
     *         Exporting module is loaded but disabled
     * @sample {highstock} highcharts/exporting/enabled-false/
     *         Exporting module is loaded but disabled
     *
     * @type      {boolean}
     * @default   true
     * @since     2.0
     * @apioption exporting.enabled
     */

    /**
     * Function to call if the offline-exporting module fails to export
     * a chart on the client side, and [fallbackToExportServer](
     * #exporting.fallbackToExportServer) is disabled. If left undefined, an
     * exception is thrown instead. Receives two parameters, the exporting
     * options, and the error from the module.
     *
     * @see [fallbackToExportServer](#exporting.fallbackToExportServer)
     *
     * @type      {Highcharts.ExportingErrorCallbackFunction}
     * @since     5.0.0
     * @requires  modules/exporting
     * @requires  modules/offline-exporting
     * @apioption exporting.error
     */

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
     * @type      {boolean}
     * @default   true
     * @since     4.1.8
     * @requires  modules/exporting
     * @requires  modules/offline-exporting
     * @apioption exporting.fallbackToExportServer
     */

    /**
     * The filename, without extension, to use for the exported chart.
     *
     * @sample {highcharts} highcharts/exporting/filename/
     *         Custom file name
     * @sample {highstock} highcharts/exporting/filename/
     *         Custom file name
     *
     * @type      {string}
     * @default   chart
     * @since     2.0
     * @apioption exporting.filename
     */

    /**
     * An object containing additional key value data for the POST form that
     * sends the SVG to the export server. For example, a `target` can be set to
     * make sure the generated image is received in another frame, or a custom
     * `enctype` or `encoding` can be set.
     *
     * @type      {Highcharts.HTMLAttributes}
     * @since     3.0.8
     * @apioption exporting.formAttributes
     */

    /**
     * Path where Highcharts will look for export module dependencies to
     * load on demand if they don't already exist on `window`. Should currently
     * point to location of [CanVG](https://github.com/canvg/canvg) library,
     * [RGBColor.js](https://github.com/canvg/canvg),
     * [jsPDF](https://github.com/yWorks/jsPDF) and
     * [svg2pdf.js](https://github.com/yWorks/svg2pdf.js), required for client
     * side export in certain browsers.
     *
     * @type      {string}
     * @default   https://code.highcharts.com/{version}/lib
     * @since     5.0.0
     * @apioption exporting.libURL
     */

    /**
     * Analogous to [sourceWidth](#exporting.sourceWidth).
     *
     * @type      {number}
     * @since     3.0
     * @apioption exporting.sourceHeight
     */

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
     * @type      {number}
     * @since     3.0
     * @apioption exporting.sourceWidth
     */

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
     * @type      {number}
     * @since     2.0
     * @apioption exporting.width
     */

    /**
     * Default MIME type for exporting if `chart.exportChart()` is called
     * without specifying a `type` option. Possible values are `image/png`,
     *  `image/jpeg`, `application/pdf` and `image/svg+xml`.
     *
     * @type  {Highcharts.ExportingMimeTypeValue}
     * @since 2.0
     */
    type: 'image/png',

    /**
     * The URL for the server module converting the SVG string to an image
     * format. By default this points to Highchart's free web service.
     *
     * @since 2.0
     */
    url: 'https://export.highcharts.com/',

    /**
     * When printing the chart from the menu item in the burger menu, if
     * the on-screen chart exceeds this width, it is resized. After printing
     * or cancelled, it is restored. The default width makes the chart
     * fit into typical paper format. Note that this does not affect the
     * chart when printing the web page as a whole.
     *
     * @since 4.2.5
     */
    printMaxWidth: 780,

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
    scale: 2,

    /**
     * Options for the export related buttons, print and export. In addition
     * to the default buttons listed here, custom buttons can be added.
     * See [navigation.buttonOptions](#navigation.buttonOptions) for general
     * options.
     *
     * @type     {Highcharts.Dictionary<*>}
     * @requires modules/exporting
     */
    buttons: {

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
        contextButton: {

            /**
             * A click handler callback to use on the button directly instead of
             * the popup menu.
             *
             * @sample highcharts/exporting/buttons-contextbutton-onclick/
             *         Skip the menu and export the chart directly
             *
             * @type      {Function}
             * @since     2.0
             * @apioption exporting.buttons.contextButton.onclick
             */

            /**
             * See [navigation.buttonOptions.symbolFill](
             * #navigation.buttonOptions.symbolFill).
             *
             * @type      {Highcharts.ColorString}
             * @default   #666666
             * @since     2.0
             * @apioption exporting.buttons.contextButton.symbolFill
             */

            /**
             * The horizontal position of the button relative to the `align`
             * option.
             *
             * @type      {number}
             * @default   -10
             * @since     2.0
             * @apioption exporting.buttons.contextButton.x
             */

            /**
             * The class name of the context button.
             */
            className: 'highcharts-contextbutton',

            /**
             * The class name of the menu appearing from the button.
             */
            menuClassName: 'highcharts-contextmenu',

            /**
             * The symbol for the button. Points to a definition function in
             * the `Highcharts.Renderer.symbols` collection. The default
             * `exportIcon` function is part of the exporting module. Possible
             * values are "circle", "square", "diamond", "triangle",
             * "triangle-down", "menu", "menuball" or custom shape.
             *
             * @sample highcharts/exporting/buttons-contextbutton-symbol/
             *         Use a circle for symbol
             * @sample highcharts/exporting/buttons-contextbutton-symbol-custom/
             *         Custom shape as symbol
             *
             * @type  {Highcharts.SymbolKeyValue|"exportIcon"|"menu"|"menuball"|string}
             * @since 2.0
             */
            symbol: 'menu',

            /**
             * The key to a [lang](#lang) option setting that is used for the
             * button's title tooltip. When the key is `contextButtonTitle`, it
             * refers to [lang.contextButtonTitle](#lang.contextButtonTitle)
             * that defaults to "Chart context menu".
             *
             * @since 6.1.4
             */
            titleKey: 'contextButtonTitle',

            /**
             * This option is deprecated, use
             * [titleKey](#exporting.buttons.contextButton.titleKey) instead.
             *
             * @deprecated
             * @type      {string}
             * @apioption exporting.buttons.contextButton._titleKey
             */

            /**
             * A collection of strings pointing to config options for the menu
             * items. The config options are defined in the
             * `menuItemDefinitions` option.
             *
             * By default, there is the "View in full screen" and "Print" menu
             * items, plus one menu item for each of the available export types.
             *
             * @sample {highcharts} highcharts/exporting/menuitemdefinitions/
             *         Menu item definitions
             * @sample {highstock} highcharts/exporting/menuitemdefinitions/
             *         Menu item definitions
             * @sample {highmaps} highcharts/exporting/menuitemdefinitions/
             *         Menu item definitions
             *
             * @type    {Array<string>}
             * @default ["viewFullscreen", "printChart", "separator", "downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG"]
             * @since   2.0
             */
            menuItems: [
                'viewFullscreen',
                'printChart',
                'separator',
                'downloadPNG',
                'downloadJPEG',
                'downloadPDF',
                'downloadSVG'
            ]

        }

    },
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
     * @sample {highcharts} highcharts/exporting/menuitemdefinitions/
     *         Menu item definitions
     * @sample {highstock} highcharts/exporting/menuitemdefinitions/
     *         Menu item definitions
     * @sample {highmaps} highcharts/exporting/menuitemdefinitions/
     *         Menu item definitions
     *
     *
     * @type    {Highcharts.Dictionary<Highcharts.ExportingMenuObject>}
     * @default {"viewFullscreen": {}, "printChart": {}, "separator": {}, "downloadPNG": {}, "downloadJPEG": {}, "downloadPDF": {}, "downloadSVG": {}}
     * @since   5.0.13
     */
    menuItemDefinitions: {

        /**
         * @ignore
         */
        viewFullscreen: {
            textKey: 'viewFullscreen',
            onclick: function (): void {
                this.fullscreen.toggle();
            }
        },

        /**
         * @ignore
         */
        printChart: {
            textKey: 'printChart',
            onclick: function (): void {
                this.print();
            }
        },

        /**
         * @ignore
         */
        separator: {
            separator: true
        },

        /**
         * @ignore
         */
        downloadPNG: {
            textKey: 'downloadPNG',
            onclick: function (): void {
                this.exportChart();
            }
        },

        /**
         * @ignore
         */
        downloadJPEG: {
            textKey: 'downloadJPEG',
            onclick: function (): void {
                this.exportChart({
                    type: 'image/jpeg'
                });
            }
        },

        /**
         * @ignore
         */
        downloadPDF: {
            textKey: 'downloadPDF',
            onclick: function (): void {
                this.exportChart({
                    type: 'application/pdf'
                });
            }
        },

        /**
         * @ignore
         */
        downloadSVG: {
            textKey: 'downloadSVG',
            onclick: function (): void {
                this.exportChart({
                    type: 'image/svg+xml'
                });
            }
        }

    }

};

/**
 * Fires after a chart is printed through the context menu item or the
 * `Chart.print` method.
 *
 * @sample highcharts/chart/events-beforeprint-afterprint/
 *         Rescale the chart to print
 *
 * @type      {Highcharts.ExportingAfterPrintCallbackFunction}
 * @since     4.1.0
 * @context   Highcharts.Chart
 * @requires  modules/exporting
 * @apioption chart.events.afterPrint
 */

/**
 * Fires before a chart is printed through the context menu item or
 * the `Chart.print` method.
 *
 * @sample highcharts/chart/events-beforeprint-afterprint/
 *         Rescale the chart to print
 *
 * @type      {Highcharts.ExportingBeforePrintCallbackFunction}
 * @since     4.1.0
 * @context   Highcharts.Chart
 * @requires  modules/exporting
 * @apioption chart.events.beforePrint
 */

/**
 * The post utility
 *
 * @private
 * @function Highcharts.post
 * @param {string} url
 *        Post URL
 * @param {object} data
 *        Post data
 * @param {Highcharts.Dictionary<string>} [formAttributes]
 *        Additional attributes for the post request
 * @return {void}
 */
H.post = function (
    url: string,
    data: object,
    formAttributes?: Highcharts.HTMLAttributes
): void {
    // create the form
    var form: HTMLFormElement = createElement('form', merge({
        method: 'post',
        action: url,
        enctype: 'multipart/form-data'
    }, formAttributes), {
        display: 'none'
    }, doc.body) as unknown as HTMLFormElement;

    // add the data
    objectEach(data, function (val: string, name: string): void {
        createElement('input', {
            type: 'hidden',
            name: name,
            value: val
        }, null as any, form);
    });

    // submit
    form.submit();

    // clean up
    discardElement(form);
};


if (H.isSafari) {
    H.win.matchMedia('print').addListener(
        function (
            this: MediaQueryList,
            mqlEvent: MediaQueryListEvent
        ): void {
            if (!H.printingChart) {
                return void 0;
            }
            if (mqlEvent.matches) {
                H.printingChart.beforePrint();
            } else {
                H.printingChart.afterPrint();
            }
        }
    );
}

extend(Chart.prototype, /** @lends Highcharts.Chart.prototype */ {

    /* eslint-disable no-invalid-this, valid-jsdoc */

    /**
     * Exporting module only. A collection of fixes on the produced SVG to
     * account for expando properties, browser bugs, VML problems and other.
     * Returns a cleaned SVG.
     *
     * @private
     * @function Highcharts.Chart#sanitizeSVG
     * @param {string} svg
     *        SVG code to sanitize
     * @param {Highcharts.Options} options
     *        Chart options to apply
     * @return {string}
     *         Sanitized SVG code
     * @requires modules/exporting
     */
    sanitizeSVG: function (
        this: Chart,
        svg: string,
        options: Highcharts.Options
    ): string {

        var split = svg.indexOf('</svg>') + 6,
            html = svg.substr(split);

        // Remove any HTML added to the container after the SVG (#894, #9087)
        svg = svg.substr(0, split);

        // Move HTML into a foreignObject
        if (options && options.exporting && options.exporting.allowHTML) {
            if (html) {
                html = '<foreignObject x="0" y="0" ' +
                            'width="' + (options.chart as any).width + '" ' +
                            'height="' + (options.chart as any).height + '">' +
                    '<body xmlns="http://www.w3.org/1999/xhtml">' +
                    // Some tags needs to be closed in xhtml (#13726)
                    html.replace(/(<(?:img|br).*?(?=\>))>/g, '$1 />') +
                    '</body>' +
                    '</foreignObject>';
                svg = svg.replace('</svg>', html + '</svg>');
            }

        }

        svg = svg
            .replace(/zIndex="[^"]+"/g, '')
            .replace(/symbolName="[^"]+"/g, '')
            .replace(/jQuery[0-9]+="[^"]+"/g, '')
            .replace(/url\(("|&quot;)(.*?)("|&quot;)\;?\)/g, 'url($2)')
            .replace(/url\([^#]+#/g, 'url(#')
            .replace(
                /<svg /,
                '<svg xmlns:xlink="http://www.w3.org/1999/xlink" '
            )
            .replace(/ (|NS[0-9]+\:)href=/g, ' xlink:href=') // #3567
            .replace(/\n/, ' ')
            // Batik doesn't support rgba fills and strokes (#3095)
            .replace(
                /(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, // eslint-disable-line max-len
                '$1="rgb($2)" $1-opacity="$3"'
            )

            // Replace HTML entities, issue #347
            .replace(/&nbsp;/g, '\u00A0') // no-break space
            .replace(/&shy;/g, '\u00AD'); // soft hyphen

        // Further sanitize for oldIE
        if (this.ieSanitizeSVG) {
            svg = this.ieSanitizeSVG(svg);
        }

        return svg;
    },

    /**
     * Return the unfiltered innerHTML of the chart container. Used as hook for
     * plugins. In styled mode, it also takes care of inlining CSS style rules.
     *
     * @see Chart#getSVG
     *
     * @function Highcharts.Chart#getChartHTML
     *
     * @returns {string}
     *          The unfiltered SVG of the chart.
     *
     * @requires modules/exporting
     */
    getChartHTML: function (this: Chart): string {
        if (this.styledMode) {
            this.inlineStyles();
        }

        return this.container.innerHTML;
    },

    /**
     * Return an SVG representation of the chart.
     *
     * @sample highcharts/members/chart-getsvg/
     *         View the SVG from a button
     *
     * @function Highcharts.Chart#getSVG
     *
     * @param {Highcharts.Options} [chartOptions]
     *        Additional chart options for the generated SVG representation. For
     *        collections like `xAxis`, `yAxis` or `series`, the additional
     *        options is either merged in to the original item of the same
     *        `id`, or to the first item if a common id is not found.
     *
     * @return {string}
     *         The SVG representation of the rendered chart.
     *
     * @fires Highcharts.Chart#event:getSVG
     *
     * @requires modules/exporting
     */
    getSVG: function (
        this: Chart,
        chartOptions?: Highcharts.Options
    ): string {
        var chart = this,
            chartCopy: Chart,
            sandbox,
            svg,
            seriesOptions: Highcharts.SeriesOptions,
            sourceWidth: number,
            sourceHeight: number,
            cssWidth: string,
            cssHeight: string,
            // Copy the options and add extra options
            options = merge(chart.options, chartOptions);

        // Use userOptions to make the options chain in series right (#3881)
        options.plotOptions = merge(
            chart.userOptions.plotOptions,
            chartOptions && chartOptions.plotOptions
        );
        // ... and likewise with time, avoid that undefined time properties are
        // merged over legacy global time options
        options.time = merge(
            chart.userOptions.time,
            chartOptions && chartOptions.time
        );

        // create a sandbox where a new chart will be generated
        sandbox = createElement('div', null as any, {
            position: 'absolute',
            top: '-9999em',
            width: chart.chartWidth + 'px',
            height: chart.chartHeight + 'px'
        }, doc.body);

        // get the source size
        cssWidth = chart.renderTo.style.width as any;
        cssHeight = chart.renderTo.style.height as any;
        sourceWidth = (options.exporting as any).sourceWidth ||
            (options.chart as any).width ||
            (/px$/.test(cssWidth) && parseInt(cssWidth, 10)) ||
            (options.isGantt ? 800 : 600);
        sourceHeight = (options.exporting as any).sourceHeight ||
            (options.chart as any).height ||
            (/px$/.test(cssHeight) && parseInt(cssHeight, 10)) ||
            400;

        // override some options
        extend(options.chart, {
            animation: false,
            renderTo: sandbox,
            forExport: true,
            renderer: 'SVGRenderer',
            width: sourceWidth,
            height: sourceHeight
        });
        (options.exporting as any).enabled = false; // hide buttons in print
        delete options.data; // #3004

        // prepare for replicating the chart
        options.series = [];
        chart.series.forEach(function (serie: Highcharts.Series): void {
            seriesOptions = merge(serie.userOptions, { // #4912
                animation: false, // turn off animation
                enableMouseTracking: false,
                showCheckbox: false,
                visible: serie.visible
            });

            // Used for the navigator series that has its own option set
            if (!seriesOptions.isInternal) {
                (options.series as any).push(seriesOptions);
            }
        });

        // Assign an internal key to ensure a one-to-one mapping (#5924)
        chart.axes.forEach(function (axis: Highcharts.Axis): void {
            if (!axis.userOptions.internalKey) { // #6444
                axis.userOptions.internalKey = uniqueKey();
            }
        });

        // generate the chart copy
        chartCopy = new H.Chart(options, chart.callback);

        // Axis options and series options  (#2022, #3900, #5982)
        if (chartOptions) {
            ['xAxis', 'yAxis', 'series'].forEach(function (coll: string): void {
                var collOptions: Highcharts.Options = {};

                if ((chartOptions as any)[coll]) {
                    (collOptions as any)[coll] = (chartOptions as any)[coll];
                    chartCopy.update(collOptions);
                }
            });
        }

        // Reflect axis extremes in the export (#5924)
        chart.axes.forEach(function (axis: Highcharts.Axis): void {
            var axisCopy = find(chartCopy.axes, function (
                    copy: Highcharts.Axis
                ): boolean {
                    return copy.options.internalKey ===
                        axis.userOptions.internalKey;
                }),
                extremes = axis.getExtremes(),
                userMin = extremes.userMin,
                userMax = extremes.userMax;

            if (
                axisCopy &&
                ((
                    typeof userMin !== 'undefined' &&
                    userMin !== axisCopy.min) || (
                    typeof userMax !== 'undefined' &&
                    userMax !== axisCopy.max
                ))
            ) {
                axisCopy.setExtremes(userMin, userMax, true, false);
            }
        });

        // Get the SVG from the container's innerHTML
        svg = chartCopy.getChartHTML();
        fireEvent(this, 'getSVG', { chartCopy: chartCopy });

        svg = chart.sanitizeSVG(svg, options);

        // free up memory
        options = null as any;
        chartCopy.destroy();
        discardElement(sandbox);

        return svg;
    },

    /**
     * @private
     * @function Highcharts.Chart#getSVGForExport
     * @param {Highcharts.ExportingOptions} options
     * @param {Highcharts.Options} chartOptions
     * @return {string}
     * @requires modules/exporting
     */
    getSVGForExport: function (
        this: Chart,
        options: Highcharts.ExportingOptions,
        chartOptions: Highcharts.Options
    ): string {
        var chartExportingOptions: Highcharts.ExportingOptions =
            this.options.exporting as any;

        return this.getSVG(merge(
            { chart: { borderRadius: 0 } },
            chartExportingOptions.chartOptions,
            chartOptions,
            {
                exporting: {
                    sourceWidth: (
                        (options && options.sourceWidth) ||
                        chartExportingOptions.sourceWidth
                    ),
                    sourceHeight: (
                        (options && options.sourceHeight) ||
                        chartExportingOptions.sourceHeight
                    )
                }
            }
        ));
    },

    /**
     * Get the default file name used for exported charts. By default it creates
     * a file name based on the chart title.
     *
     * @function Highcharts.Chart#getFilename
     *
     * @return {string} A file name without extension.
     *
     * @requires modules/exporting
     */
    getFilename: function (this: Chart): string {
        var s = this.userOptions.title && this.userOptions.title.text,
            filename: string = (this.options.exporting as any).filename;

        if (filename) {
            return filename.replace(/\//g, '-');
        }

        if (typeof s === 'string') {
            filename = s
                .toLowerCase()
                .replace(/<\/?[^>]+(>|$)/g, '') // strip HTML tags
                .replace(/[\s_]+/g, '-')
                .replace(/[^a-z0-9\-]/g, '') // preserve only latin
                .replace(/^[\-]+/g, '') // dashes in the start
                .replace(/[\-]+/g, '-') // dashes in a row
                .substr(0, 24)
                .replace(/[\-]+$/g, ''); // dashes in the end;
        }

        if (!filename || filename.length < 5) {
            filename = 'chart';
        }

        return filename;
    },

    /**
     * Exporting module required. Submit an SVG version of the chart to a server
     * along with some parameters for conversion.
     *
     * @sample highcharts/members/chart-exportchart/
     *         Export with no options
     * @sample highcharts/members/chart-exportchart-filename/
     *         PDF type and custom filename
     * @sample highcharts/members/chart-exportchart-custom-background/
     *         Different chart background in export
     * @sample stock/members/chart-exportchart/
     *         Export with Highstock
     *
     * @function Highcharts.Chart#exportChart
     *
     * @param {Highcharts.ExportingOptions} exportingOptions
     *        Exporting options in addition to those defined in
     *        [exporting](https://api.highcharts.com/highcharts/exporting).
     *
     * @param {Highcharts.Options} chartOptions
     *        Additional chart options for the exported chart. For example a
     *        different background color can be added here, or `dataLabels` for
     *        export only.
     *
     * @return {void}
     *
     * @requires modules/exporting
     */
    exportChart: function (
        this: Chart,
        exportingOptions: Highcharts.ExportingOptions,
        chartOptions: Highcharts.Options
    ): void {

        var svg = this.getSVGForExport(exportingOptions, chartOptions);

        // merge the options
        exportingOptions = merge(this.options.exporting, exportingOptions);

        // do the post
        H.post(exportingOptions.url as any, {
            filename: exportingOptions.filename ? exportingOptions.filename.replace(/\//g, '-') : this.getFilename(),
            type: exportingOptions.type,
            // IE8 fails to post undefined correctly, so use 0
            width: exportingOptions.width || 0,
            scale: exportingOptions.scale,
            svg: svg
        }, exportingOptions.formAttributes as any);
    },

    /**
    * Move the chart container(s) to another div.
    *
    * @function Highcharts#moveContainers
    *
    * @private
    *
    * @param {Highcharts.HTMLDOMElement} moveTo
    *        Move target
    * @return {void}
    */
    moveContainers: function (
        this: Chart,
        moveTo: Highcharts.HTMLDOMElement
    ): void {
        const chart = this;
        (
            chart.fixedDiv ? // When scrollablePlotArea is active (#9533)
                [chart.fixedDiv, chart.scrollingContainer as any] :
                [chart.container]

        ).forEach(function (div: Highcharts.HTMLDOMElement): void {
            moveTo.appendChild(div);
        });
    },

    /**
    * Prepare chart and document before printing a chart.
    *
    * @function Highcharts#beforePrint
    *
    * @private
    *
    * @return {void}
    *
    * @fires Highcharts.Chart#event:beforePrint
    */
    beforePrint: function (this: Chart): void {
        const chart = this,
            body = doc.body,
            printMaxWidth: number =
                (chart.options.exporting as any).printMaxWidth,
            printReverseInfo: Highcharts.PrintReverseInfoObject = {
                childNodes: body.childNodes,
                origDisplay: [],
                resetParams: void 0
            };

        var handleMaxWidth: (boolean|number);

        chart.isPrinting = true;
        chart.pointer.reset(null as any, 0);

        fireEvent(chart, 'beforePrint');

        // Handle printMaxWidth
        handleMaxWidth = printMaxWidth && chart.chartWidth > printMaxWidth;
        if (handleMaxWidth) {
            printReverseInfo.resetParams = [
                (chart.options.chart as any).width,
                void 0,
                false
            ];
            chart.setSize(printMaxWidth, void 0, false);
        }

        // hide all body content
        [].forEach.call(printReverseInfo.childNodes, function (
            node: Highcharts.HTMLDOMElement,
            i: number
        ): void {
            if (node.nodeType === 1) {
                printReverseInfo.origDisplay[i] = node.style.display;
                node.style.display = 'none';
            }
        });

        // pull out the chart
        chart.moveContainers(body);
        // Storage details for undo action after printing
        chart.printReverseInfo = printReverseInfo;
    },

    /**
    * Clena up after printing a chart.
    *
    * @function Highcharts#afterPrint
    *
    * @private
    *
    * @param {Highcharts.Chart} chart
    *        Chart that was (or suppose to be) printed
    * @return {void}
    *
    * @fires Highcharts.Chart#event:afterPrint
    */
    afterPrint: function (this: Chart): void {
        const chart = this;

        if (!chart.printReverseInfo) {
            return void 0;
        }
        const childNodes = chart.printReverseInfo.childNodes,
            origDisplay = chart.printReverseInfo.origDisplay,
            resetParams = chart.printReverseInfo.resetParams;

        // put the chart back in
        chart.moveContainers(chart.renderTo);

        // restore all body content
        [].forEach.call(childNodes, function (
            node: Highcharts.HTMLDOMElement,
            i: number
        ): void {
            if (node.nodeType === 1) {
                node.style.display = (origDisplay[i] || '');
            }
        });

        chart.isPrinting = false;

        // Reset printMaxWidth
        if (resetParams) {
            chart.setSize.apply(chart, resetParams);
        }

        delete chart.printReverseInfo;
        delete H.printingChart;

        fireEvent(chart, 'afterPrint');
    },

    /**
     * Exporting module required. Clears away other elements in the page and
     * prints the chart as it is displayed. By default, when the exporting
     * module is enabled, a context button with a drop down menu in the upper
     * right corner accesses this function.
     *
     * @sample highcharts/members/chart-print/
     *         Print from a HTML button
     *
     * @function Highcharts.Chart#print
     *
     * @return {void}
     *
     * @fires Highcharts.Chart#event:beforePrint
     * @fires Highcharts.Chart#event:afterPrint
     *
     * @requires modules/exporting
     */
    print: function (this: Chart): void {
        var chart = this;

        if (chart.isPrinting) { // block the button while in printing mode
            return;
        }

        H.printingChart = chart;

        if (!H.isSafari) {
            chart.beforePrint();
        }

        // Give the browser time to draw WebGL content, an issue that randomly
        // appears (at least) in Chrome ~67 on the Mac (#8708).
        setTimeout(function (): void {

            win.focus(); // #1510
            win.print();

            // allow the browser to prepare before reverting
            if (!H.isSafari) {
                setTimeout(function (): void {
                    chart.afterPrint();
                }, 1000);
            }
        }, 1);

    },

    /**
     * Display a popup menu for choosing the export type.
     *
     * @private
     * @function Highcharts.Chart#contextMenu
     * @param {string} className
     *        An identifier for the menu.
     * @param {Array<string|Highcharts.ExportingMenuObject>} items
     *        A collection with text and onclicks for the items.
     * @param {number} x
     *        The x position of the opener button
     * @param {number} y
     *        The y position of the opener button
     * @param {number} width
     *        The width of the opener button
     * @param {number} height
     *        The height of the opener button
     * @return {void}
     * @requires modules/exporting
     */
    contextMenu: function (
        this: Chart,
        className: string,
        items: Array<(string|Highcharts.ExportingMenuObject)>,
        x: number,
        y: number,
        width: number,
        height: number,
        button: Highcharts.SVGElement
    ): void {
        var chart = this,
            navOptions: Highcharts.NavigationOptions =
                chart.options.navigation as any,
            chartWidth = chart.chartWidth,
            chartHeight = chart.chartHeight,
            cacheName = 'cache-' + className,
            menu: Highcharts.ExportingDivElement = (chart as any)[cacheName],
            menuPadding = Math.max(width, height), // for mouse leave detection
            innerMenu: Highcharts.HTMLDOMElement,
            menuStyle: Highcharts.CSSObject;

        // create the menu only the first time
        if (!menu) {

            // create a HTML element above the SVG
            chart.exportContextMenu = (chart as any)[cacheName] = menu =
                createElement(
                    'div', {
                        className: className
                    },
                    {
                        position: 'absolute',
                        zIndex: 1000,
                        padding: menuPadding + 'px',
                        pointerEvents: 'auto'
                    },
                    chart.fixedDiv || chart.container
                ) as Highcharts.ExportingDivElement;

            innerMenu = createElement(
                'ul',
                { className: 'highcharts-menu' },
                {
                    listStyle: 'none',
                    margin: 0,
                    padding: 0
                },
                menu
            );

            // Presentational CSS
            if (!chart.styledMode) {
                css(innerMenu, extend<Highcharts.CSSObject>({
                    MozBoxShadow: '3px 3px 10px #888',
                    WebkitBoxShadow: '3px 3px 10px #888',
                    boxShadow: '3px 3px 10px #888'
                }, navOptions.menuStyle as any));
            }

            // hide on mouse out
            menu.hideMenu = function (): void {
                css(menu, { display: 'none' });
                if (button) {
                    button.setState(0);
                }
                chart.openMenu = false;
                css(chart.renderTo, { overflow: 'hidden' }); // #10361
                U.clearTimeout(menu.hideTimer as any);
                fireEvent(chart, 'exportMenuHidden');
            };

            // Hide the menu some time after mouse leave (#1357)
            (chart.exportEvents as any).push(
                addEvent(menu, 'mouseleave', function (): void {
                    menu.hideTimer = win.setTimeout(menu.hideMenu, 500);
                }),
                addEvent(menu, 'mouseenter', function (): void {
                    U.clearTimeout(menu.hideTimer as any);
                }),

                // Hide it on clicking or touching outside the menu (#2258,
                // #2335, #2407)
                addEvent(doc, 'mouseup', function (e: PointerEvent): void {
                    if (!chart.pointer.inClass(e.target as any, className)) {
                        menu.hideMenu();
                    }
                }),

                addEvent(menu, 'click', function (): void {
                    if (chart.openMenu) {
                        menu.hideMenu();
                    }
                })
            );

            // create the items
            items.forEach(function (
                item: (string|Highcharts.ExportingMenuObject)
            ): void {

                if (typeof item === 'string') {
                    item = (chart.options.exporting as any)
                        .menuItemDefinitions[item];
                }

                if (isObject(item, true)) {
                    var element;

                    if ((item as any).separator) {
                        element = createElement(
                            'hr',
                            null as any,
                            null as any,
                            innerMenu
                        );

                    } else {
                        element = createElement('li', {
                            className: 'highcharts-menu-item',
                            onclick: function (e: PointerEvent): void {
                                if (e) { // IE7
                                    e.stopPropagation();
                                }
                                (menu as any).hideMenu();
                                if ((item as any).onclick) {
                                    (item as any).onclick
                                        .apply(chart, arguments);
                                }
                            },
                            innerHTML: (
                                (item as any).text ||
                                (chart.options.lang as any)[
                                    (item as any).textKey as any
                                ]
                            )
                        }, null as any, innerMenu);

                        if (!chart.styledMode) {
                            element.onmouseover = function (
                                this: Highcharts.HTMLDOMElement
                            ): void {
                                css(this, navOptions.menuItemHoverStyle as any);
                            } as any;
                            element.onmouseout = function (
                                this: Highcharts.HTMLDOMElement
                            ): void {
                                css(this, navOptions.menuItemStyle as any);
                            } as any;
                            css(element, extend({
                                cursor: 'pointer'
                            }, navOptions.menuItemStyle as any));
                        }
                    }

                    // Keep references to menu divs to be able to destroy them
                    (chart.exportDivElements as any).push(element);
                }
            });

            // Keep references to menu and innerMenu div to be able to destroy
            // them
            (chart.exportDivElements as any).push(innerMenu, menu);

            chart.exportMenuWidth = menu.offsetWidth;
            chart.exportMenuHeight = menu.offsetHeight;
        }

        menuStyle = { display: 'block' };

        // if outside right, right align it
        if (x + (chart.exportMenuWidth as any) > chartWidth) {
            menuStyle.right = (chartWidth - x - width - menuPadding) + 'px';
        } else {
            menuStyle.left = (x - menuPadding) + 'px';
        }
        // if outside bottom, bottom align it
        if (
            y + height + (chart.exportMenuHeight as any) > chartHeight &&
            button.alignOptions.verticalAlign !== 'top'
        ) {
            menuStyle.bottom = (chartHeight - y - menuPadding) + 'px';
        } else {
            menuStyle.top = (y + height - menuPadding) + 'px';
        }

        css(menu, menuStyle);
        css(chart.renderTo, { overflow: '' }); // #10361
        chart.openMenu = true;
        fireEvent(chart, 'exportMenuShown');
    },

    /**
     * Add the export button to the chart, with options.
     *
     * @private
     * @function Highcharts.Chart#addButton
     * @param {Highcharts.NavigationButtonOptions} options
     * @return {void}
     * @requires modules/exporting
     */
    addButton: function (
        this: Chart,
        options: Highcharts.ExportingButtonOptions
    ): void {
        var chart = this,
            renderer = chart.renderer,
            btnOptions = merge<Highcharts.ExportingButtonOptions>(
                (chart.options.navigation as any).buttonOptions,
                options
            ),
            onclick = btnOptions.onclick,
            menuItems = btnOptions.menuItems,
            symbol,
            button: Highcharts.SVGElement,
            symbolSize = btnOptions.symbolSize || 12;

        if (!chart.btnCount) {
            chart.btnCount = 0;
        }

        // Keeps references to the button elements
        if (!chart.exportDivElements) {
            chart.exportDivElements = [];
            chart.exportSVGElements = [];
        }

        if (btnOptions.enabled === false) {
            return;
        }


        var attr: Highcharts.SVGAttributes = btnOptions.theme as any,
            states = attr.states,
            hover = states && states.hover,
            select = states && states.select,
            callback: (
                Highcharts.EventCallbackFunction<Highcharts.SVGElement>|
                undefined
            );

        if (!chart.styledMode) {
            attr.fill = pick(attr.fill, '${palette.backgroundColor}');
            attr.stroke = pick(attr.stroke, 'none');
        }

        delete attr.states;

        if (onclick) {
            callback = function (
                this: Highcharts.SVGElement,
                e: (Event|Highcharts.Dictionary<any>)
            ): void {
                if (e) {
                    e.stopPropagation();
                }
                (onclick as any).call(chart, e);
            };

        } else if (menuItems) {
            callback = function (
                this: Highcharts.SVGElement,
                e: (Event|Highcharts.Dictionary<any>)
            ): void {
                // consistent with onclick call (#3495)
                if (e) {
                    e.stopPropagation();
                }
                chart.contextMenu(
                    button.menuClassName,
                    menuItems as any,
                    button.translateX,
                    button.translateY,
                    button.width,
                    button.height,
                    button
                );
                button.setState(2);
            };
        }


        if (btnOptions.text && btnOptions.symbol) {
            attr.paddingLeft = pick(attr.paddingLeft, 25);

        } else if (!btnOptions.text) {
            extend(attr, {
                width: btnOptions.width,
                height: btnOptions.height,
                padding: 0
            });
        }


        if (!chart.styledMode) {
            attr['stroke-linecap'] = 'round';
            attr.fill = pick(attr.fill, '${palette.backgroundColor}');
            attr.stroke = pick(attr.stroke, 'none');
        }

        button = renderer
            .button(
                btnOptions.text as any,
                0,
                0,
                callback as any,
                attr,
                hover,
                select
            )
            .addClass(options.className as any)
            .attr({
                title: pick((chart.options.lang as any)[
                    btnOptions._titleKey || (btnOptions.titleKey as any)
                ], '')
            });

        button.menuClassName = (
            options.menuClassName ||
            'highcharts-menu-' + chart.btnCount++
        );

        if (btnOptions.symbol) {
            symbol = renderer
                .symbol(
                    btnOptions.symbol,
                    (btnOptions.symbolX as any) - (symbolSize / 2),
                    (btnOptions.symbolY as any) - (symbolSize / 2),
                    symbolSize,
                    symbolSize
                    // If symbol is an image, scale it (#7957)
                    , {
                        width: symbolSize,
                        height: symbolSize
                    }
                )
                .addClass('highcharts-button-symbol')
                .attr({
                    zIndex: 1
                })
                .add(button);

            if (!chart.styledMode) {
                symbol.attr({
                    stroke: btnOptions.symbolStroke,
                    fill: btnOptions.symbolFill,
                    'stroke-width': btnOptions.symbolStrokeWidth || 1
                });
            }
        }

        button
            .add(chart.exportingGroup)
            .align(extend(btnOptions, {
                width: button.width,
                x: pick(btnOptions.x, chart.buttonOffset) // #1654
            }), true, 'spacingBox');

        (chart.buttonOffset as any) += (
            (button.width + btnOptions.buttonSpacing) *
            (btnOptions.align === 'right' ? -1 : 1)
        );

        (chart.exportSVGElements as any).push(button, symbol as any);

    },

    /**
     * Destroy the export buttons.
     * @private
     * @function Highcharts.Chart#destroyExport
     * @param {global.Event} [e]
     * @return {void}
     * @requires modules/exporting
     */
    destroyExport: function (
        this: Chart,
        e?: Event
    ): void {
        var chart: Chart = e ? (e.target as any) : this,
            exportSVGElements = chart.exportSVGElements,
            exportDivElements = chart.exportDivElements,
            exportEvents = chart.exportEvents,
            cacheName;

        // Destroy the extra buttons added
        if (exportSVGElements) {
            exportSVGElements.forEach(function (
                elem: Highcharts.SVGElement,
                i: number
            ): void {

                // Destroy and null the svg elements
                if (elem) { // #1822
                    elem.onclick = elem.ontouchstart = null;
                    cacheName = 'cache-' + elem.menuClassName;

                    if ((chart as any)[cacheName]) {
                        delete (chart as any)[cacheName];
                    }

                    (chart.exportSVGElements as any)[i] = elem.destroy();
                }
            });
            exportSVGElements.length = 0;
        }

        // Destroy the exporting group
        if (chart.exportingGroup) {
            chart.exportingGroup.destroy();
            delete chart.exportingGroup;
        }

        // Destroy the divs for the menu
        if (exportDivElements) {
            exportDivElements.forEach(function (
                elem: Highcharts.ExportingDivElement,
                i: number
            ): void {

                // Remove the event handler
                U.clearTimeout(elem.hideTimer as any); // #5427
                removeEvent(elem, 'mouseleave');

                // Remove inline events
                (chart.exportDivElements as any)[i] =
                    elem.onmouseout =
                    elem.onmouseover =
                    elem.ontouchstart =
                    elem.onclick = null;

                // Destroy the div by moving to garbage bin
                discardElement(elem);
            });
            exportDivElements.length = 0;
        }

        if (exportEvents) {
            exportEvents.forEach(function (unbind: Function): void {
                unbind();
            });
            exportEvents.length = 0;
        }
    }

    /* eslint-enable no-invalid-this, valid-jsdoc */

});

// These ones are translated to attributes rather than styles
SVGRenderer.prototype.inlineToAttributes = [
    'fill',
    'stroke',
    'strokeLinecap',
    'strokeLinejoin',
    'strokeWidth',
    'textAnchor',
    'x',
    'y'
];

// These CSS properties are not inlined. Remember camelCase.
SVGRenderer.prototype.inlineBlacklist = [
    /-/, // In Firefox, both hyphened and camelCased names are listed
    /^(clipPath|cssText|d|height|width)$/, // Full words
    /^font$/, // more specific props are set
    /[lL]ogical(Width|Height)$/,
    /perspective/,
    /TapHighlightColor/,
    /^transition/,
    /^length$/ // #7700
    // /^text (border|color|cursor|height|webkitBorder)/
];

SVGRenderer.prototype.unstyledElements = [
    'clipPath',
    'defs',
    'desc'
];

/**
 * Analyze inherited styles from stylesheets and add them inline
 *
 * @private
 * @function Highcharts.Chart#inlineStyles
 * @return {void}
 *
 * @todo: What are the border styles for text about? In general, text has a lot
 * of properties.
 * @todo: Make it work with IE9 and IE10.
 *
 * @requires modules/exporting
 */
Chart.prototype.inlineStyles = function (): void {
    var renderer = this.renderer,
        inlineToAttributes = renderer.inlineToAttributes,
        blacklist = renderer.inlineBlacklist,
        whitelist = renderer.inlineWhitelist, // For IE
        unstyledElements = renderer.unstyledElements,
        defaultStyles: Highcharts.Dictionary<Highcharts.CSSObject> = {},
        dummySVG: Element,
        iframe: HTMLIFrameElement,
        iframeDoc: Document;

    // Create an iframe where we read default styles without pollution from this
    // body
    iframe = doc.createElement('iframe');
    css(iframe, {
        width: '1px',
        height: '1px',
        visibility: 'hidden'
    });
    doc.body.appendChild(iframe);
    iframeDoc = (iframe.contentWindow as any).document;
    iframeDoc.open();
    iframeDoc.write('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    iframeDoc.close();


    /**
     * Make hyphenated property names out of camelCase
     * @private
     * @param {string} prop
     *        Property name in camelCase
     * @return {string}
     *         Hyphenated property name
     */
    function hyphenate(prop: string): string {
        return prop.replace(
            /([A-Z])/g,
            function (a: string, b: string): string {
                return '-' + b.toLowerCase();
            }
        );
    }

    /**
     * Call this on all elements and recurse to children
     * @private
     * @param {Highcharts.HTMLDOMElement} node
     *        Element child
     * @return {void}
     */
    function recurse(node: Highcharts.HTMLDOMElement): void {
        var styles: Highcharts.CSSObject,
            parentStyles: (Highcharts.CSSObject|Highcharts.SVGAttributes),
            cssText = '',
            dummy: Element,
            styleAttr,
            blacklisted: (boolean|undefined),
            whitelisted: (boolean|undefined),
            i: number;

        /**
         * Check computed styles and whether they are in the white/blacklist for
         * styles or atttributes.
         * @private
         * @param {string} val
         *        Style value
         * @param {string} prop
         *        Style property name
         * @return {void}
         */
        function filterStyles(val: (string|number|boolean|undefined), prop: string): void {

            // Check against whitelist & blacklist
            blacklisted = whitelisted = false;
            if (whitelist) {
                // Styled mode in IE has a whitelist instead.
                // Exclude all props not in this list.
                i = whitelist.length;
                while (i-- && !whitelisted) {
                    whitelisted = whitelist[i].test(prop);
                }
                blacklisted = !whitelisted;
            }

            // Explicitly remove empty transforms
            if (prop === 'transform' && val === 'none') {
                blacklisted = true;
            }

            i = (blacklist as any).length;
            while (i-- && !blacklisted) {
                blacklisted = (
                    (blacklist as any)[i].test(prop) ||
                    typeof val === 'function'
                );
            }

            if (!blacklisted) {
                // If parent node has the same style, it gets inherited, no need
                // to inline it. Top-level props should be diffed against parent
                // (#7687).
                if (
                    (parentStyles[prop] !== val || node.nodeName === 'svg') &&
                    defaultStyles[node.nodeName][prop] !== val
                ) {
                    // Attributes
                    if (
                        !inlineToAttributes ||
                        inlineToAttributes.indexOf(prop) !== -1
                    ) {
                        if (val) {
                            node.setAttribute(hyphenate(prop), val);
                        }
                    // Styles
                    } else {
                        cssText += hyphenate(prop) + ':' + val + ';';
                    }
                }
            }
        }

        if (
            node.nodeType === 1 &&
            (unstyledElements as any).indexOf(node.nodeName) === -1
        ) {
            styles = win.getComputedStyle(node, null) as any;
            parentStyles = node.nodeName === 'svg' ?
                {} :
                win.getComputedStyle(node.parentNode as any, null) as any;

            // Get default styles from the browser so that we don't have to add
            // these
            if (!defaultStyles[node.nodeName]) {
                /*
                if (!dummySVG) {
                    dummySVG = doc.createElementNS(H.SVG_NS, 'svg');
                    dummySVG.setAttribute('version', '1.1');
                    doc.body.appendChild(dummySVG);
                }
                */
                dummySVG = iframeDoc.getElementsByTagName('svg')[0];
                dummy = iframeDoc.createElementNS(
                    node.namespaceURI,
                    node.nodeName
                );
                dummySVG.appendChild(dummy);
                // Copy, so we can remove the node
                defaultStyles[node.nodeName] = merge(
                    win.getComputedStyle(dummy, null) as any
                );
                // Remove default fill, otherwise text disappears when exported
                if (node.nodeName === 'text') {
                    delete defaultStyles.text.fill;
                }
                dummySVG.removeChild(dummy);
            }

            // Loop through all styles and add them inline if they are ok
            if (isFirefoxBrowser || isMSBrowser) {
                // Some browsers put lots of styles on the prototype
                for (var p in styles) { // eslint-disable-line guard-for-in
                    filterStyles(styles[p] as any, p);
                }
            } else {
                objectEach(styles, filterStyles);
            }

            // Apply styles
            if (cssText) {
                styleAttr = node.getAttribute('style');
                node.setAttribute(
                    'style',
                    (styleAttr ? styleAttr + ';' : '') + cssText
                );
            }

            // Set default stroke width (needed at least for IE)
            if (node.nodeName === 'svg') {
                node.setAttribute('stroke-width', '1px');
            }

            if (node.nodeName === 'text') {
                return;
            }

            // Recurse
            [].forEach.call(node.children || node.childNodes, recurse);
        }
    }

    /**
     * Remove the dummy objects used to get defaults
     * @private
     * @return {void}
     */
    function tearDown(): void {
        (dummySVG.parentNode as any).removeChild(dummySVG);
    }

    recurse(this.container.querySelector('svg') as any);
    tearDown();

};


symbols.menu = function (
    x: number,
    y: number,
    width: number,
    height: number
): SVGPath {
    var arr: SVGPath = [
        ['M', x, y + 2.5],
        ['L', x + width, y + 2.5],
        ['M', x, y + height / 2 + 0.5],
        ['L', x + width, y + height / 2 + 0.5],
        ['M', x, y + height - 1.5],
        ['L', x + width, y + height - 1.5]
    ];

    return arr;
};

symbols.menuball = function (
    x: number,
    y: number,
    width: number,
    height: number
): SVGPath {
    var path: SVGPath = [],
        h = (height / 3) - 2;

    path = path.concat(
        this.circle(width - h, y, h, h),
        this.circle(width - h, y + h + 4, h, h),
        this.circle(width - h, y + 2 * (h + 4), h, h)
    );
    return path;
};

/**
 * Add the buttons on chart load
 * @private
 * @function Highcharts.Chart#renderExporting
 * @return {void}
 * @requires modules/exporting
 */
Chart.prototype.renderExporting = function (): void {
    var chart = this,
        exportingOptions: Highcharts.ExportingOptions =
            chart.options.exporting as any,
        buttons = exportingOptions.buttons,
        isDirty = chart.isDirtyExporting || !chart.exportSVGElements;

    chart.buttonOffset = 0;
    if (chart.isDirtyExporting) {
        chart.destroyExport();
    }

    if (isDirty && (exportingOptions as any).enabled !== false) {
        chart.exportEvents = [];

        chart.exportingGroup = chart.exportingGroup ||
            chart.renderer.g('exporting-group').attr({
                zIndex: 3 // #4955, // #8392
            }).add();

        objectEach(buttons, function (
            button: Highcharts.ExportingButtonOptions
        ): void {
            chart.addButton(button);
        });

        chart.isDirtyExporting = false;
    }

    // Destroy the export elements at chart destroy
    addEvent(chart, 'destroy', chart.destroyExport);
};

/* eslint-disable no-invalid-this */

// Add update methods to handle chart.update and chart.exporting.update and
// chart.navigation.update. These must be added to the chart instance rather
// than the Chart prototype in order to use the chart instance inside the update
// function.
addEvent(Chart, 'init', function (): void {
    var chart = this;

    /**
     * @private
     * @param {"exporting"|"navigation"} prop
     *        Property name in option root
     * @param {Highcharts.ExportingOptions|Highcharts.NavigationOptions} options
     *        Options to update
     * @param {boolean} [redraw=true]
     *        Whether to redraw
     * @return {void}
     */
    function update(
        prop: 'exporting'|'navigation',
        options: (Highcharts.ExportingOptions|Highcharts.NavigationOptions),
        redraw?: boolean
    ): void {
        chart.isDirtyExporting = true;
        merge(true, (chart.options as any)[prop], options);
        if (pick(redraw, true)) {
            chart.redraw();
        }
    }

    chart.exporting = {
        update: function (
            options: Highcharts.ExportingOptions,
            redraw?: boolean
        ): void {
            update('exporting', options, redraw);
        }
    };

    // Register update() method for navigation. Can not be set the same way as
    // for exporting, because navigation options are shared with bindings which
    // has separate update() logic.
    chartNavigationMixin.addUpdate(
        function (
            options: Highcharts.NavigationOptions,
            redraw?: boolean
        ): void {
            update('navigation', options, redraw);
        },
        chart
    );
});

/* eslint-enable no-invalid-this */

Chart.prototype.callbacks.push(function (chart: Chart): void {

    chart.renderExporting();

    addEvent(chart, 'redraw', chart.renderExporting);


    // Uncomment this to see a button directly below the chart, for quick
    // testing of export
    /*
    var button, viewImage, viewSource;
    if (!chart.renderer.forExport) {
        viewImage = function () {
            var div = doc.createElement('div');
            div.innerHTML = chart.getSVGForExport();
            chart.renderTo.parentNode.appendChild(div);
        };

        viewSource = function () {
            var pre = doc.createElement('pre');
            pre.innerHTML = chart.getSVGForExport()
                .replace(/</g, '\n&lt;')
                .replace(/>/g, '&gt;');
            chart.renderTo.parentNode.appendChild(pre);
        };

        viewImage();

        // View SVG Image
        button = doc.createElement('button');
        button.innerHTML = 'View SVG Image';
        chart.renderTo.parentNode.appendChild(button);
        button.onclick = viewImage;

        // View SVG Source
        button = doc.createElement('button');
        button.innerHTML = 'View SVG Source';
        chart.renderTo.parentNode.appendChild(button);
        button.onclick = viewSource;
    }
    //*/
});
