/**
 * Exporting module
 *
 * (c) 2010-2018 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/* eslint indent:0 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Chart.js';

// create shortcuts
var defaultOptions = H.defaultOptions,
    doc = H.doc,
    Chart = H.Chart,
    addEvent = H.addEvent,
    removeEvent = H.removeEvent,
    fireEvent = H.fireEvent,
    createElement = H.createElement,
    discardElement = H.discardElement,
    css = H.css,
    merge = H.merge,
    pick = H.pick,
    each = H.each,
    objectEach = H.objectEach,
    extend = H.extend,
    isTouchDevice = H.isTouchDevice,
    win = H.win,
    userAgent = win.navigator.userAgent,
    SVGRenderer = H.SVGRenderer,
    symbols = H.Renderer.prototype.symbols,
    isMSBrowser = /Edge\/|Trident\/|MSIE /.test(userAgent),
    isFirefoxBrowser = /firefox/i.test(userAgent);

// Add language
extend(defaultOptions.lang, {
    /**
     * Exporting module only. The text for the menu item to print the chart.
     *
     * @type {String}
     * @default Print chart
     * @since 3.0.1
     * @apioption lang.printChart
     */
    printChart: 'Print chart',
    /**
     * Exporting module only. The text for the PNG download menu item.
     *
     * @type {String}
     * @default Download PNG image
     * @since 2.0
     * @apioption lang.downloadPNG
     */
    downloadPNG: 'Download PNG image',
    /**
     * Exporting module only. The text for the JPEG download menu item.
     *
     * @type {String}
     * @default Download JPEG image
     * @since 2.0
     * @apioption lang.downloadJPEG
     */
    downloadJPEG: 'Download JPEG image',
    /**
     * Exporting module only. The text for the PDF download menu item.
     *
     * @type {String}
     * @default Download PDF document
     * @since 2.0
     * @apioption lang.downloadPDF
     */
    downloadPDF: 'Download PDF document',
    /**
     * Exporting module only. The text for the SVG download menu item.
     *
     * @type {String}
     * @default Download SVG vector image
     * @since 2.0
     * @apioption lang.downloadSVG
     */
    downloadSVG: 'Download SVG vector image',
    /**
     * Exporting module menu. The tooltip title for the context menu holding
     * print and export menu items.
     *
     * @type {String}
     * @default Chart context menu
     * @since 3.0
     * @apioption lang.contextButtonTitle
     */
    contextButtonTitle: 'Chart context menu'
});

// Buttons and menus are collected in a separate config option set called
// 'navigation'. This can be extended later to add control buttons like zoom and
// pan right click menus.
defaultOptions.navigation = {
    buttonOptions: {
        theme: {},

        /**
         * Whether to enable buttons.
         *
         * @type {Boolean}
         * @sample highcharts/navigation/buttonoptions-enabled/
         *         Exporting module loaded but buttons disabled
         * @default true
         * @since 2.0
         * @apioption navigation.buttonOptions.enabled
         */

        /**
         * The pixel size of the symbol on the button.
         *
         * @type {Number}
         * @sample highcharts/navigation/buttonoptions-height/
         *         Bigger buttons
         * @default 14
         * @since 2.0
         * @apioption navigation.buttonOptions.symbolSize
         */
        symbolSize: 14,

        /**
         * The x position of the center of the symbol inside the button.
         *
         * @type {Number}
         * @sample highcharts/navigation/buttonoptions-height/
         *         Bigger buttons
         * @default 12.5
         * @since 2.0
         * @apioption navigation.buttonOptions.symbolX
         */
        symbolX: 12.5,

        /**
         * The y position of the center of the symbol inside the button.
         *
         * @type {Number}
         * @sample highcharts/navigation/buttonoptions-height/
         *         Bigger buttons
         * @default 10.5
         * @since 2.0
         * @apioption navigation.buttonOptions.symbolY
         */
        symbolY: 10.5,

        /**
         * Alignment for the buttons.
         *
         * @validvalue ["left", "center", "right"]
         * @type {String}
         * @sample highcharts/navigation/buttonoptions-align/
         *         Center aligned
         * @default right
         * @since 2.0
         * @apioption navigation.buttonOptions.align
         */
        align: 'right',

        /**
         * The pixel spacing between buttons.
         *
         * @type {Number}
         * @default 3
         * @since 2.0
         * @apioption navigation.buttonOptions.buttonSpacing
         */
        buttonSpacing: 3,

        /**
         * Pixel height of the buttons.
         *
         * @type {Number}
         * @sample highcharts/navigation/buttonoptions-height/
         *         Bigger buttons
         * @default 22
         * @since 2.0
         * @apioption navigation.buttonOptions.height
         */
        height: 22,

        /**
         * A text string to add to the individual button.
         *
         * @type {String}
         * @sample highcharts/exporting/buttons-text/
         *         Full text button
         * @sample highcharts/exporting/buttons-text-symbol/
         *         Combined symbol and text
         * @default null
         * @since 3.0
         * @apioption navigation.buttonOptions.text
         */

        /**
         * The vertical offset of the button's position relative to its
         * `verticalAlign`.
         *
         * @type {Number}
         * @sample highcharts/navigation/buttonoptions-verticalalign/
         *         Buttons at lower right
         * @default 0
         * @since 2.0
         * @apioption navigation.buttonOptions.y
         */

        /**
         * The vertical alignment of the buttons. Can be one of "top", "middle"
         * or "bottom".
         *
         * @validvalue ["top", "middle", "bottom"]
         * @type {String}
         * @sample highcharts/navigation/buttonoptions-verticalalign/
         *         Buttons at lower right
         * @default top
         * @since 2.0
         * @apioption navigation.buttonOptions.verticalAlign
         */
        verticalAlign: 'top',

        /**
         * The pixel width of the button.
         *
         * @type {Number}
         * @sample highcharts/navigation/buttonoptions-height/
         *         Bigger buttons
         * @default 24
         * @since 2.0
         * @apioption navigation.buttonOptions.width
         */
        width: 24
    }
};

/*= if (build.classic) { =*/
// Presentational attributes

merge(true, defaultOptions.navigation,
/**
 * A collection of options for buttons and menus appearing in the exporting
 * module.
 * @type {Object}
 * @optionparent navigation
 */
{

    /**
     * CSS styles for the popup menu appearing by default when the export
     * icon is clicked. This menu is rendered in HTML.
     *
     * @type {CSSObject}
     * @see In styled mode, the menu is styled with the `.highcharts-menu`
     * class.
     * @sample highcharts/navigation/menustyle/ Light gray menu background
     * @default { "border": "1px solid #999999", "background": "#ffffff", "padding": "5px 0" }
     * @since 2.0
     */
    menuStyle: {
        border: '1px solid ${palette.neutralColor40}',
        background: '${palette.backgroundColor}',
        padding: '5px 0'
    },

    /**
     * CSS styles for the individual items within the popup menu appearing
     * by default when the export icon is clicked. The menu items are rendered
     * in HTML.
     *
     * @type {CSSObject}
     * @see     In styled mode, the menu items are styled with the
     *          `.highcharts-menu-item` class.
     * @sample  {highcharts} highcharts/navigation/menuitemstyle/
     *          Add a grey stripe to the left
     * @default { "padding": "0.5em 1em", "color": "#333333", "background": "none" }
     * @since 2.0
     */
    menuItemStyle: {
        padding: '0.5em 1em',
        background: 'none',
        color: '${palette.neutralColor80}',
        /**
         * Defaults to `14px` on touch devices and `11px` on desktop.
         * @type {String}
         */
        fontSize: isTouchDevice ? '14px' : '11px',
        transition: 'background 250ms, color 250ms'
    },

    /**
     * CSS styles for the hover state of the individual items within the
     * popup menu appearing by default when the export icon is clicked.
     *  The menu items are rendered in HTML.
     *
     * @type {CSSObject}
     * @see    In styled mode, the menu items are styled with the
     *         `.highcharts-menu-item` class.
     * @sample highcharts/navigation/menuitemhoverstyle/ Bold text on hover
     * @default { "background": "#335cad", "color": "#ffffff" }
     * @since 2.0
     */
    menuItemHoverStyle: {
        background: '${palette.highlightColor80}',
        color: '${palette.backgroundColor}'
    },

    /**
     * A collection of options for buttons appearing in the exporting module.
     *
     *
     * In styled mode, the buttons are styled with the
     * `.highcharts-contextbutton` and `.highcharts-button-symbol` classes.
     *
     */
    buttonOptions: {

        /**
         * Fill color for the symbol within the button.
         *
         * @type {Color}
         * @sample highcharts/navigation/buttonoptions-symbolfill/
         *         Blue symbol stroke for one of the buttons
         * @default #666666
         * @since 2.0
         */
        symbolFill: '${palette.neutralColor60}',

        /**
         * The color of the symbol's stroke or line.
         *
         * @type {Color}
         * @sample highcharts/navigation/buttonoptions-symbolstroke/
         *         Blue symbol stroke
         * @default #666666
         * @since 2.0
         */
        symbolStroke: '${palette.neutralColor60}',

        /**
         * The pixel stroke width of the symbol on the button.
         *
         * @type {Number}
         * @sample highcharts/navigation/buttonoptions-height/
         *         Bigger buttons
         * @default 1
         * @since 2.0
         */
        symbolStrokeWidth: 3,

        /**
         * A configuration object for the button theme. The object accepts
         * SVG properties like `stroke-width`, `stroke` and `fill`. Tri-state
         * button styles are supported by the `states.hover` and `states.select`
         * objects.
         *
         * @type {Object}
         * @sample highcharts/navigation/buttonoptions-theme/
         *         Theming the buttons
         * @since 3.0
         */
        theme: {
            /**
             * The default fill exists only to capture hover events.
             * @type {String}
             */
            fill: '${palette.backgroundColor}',
            /**
             * @type {String}
             */
            stroke: 'none',
            /**
             * @type {Number}
             * @default 5
             */
            padding: 5
        }
    }
});
/*= } =*/


// Add the export related options

/**
 * Options for the exporting module. For an overview on the matter, see
 * [the docs](https://www.highcharts.com/docs/export-module/export-module-overview).
 * @type {Object}
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
     * @type {Boolean}
     * @default false
     * @since 4.1.8
     * @apioption exporting.allowHTML
     */

    /**
     * Additional chart options to be merged into an exported chart. For
     * example, a common use case is to add data labels to improve readability
     * of the exported chart, or to add a printer-friendly color scheme.
     *
     * @type {Object}
     * @sample {highcharts} highcharts/exporting/chartoptions-data-labels/
     *         Added data labels
     * @sample {highstock} highcharts/exporting/chartoptions-data-labels/
     *         Added data labels
     * @default null
     * @apioption exporting.chartOptions
     */

    /**
     * Whether to enable the exporting module. Disabling the module will
     * hide the context button, but API methods will still be available.
     *
     * @type {Boolean}
     * @sample {highcharts} highcharts/exporting/enabled-false/
     *         Exporting module is loaded but disabled
     * @sample {highstock} highcharts/exporting/enabled-false/
     *         Exporting module is loaded but disabled
     * @default true
     * @since 2.0
     * @apioption exporting.enabled
     */

    /**
     * Function to call if the offline-exporting module fails to export
     * a chart on the client side, and [fallbackToExportServer](
     * #exporting.fallbackToExportServer) is disabled. If left undefined, an
     * exception is thrown instead. Receives two parameters, the exporting
     * options, and the error from the module.
     *
     * @type {Function}
     * @see [fallbackToExportServer](#exporting.fallbackToExportServer)
     * @default undefined
     * @since 5.0.0
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
     * @type {Boolean}
     * @default true
     * @since 4.1.8
     * @apioption exporting.fallbackToExportServer
     */

    /**
     * The filename, without extension, to use for the exported chart.
     *
     * @type {String}
     * @sample {highcharts} highcharts/exporting/filename/ Custom file name
     * @sample {highstock} highcharts/exporting/filename/ Custom file name
     * @default chart
     * @since 2.0
     * @apioption exporting.filename
     */

    /**
     * An object containing additional attributes for the POST form that
     * sends the SVG to the export server. For example, a `target` can be
     * set to make sure the generated image is received in another frame,
     *  or a custom `enctype` or `encoding` can be set.
     *
     * @type {Object}
     * @since 3.0.8
     * @apioption exporting.formAttributes
     */

    /**
     * Path where Highcharts will look for export module dependencies to
     * load on demand if they don't already exist on `window`. Should currently
     * point to location of [CanVG](https://github.com/canvg/canvg) library,
     * [RGBColor.js](https://github.com/canvg/canvg), [jsPDF](https://github.
     * com/yWorks/jsPDF) and [svg2pdf.js](https://github.com/yWorks/svg2pdf.
     * js), required for client side export in certain browsers.
     *
     * @type {String}
     * @default https://code.highcharts.com/{version}/lib
     * @since 5.0.0
     * @apioption exporting.libURL
     */

    /**
     * Analogous to [sourceWidth](#exporting.sourceWidth).
     *
     * @type {Number}
     * @since 3.0
     * @apioption exporting.sourceHeight
     */

    /**
     * The width of the original chart when exported, unless an explicit
     * [chart.width](#chart.width) is set. The width exported raster image
     * is then multiplied by [scale](#exporting.scale).
     *
     * @type {Number}
     * @sample {highcharts} highcharts/exporting/sourcewidth/ Source size demo
     * @sample {highstock} highcharts/exporting/sourcewidth/ Source size demo
     * @sample {highmaps} maps/exporting/sourcewidth/ Source size demo
     * @since 3.0
     * @apioption exporting.sourceWidth
     */

    /**
     * The pixel width of charts exported to PNG or JPG. As of Highcharts
     * 3.0, the default pixel width is a function of the [chart.width](
     * #chart.width) or [exporting.sourceWidth](#exporting.sourceWidth) and the
     * [exporting.scale](#exporting.scale).
     *
     * @type {Number}
     * @sample {highcharts} highcharts/exporting/width/
     *         Export to 200px wide images
     * @sample {highstock} highcharts/exporting/width/
     *         Export to 200px wide images
     * @default undefined
     * @since 2.0
     * @apioption exporting.width
     */

    /**
     * Default MIME type for exporting if `chart.exportChart()` is called
     * without specifying a `type` option. Possible values are `image/png`,
     *  `image/jpeg`, `application/pdf` and `image/svg+xml`.
     *
     * @validvalue ["image/png", "image/jpeg", "application/pdf", "image/svg+xml"]
     * @since 2.0
     */
    type: 'image/png',

    /**
     * The URL for the server module converting the SVG string to an image
     * format. By default this points to Highchart's free web service.
     *
     * @type {String}
     * @default https://export.highcharts.com
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
     * @type {Number}
     * @default 780
     * @since 4.2.5
     */
    printMaxWidth: 780,

    /**
     * Defines the scale or zoom factor for the exported image compared
     * to the on-screen display. While for instance a 600px wide chart
     * may look good on a website, it will look bad in print. The default
     * scale of 2 makes this chart export to a 1200px PNG or JPG.
     *
     * @see    [chart.width](#chart.width),
     *         [exporting.sourceWidth](#exporting.sourceWidth)
     * @sample {highcharts} highcharts/exporting/scale/ Scale demonstrated
     * @sample {highstock} highcharts/exporting/scale/ Scale demonstrated
     * @sample {highmaps} maps/exporting/scale/ Scale demonstrated
     * @since 3.0
     */
    scale: 2,

    /**
     * Options for the export related buttons, print and export. In addition
     * to the default buttons listed here, custom buttons can be added.
     * See [navigation.buttonOptions](#navigation.buttonOptions) for general
     * options.
     *
     */
    buttons: {

        /**
         * Options for the export button.
         *
         * In styled mode, export button styles can be applied with the
         * `.highcharts-contextbutton` class.
         *
         * @extends navigation.buttonOptions
         */
        contextButton: {

            /**
             * A click handler callback to use on the button directly instead of
             * the popup menu.
             *
             * @type {Function}
             * @sample highcharts/exporting/buttons-contextbutton-onclick/
             *         Skip the menu and export the chart directly
             * @since 2.0
             * @apioption exporting.buttons.contextButton.onclick
             */

            /**
             * See [navigation.buttonOptions.symbolFill](
             * #navigation.buttonOptions.symbolFill).
             *
             * @type {Color}
             * @default #666666
             * @since 2.0
             * @apioption exporting.buttons.contextButton.symbolFill
             */

            /**
             * The horizontal position of the button relative to the `align`
             * option.
             *
             * @type {Number}
             * @default -10
             * @since 2.0
             * @apioption exporting.buttons.contextButton.x
             */

            /**
             * The class name of the context button.
             * @type {String}
             */
            className: 'highcharts-contextbutton',

            /**
             * The class name of the menu appearing from the button.
             * @type {String}
             */
            menuClassName: 'highcharts-contextmenu',

            /**
             * The symbol for the button. Points to a definition function in
             * the `Highcharts.Renderer.symbols` collection. The default
             * `exportIcon` function is part of the exporting module.
             *
             * @validvalue ["exportIcon", "circle", "square", "diamond", "triangle", "triangle-down", "menu"]
             * @type {String}
             * @sample highcharts/exporting/buttons-contextbutton-symbol/
             *         Use a circle for symbol
             * @sample highcharts/exporting/buttons-contextbutton-symbol-custom/
             *         Custom shape as symbol
             * @default menu
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
             * By default, there is the "Print" menu item plus one menu item
             * for each of the available export types.
             *
             * Defaults to
             * <pre>
             * [
             *    'printChart',
             *    'separator',
             *    'downloadPNG',
             *    'downloadJPEG',
             *    'downloadPDF',
             *    'downloadSVG'
             * ]
             * </pre>
             *
             * @type {Array<String>|Array<Object>}
              * @sample {highcharts} highcharts/exporting/menuitemdefinitions/
              *         Menu item definitions
              * @sample {highstock} highcharts/exporting/menuitemdefinitions/
              *         Menu item definitions
              * @sample {highmaps} highcharts/exporting/menuitemdefinitions/
              *         Menu item definitions
             * @since 2.0
             */
            menuItems: [
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
     * <dl>
     *
     * <dt>onclick</dt>
     *
     * <dd>The click handler for the menu item</dd>
     *
     * <dt>text</dt>
     *
     * <dd>The text for the menu item</dd>
     *
     * <dt>textKey</dt>
     *
     * <dd>If internationalization is required, the key to a language string
     * </dd>
     *
     * </dl>
     *
     * @type {Object}
     * @sample {highcharts} highcharts/exporting/menuitemdefinitions/
     *         Menu item definitions
     * @sample {highstock} highcharts/exporting/menuitemdefinitions/
     *         Menu item definitions
     * @sample {highmaps} highcharts/exporting/menuitemdefinitions/
     *         Menu item definitions
     * @since 5.0.13
     */
    menuItemDefinitions: {

        /**
         * @ignore
         */
        printChart: {
            textKey: 'printChart',
            onclick: function () {
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
            onclick: function () {
                this.exportChart();
            }
        },

        /**
         * @ignore
         */
        downloadJPEG: {
            textKey: 'downloadJPEG',
            onclick: function () {
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
            onclick: function () {
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
            onclick: function () {
                this.exportChart({
                    type: 'image/svg+xml'
                });
            }
        }
    }
};

/**
 * Fires after a chart is printed through the context menu item or the
 * `Chart.print` method. Requires the exporting module.
 *
 * @type {Function}
 * @context Chart
 * @sample highcharts/chart/events-beforeprint-afterprint/
 *         Rescale the chart to print
 * @since 4.1.0
 * @apioption chart.events.afterPrint
 */

/**
 * Fires before a chart is printed through the context menu item or
 * the `Chart.print` method. Requires the exporting module.
 *
 * @type {Function}
 * @context Chart
 * @sample highcharts/chart/events-beforeprint-afterprint/
 *         Rescale the chart to print
 * @since 4.1.0
 * @apioption chart.events.beforePrint
 */


// Add the H.post utility
H.post = function (url, data, formAttributes) {
    // create the form
    var form = createElement('form', merge({
        method: 'post',
        action: url,
        enctype: 'multipart/form-data'
    }, formAttributes), {
        display: 'none'
    }, doc.body);

    // add the data
    objectEach(data, function (val, name) {
        createElement('input', {
            type: 'hidden',
            name: name,
            value: val
        }, null, form);
    });

    // submit
    form.submit();

    // clean up
    discardElement(form);
};

extend(Chart.prototype, /** @lends Highcharts.Chart.prototype */ {

    /**
     * Exporting module only. A collection of fixes on the produced SVG to
     * account for expando properties, browser bugs, VML problems and other.
     * Returns a cleaned SVG.
     *
     * @private
     */
    sanitizeSVG: function (svg, options) {
        // Move HTML into a foreignObject
        if (options && options.exporting && options.exporting.allowHTML) {
            var html = svg.match(/<\/svg>(.*?$)/);
            if (html && html[1]) {
                html = '<foreignObject x="0" y="0" ' +
                            'width="' + options.chart.width + '" ' +
                            'height="' + options.chart.height + '">' +
                    '<body xmlns="http://www.w3.org/1999/xhtml">' +
                    html[1] +
                    '</body>' +
                    '</foreignObject>';
                svg = svg.replace('</svg>', html + '</svg>');
            }
        }

        svg = svg
            .replace(/zIndex="[^"]+"/g, '')
            .replace(/symbolName="[^"]+"/g, '')
            .replace(/jQuery[0-9]+="[^"]+"/g, '')
            .replace(/url\(("|&quot;)(\S+)("|&quot;)\)/g, 'url($2)')
            .replace(/url\([^#]+#/g, 'url(#')
            .replace(
                /<svg /,
                '<svg xmlns:xlink="http://www.w3.org/1999/xlink" '
            )
            .replace(/ (|NS[0-9]+\:)href=/g, ' xlink:href=') // #3567
            .replace(/\n/, ' ')
            // Any HTML added to the container after the SVG (#894)
            .replace(/<\/svg>.*?$/, '</svg>')
            // Batik doesn't support rgba fills and strokes (#3095)
            .replace(
                /(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, // eslint-disable-line max-len
                '$1="rgb($2)" $1-opacity="$3"'
            )

            // Replace HTML entities, issue #347
            .replace(/&nbsp;/g, '\u00A0') // no-break space
            .replace(/&shy;/g, '\u00AD'); // soft hyphen

        /*= if (build.classic) { =*/
        // Further sanitize for oldIE
        if (this.ieSanitizeSVG) {
            svg = this.ieSanitizeSVG(svg);
        }
        /*= } =*/

        return svg;
    },

    /**
     * Return the unfiltered innerHTML of the chart container. Used as hook for
     * plugins. In styled mode, it also takes care of inlining CSS style rules.
     *
     * @see  Chart#getSVG
     *
     * @returns {String}
     *          The unfiltered SVG of the chart.
     */
    getChartHTML: function () {
        /*= if (!build.classic) { =*/
        this.inlineStyles();
        /*= } =*/
        return this.container.innerHTML;
    },

    /**
     * Return an SVG representation of the chart.
     *
     * @param  chartOptions {Options}
     *         Additional chart options for the generated SVG representation.
     *         For collections like `xAxis`, `yAxis` or `series`, the additional
     *         options is either merged in to the orininal item of the same
     *         `id`, or to the first item if a common id is not found.
     * @return {String}
     *         The SVG representation of the rendered chart.
     * @sample highcharts/members/chart-getsvg/
     *         View the SVG from a button
     */
    getSVG: function (chartOptions) {
        var chart = this,
            chartCopy,
            sandbox,
            svg,
            seriesOptions,
            sourceWidth,
            sourceHeight,
            cssWidth,
            cssHeight,
            // Copy the options and add extra options
            options = merge(chart.options, chartOptions);


        // create a sandbox where a new chart will be generated
        sandbox = createElement('div', null, {
            position: 'absolute',
            top: '-9999em',
            width: chart.chartWidth + 'px',
            height: chart.chartHeight + 'px'
        }, doc.body);

        // get the source size
        cssWidth = chart.renderTo.style.width;
        cssHeight = chart.renderTo.style.height;
        sourceWidth = options.exporting.sourceWidth ||
            options.chart.width ||
            (/px$/.test(cssWidth) && parseInt(cssWidth, 10)) ||
            600;
        sourceHeight = options.exporting.sourceHeight ||
            options.chart.height ||
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
        options.exporting.enabled = false; // hide buttons in print
        delete options.data; // #3004

        // prepare for replicating the chart
        options.series = [];
        each(chart.series, function (serie) {
            seriesOptions = merge(serie.userOptions, { // #4912
                animation: false, // turn off animation
                enableMouseTracking: false,
                showCheckbox: false,
                visible: serie.visible
            });

            // Used for the navigator series that has its own option set
            if (!seriesOptions.isInternal) {
                options.series.push(seriesOptions);
            }
        });

        // Assign an internal key to ensure a one-to-one mapping (#5924)
        each(chart.axes, function (axis) {
            if (!axis.userOptions.internalKey) { // #6444
                axis.userOptions.internalKey = H.uniqueKey();
            }
        });

        // generate the chart copy
        chartCopy = new H.Chart(options, chart.callback);

        // Axis options and series options  (#2022, #3900, #5982)
        if (chartOptions) {
            each(['xAxis', 'yAxis', 'series'], function (coll) {
                var collOptions = {};
                if (chartOptions[coll]) {
                    collOptions[coll] = chartOptions[coll];
                    chartCopy.update(collOptions);
                }
            });
        }

        // Reflect axis extremes in the export (#5924)
        each(chart.axes, function (axis) {
            var axisCopy = H.find(chartCopy.axes, function (copy) {
                    return copy.options.internalKey ===
                        axis.userOptions.internalKey;
                }),
                extremes = axis.getExtremes(),
                userMin = extremes.userMin,
                userMax = extremes.userMax;

            if (
                axisCopy &&
                (
                    (userMin !== undefined && userMin !== axisCopy.min) ||
                    (userMax !== undefined && userMax !== axisCopy.max)
                )
            ) {
                axisCopy.setExtremes(userMin, userMax, true, false);
            }
        });

        // Get the SVG from the container's innerHTML
        svg = chartCopy.getChartHTML();
        fireEvent(this, 'getSVG', { chartCopy: chartCopy });

        svg = chart.sanitizeSVG(svg, options);

        // free up memory
        options = null;
        chartCopy.destroy();
        discardElement(sandbox);

        return svg;
    },

    getSVGForExport: function (options, chartOptions) {
        var chartExportingOptions = this.options.exporting;

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
     * Exporting module required. Submit an SVG version of the chart to a server
     * along with some parameters for conversion.
     * @param  {Object} exportingOptions
     *         Exporting options in addition to those defined in {@link
     *         https://api.highcharts.com/highcharts/exporting|exporting}.
     * @param  {String} exportingOptions.filename
     *         The file name for the export without extension.
     * @param  {String} exportingOptions.url
     *         The URL for the server module to do the conversion.
     * @param  {Number} exportingOptions.width
     *         The width of the PNG or JPG image generated on the server.
     * @param  {String} exportingOptions.type
     *         The MIME type of the converted image.
     * @param  {Number} exportingOptions.sourceWidth
     *         The pixel width of the source (in-page) chart.
     * @param  {Number} exportingOptions.sourceHeight
     *         The pixel height of the source (in-page) chart.
     * @param  {Options} chartOptions
     *         Additional chart options for the exported chart. For example a
     *         different background color can be added here, or `dataLabels`
     *         for export only.
     *
     * @sample highcharts/members/chart-exportchart/
     *         Export with no options
     * @sample highcharts/members/chart-exportchart-filename/
     *         PDF type and custom filename
     * @sample highcharts/members/chart-exportchart-custom-background/
     *         Different chart background in export
     * @sample stock/members/chart-exportchart/
     *         Export with Highstock
     */
    exportChart: function (exportingOptions, chartOptions) {

        var svg = this.getSVGForExport(exportingOptions, chartOptions);

        // merge the options
        exportingOptions = merge(this.options.exporting, exportingOptions);

        // do the post
        H.post(exportingOptions.url, {
            filename: exportingOptions.filename || 'chart',
            type: exportingOptions.type,
            // IE8 fails to post undefined correctly, so use 0
            width: exportingOptions.width || 0,
            scale: exportingOptions.scale,
            svg: svg
        }, exportingOptions.formAttributes);

    },

    /**
     * Exporting module required. Clears away other elements in the page and
     * prints the chart as it is displayed. By default, when the exporting
     * module is enabled, a context button with a drop down menu in the upper
     * right corner accesses this function.
     *
     * @sample highcharts/members/chart-print/
     *         Print from a HTML button
     */
    print: function () {

        var chart = this,
            container = chart.container,
            origDisplay = [],
            origParent = container.parentNode,
            body = doc.body,
            childNodes = body.childNodes,
            printMaxWidth = chart.options.exporting.printMaxWidth,
            resetParams,
            handleMaxWidth;

        if (chart.isPrinting) { // block the button while in printing mode
            return;
        }

        chart.isPrinting = true;
        chart.pointer.reset(null, 0);

        fireEvent(chart, 'beforePrint');

        // Handle printMaxWidth
        handleMaxWidth = printMaxWidth && chart.chartWidth > printMaxWidth;
        if (handleMaxWidth) {
            resetParams = [chart.options.chart.width, undefined, false];
            chart.setSize(printMaxWidth, undefined, false);
        }

        // hide all body content
        each(childNodes, function (node, i) {
            if (node.nodeType === 1) {
                origDisplay[i] = node.style.display;
                node.style.display = 'none';
            }
        });

        // pull out the chart
        body.appendChild(container);

        // Give the browser time to draw WebGL content, an issue that randomly
        // appears (at least) in Chrome ~67 on the Mac (#8708).
        setTimeout(function () {

            win.focus(); // #1510
            win.print();

            // allow the browser to prepare before reverting
            setTimeout(function () {

                // put the chart back in
                origParent.appendChild(container);

                // restore all body content
                each(childNodes, function (node, i) {
                    if (node.nodeType === 1) {
                        node.style.display = origDisplay[i];
                    }
                });

                chart.isPrinting = false;

                // Reset printMaxWidth
                if (handleMaxWidth) {
                    chart.setSize.apply(chart, resetParams);
                }

                fireEvent(chart, 'afterPrint');

            }, 1000);
        }, 1);

    },

    /**
     * Display a popup menu for choosing the export type.
     *
     * @private
     *
     * @param {String} className An identifier for the menu
     * @param {Array} items A collection with text and onclicks for the items
     * @param {Number} x The x position of the opener button
     * @param {Number} y The y position of the opener button
     * @param {Number} width The width of the opener button
     * @param {Number} height The height of the opener button
     */
    contextMenu: function (className, items, x, y, width, height, button) {
        var chart = this,
            navOptions = chart.options.navigation,
            chartWidth = chart.chartWidth,
            chartHeight = chart.chartHeight,
            cacheName = 'cache-' + className,
            menu = chart[cacheName],
            menuPadding = Math.max(width, height), // for mouse leave detection
            innerMenu,
            menuStyle;

        // create the menu only the first time
        if (!menu) {

            // create a HTML element above the SVG
            chart.exportContextMenu = chart[cacheName] = menu =
            createElement('div', {
                className: className
            }, {
                position: 'absolute',
                zIndex: 1000,
                padding: menuPadding + 'px',
                pointerEvents: 'auto'
            }, chart.fixedDiv || chart.container);

            innerMenu = createElement(
                'div',
                { className: 'highcharts-menu' },
                null,
                menu
            );

            /*= if (build.classic) { =*/
            // Presentational CSS
            css(innerMenu, extend({
                    MozBoxShadow: '3px 3px 10px #888',
                    WebkitBoxShadow: '3px 3px 10px #888',
                    boxShadow: '3px 3px 10px #888'
                }, navOptions.menuStyle));
            /*= } =*/

            // hide on mouse out
            menu.hideMenu = function () {
                css(menu, { display: 'none' });
                if (button) {
                    button.setState(0);
                }
                chart.openMenu = false;
                H.clearTimeout(menu.hideTimer);
            };

            // Hide the menu some time after mouse leave (#1357)
            chart.exportEvents.push(
                addEvent(menu, 'mouseleave', function () {
                    menu.hideTimer = setTimeout(menu.hideMenu, 500);
                }),
                addEvent(menu, 'mouseenter', function () {
                    H.clearTimeout(menu.hideTimer);
                }),

                // Hide it on clicking or touching outside the menu (#2258,
                // #2335, #2407)
                addEvent(doc, 'mouseup', function (e) {
                    if (!chart.pointer.inClass(e.target, className)) {
                        menu.hideMenu();
                    }
                }),

                addEvent(menu, 'click', function () {
                    if (chart.openMenu) {
                        menu.hideMenu();
                    }
                })
            );

            // create the items
            each(items, function (item) {

                if (typeof item === 'string') {
                    item = chart.options.exporting.menuItemDefinitions[item];
                }

                if (H.isObject(item, true)) {
                    var element;

                    if (item.separator) {
                        element = createElement('hr', null, null, innerMenu);

                    } else {
                        element = createElement('div', {
                            className: 'highcharts-menu-item',
                            onclick: function (e) {
                                if (e) { // IE7
                                    e.stopPropagation();
                                }
                                menu.hideMenu();
                                if (item.onclick) {
                                    item.onclick.apply(chart, arguments);
                                }
                            },
                            innerHTML: (
                                item.text ||
                                chart.options.lang[item.textKey]
                            )
                        }, null, innerMenu);

                        /*= if (build.classic) { =*/
                        element.onmouseover = function () {
                            css(this, navOptions.menuItemHoverStyle);
                        };
                        element.onmouseout = function () {
                            css(this, navOptions.menuItemStyle);
                        };
                        css(element, extend({
                            cursor: 'pointer'
                        }, navOptions.menuItemStyle));
                        /*= } =*/
                    }

                    // Keep references to menu divs to be able to destroy them
                    chart.exportDivElements.push(element);
                }
            });

            // Keep references to menu and innerMenu div to be able to destroy
            // them
            chart.exportDivElements.push(innerMenu, menu);

            chart.exportMenuWidth = menu.offsetWidth;
            chart.exportMenuHeight = menu.offsetHeight;
        }

        menuStyle = { display: 'block' };

        // if outside right, right align it
        if (x + chart.exportMenuWidth > chartWidth) {
            menuStyle.right = (chartWidth - x - width - menuPadding) + 'px';
        } else {
            menuStyle.left = (x - menuPadding) + 'px';
        }
        // if outside bottom, bottom align it
        if (
            y + height + chart.exportMenuHeight > chartHeight &&
            button.alignOptions.verticalAlign !== 'top'
        ) {
            menuStyle.bottom = (chartHeight - y - menuPadding) + 'px';
        } else {
            menuStyle.top = (y + height - menuPadding) + 'px';
        }

        css(menu, menuStyle);
        chart.openMenu = true;
    },

    /**
     * Add the export button to the chart, with options.
     *
     * @private
     */
    addButton: function (options) {
        var chart = this,
            renderer = chart.renderer,
            btnOptions = merge(chart.options.navigation.buttonOptions, options),
            onclick = btnOptions.onclick,
            menuItems = btnOptions.menuItems,
            symbol,
            button,
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


        var attr = btnOptions.theme,
            states = attr.states,
            hover = states && states.hover,
            select = states && states.select,
            callback;

        delete attr.states;

        if (onclick) {
            callback = function (e) {
                if (e) {
                    e.stopPropagation();
                }
                onclick.call(chart, e);
            };

        } else if (menuItems) {
            callback = function (e) {
                // consistent with onclick call (#3495)
                if (e) {
                    e.stopPropagation();
                }

                chart.contextMenu(
                    button.menuClassName,
                    menuItems,
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

        button = renderer
            .button(btnOptions.text, 0, 0, callback, attr, hover, select)
            .addClass(options.className)
            .attr({
                /*= if (build.classic) { =*/
                'stroke-linecap': 'round',
                /*= } =*/
                title: pick(
                    chart.options.lang[
                        btnOptions._titleKey || btnOptions.titleKey
                    ],
                    ''
                )
            });
        button.menuClassName = (
            options.menuClassName ||
            'highcharts-menu-' + chart.btnCount++
        );

        if (btnOptions.symbol) {
            symbol = renderer.symbol(
                    btnOptions.symbol,
                    btnOptions.symbolX - (symbolSize / 2),
                    btnOptions.symbolY - (symbolSize / 2),
                    symbolSize,
                    symbolSize,
                    // If symbol is an image, scale it (#7957)
                    {
                        width: symbolSize,
                        height: symbolSize
                    }
                )
                .addClass('highcharts-button-symbol')
                .attr({
                    zIndex: 1
                }).add(button);

            /*= if (build.classic) { =*/
            symbol.attr({
                stroke: btnOptions.symbolStroke,
                fill: btnOptions.symbolFill,
                'stroke-width': btnOptions.symbolStrokeWidth || 1
            });
            /*= } =*/
        }

        button.add(chart.exportingGroup)
            .align(extend(btnOptions, {
                width: button.width,
                x: pick(btnOptions.x, chart.buttonOffset) // #1654
            }), true, 'spacingBox');

        chart.buttonOffset += (
            (button.width + btnOptions.buttonSpacing) *
            (btnOptions.align === 'right' ? -1 : 1)
        );

        chart.exportSVGElements.push(button, symbol);

    },

    /**
     * Destroy the export buttons.
     *
     * @private
     */
    destroyExport: function (e) {
        var chart = e ? e.target : this,
            exportSVGElements = chart.exportSVGElements,
            exportDivElements = chart.exportDivElements,
            exportEvents = chart.exportEvents,
            cacheName;

        // Destroy the extra buttons added
        if (exportSVGElements) {
            each(exportSVGElements, function (elem, i) {

                // Destroy and null the svg elements
                if (elem) { // #1822
                    elem.onclick = elem.ontouchstart = null;
                    cacheName = 'cache-' + elem.menuClassName;

                    if (chart[cacheName]) {
                        delete chart[cacheName];
                    }

                    chart.exportSVGElements[i] = elem.destroy();
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
            each(exportDivElements, function (elem, i) {

                // Remove the event handler
                H.clearTimeout(elem.hideTimer); // #5427
                removeEvent(elem, 'mouseleave');

                // Remove inline events
                chart.exportDivElements[i] =
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
            each(exportEvents, function (unbind) {
                unbind();
            });
            exportEvents.length = 0;
        }
    }
});

/*= if (!build.classic) { =*/
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
 * @todo: What are the border styles for text about? In general, text has a lot
 * of properties.
 * @todo: Make it work with IE9 and IE10.
 */
Chart.prototype.inlineStyles = function () {
    var renderer = this.renderer,
        inlineToAttributes = renderer.inlineToAttributes,
        blacklist = renderer.inlineBlacklist,
        whitelist = renderer.inlineWhitelist, // For IE
        unstyledElements = renderer.unstyledElements,
        defaultStyles = {},
        dummySVG,
        iframe,
        iframeDoc;

    // Create an iframe where we read default styles without pollution from this
    // body
    iframe = doc.createElement('iframe');
    css(iframe, {
        width: '1px',
        height: '1px',
        visibility: 'hidden'
    });
    doc.body.appendChild(iframe);
    iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    iframeDoc.close();


    /**
     * Make hyphenated property names out of camelCase
     */
    function hyphenate(prop) {
        return prop.replace(
            /([A-Z])/g,
            function (a, b) {
                return '-' + b.toLowerCase();
            }
        );
    }

    /**
     * Call this on all elements and recurse to children
     */
    function recurse(node) {
        var styles,
            parentStyles,
            cssText = '',
            dummy,
            styleAttr,
            blacklisted,
            whitelisted,
            i;

        // Check computed styles and whether they are in the white/blacklist for
        // styles or atttributes
        function filterStyles(val, prop) {

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

            i = blacklist.length;
            while (i-- && !blacklisted) {
                blacklisted = (
                    blacklist[i].test(prop) ||
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
                    if (inlineToAttributes.indexOf(prop) !== -1) {
                        node.setAttribute(hyphenate(prop), val);
                    // Styles
                    } else {
                        cssText += hyphenate(prop) + ':' + val + ';';
                    }
                }
            }
        }

        if (
            node.nodeType === 1 &&
            unstyledElements.indexOf(node.nodeName) === -1
        ) {
            styles = win.getComputedStyle(node, null);
            parentStyles = node.nodeName === 'svg' ?
                {} :
                win.getComputedStyle(node.parentNode, null);

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
                    win.getComputedStyle(dummy, null)
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
                for (var p in styles) {
                    filterStyles(styles[p], p);
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
            each(node.children || node.childNodes, recurse);
        }
    }

    /**
     * Remove the dummy objects used to get defaults
     */
    function tearDown() {
        dummySVG.parentNode.removeChild(dummySVG);
    }

    recurse(this.container.querySelector('svg'));
    tearDown();

};
/*= } =*/


symbols.menu = function (x, y, width, height) {
    var arr = [
        'M', x, y + 2.5,
        'L', x + width, y + 2.5,
        'M', x, y + height / 2 + 0.5,
        'L', x + width, y + height / 2 + 0.5,
        'M', x, y + height - 1.5,
        'L', x + width, y + height - 1.5
    ];
    return arr;
};

// Add the buttons on chart load
Chart.prototype.renderExporting = function () {
    var chart = this,
        exportingOptions = chart.options.exporting,
        buttons = exportingOptions.buttons,
        isDirty = chart.isDirtyExporting || !chart.exportSVGElements;

    chart.buttonOffset = 0;
    if (chart.isDirtyExporting) {
        chart.destroyExport();
    }

    if (isDirty && exportingOptions.enabled !== false) {
        chart.exportEvents = [];

        chart.exportingGroup = chart.exportingGroup ||
            chart.renderer.g('exporting-group').attr({
                zIndex: 3 // #4955, // #8392
            }).add();

        objectEach(buttons, function (button) {
            chart.addButton(button);
        });

        chart.isDirtyExporting = false;
    }

    // Destroy the export elements at chart destroy
    addEvent(chart, 'destroy', chart.destroyExport);
};

// Add update methods to handle chart.update and chart.exporting.update and
// chart.navigation.update. These must be added to the chart instance rather
// than the Chart prototype in order to use the chart instance inside the update
// function.
addEvent(Chart, 'init', function () {
    var chart = this;
    function update(prop, options, redraw) {
        chart.isDirtyExporting = true;
        merge(true, chart.options[prop], options);
        if (pick(redraw, true)) {
            chart.redraw();
        }
    }
    each(['exporting', 'navigation'], function (prop) {
        chart[prop] = {
            update: function (options, redraw) {
                update(prop, options, redraw);
            }
        };
    });
});

Chart.prototype.callbacks.push(function (chart) {

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
