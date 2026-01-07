/* *
 *
 *  Exporting module
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

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type AxisOptions from '../../Core/Axis/AxisOptions';
import type Axis from '../../Core/Axis/Axis';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type { DeepPartial } from '../../Shared/Types';
import type { EventCallback } from '../../Core/Callback';
import type {
    ExportingOptions,
    ExportingButtonOptions
} from './ExportingOptions';
import type ExportingBase from './ExportingBase';
import type {
    DOMElementType,
    HTMLDOMElement,
    SVGDOMElement
} from '../../Core/Renderer/DOMElementType';
import type GradientColor from '../../Core/Color/GradientColor';
import type { LangOptions } from '../../Core/Options';
import type NavigationOptions from './NavigationOptions';
import type Options from '../../Core/Options';
import type { PatternObject } from '../PatternFill';
import type { SeriesTypeOptions } from '../../Core/Series/SeriesType';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';

import AST from '../../Core/Renderer/HTML/AST.js';
import Chart from '../../Core/Chart/Chart.js';
import ChartNavigationComposition from '../../Core/Chart/ChartNavigationComposition.js';
import D from '../../Core/Defaults.js';
const {
    defaultOptions,
    setOptions
} = D;
import DownloadURL from '../../Shared/DownloadURL.js';
const {
    downloadURL,
    getScript
} = DownloadURL;
import ExportingDefaults from './ExportingDefaults.js';
import ExportingSymbols from './ExportingSymbols.js';
import Fullscreen from './Fullscreen.js';
import G from '../../Core/Globals.js';
const {
    composed,
    doc,
    isFirefox,
    isMS,
    isSafari,
    SVG_NS,
    win
} = G;
import HU from '../../Core/HttpUtilities.js';
import RegexLimits from '../RegexLimits.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    clearTimeout,
    createElement,
    css,
    discardElement,
    error,
    extend,
    find,
    fireEvent,
    isObject,
    merge,
    objectEach,
    pick,
    pushUnique,
    removeEvent,
    splat,
    uniqueKey
} = U;

AST.allowedAttributes.push(
    'data-z-index',
    'fill-opacity',
    'filter',
    'preserveAspectRatio',
    'rx',
    'ry',
    'stroke-dasharray',
    'stroke-linejoin',
    'stroke-opacity',
    'text-anchor',
    'transform',
    'transform-origin',
    'version',
    'viewBox',
    'visibility',
    'xmlns',
    'xmlns:xlink'
);
AST.allowedTags.push(
    'desc',
    'clippath',
    'fedropshadow',
    'femorphology',
    'g',
    'image'
);

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Axis/AxisOptions' {
    interface AxisOptions {
        internalKey?: string;
    }
}

declare module '../../Core/Chart/ChartBase' {
    interface ChartBase {
        exporting?: Exporting;
        /**
         * Deprecated in favor of [Exporting.exportChart](https://api.highcharts.com/class-reference/Highcharts.Exporting#exportChart).
         *
         * @deprecated */
        exportChart(
            exportingOptions?: ExportingOptions,
            chartOptions?: Options
        ): Promise<void>;
        /**
         * Deprecated in favor of [Exporting.getChartHTML](https://api.highcharts.com/class-reference/Highcharts.Exporting#getChartHTML).
         *
         * @deprecated */
        getChartHTML(applyStyleSheets?: boolean): (string | void);
        /**
         * Deprecated in favor of [Exporting.getFilename](https://api.highcharts.com/class-reference/Highcharts.Exporting#getFilename).
         *
         * @deprecated */
        getFilename(): (string | void);
        /**
         * Deprecated in favor of [Exporting.getSVG](https://api.highcharts.com/class-reference/Highcharts.Exporting#getSVG).
         *
         * @deprecated */
        getSVG(chartOptions?: Partial<Options>): (string | void);
        /**
         * Deprecated in favor of [Exporting.print](https://api.highcharts.com/class-reference/Highcharts.Exporting#print).
         *
         * @deprecated */
        print(): void;
    }
}

declare module '../../Core/Chart/ChartOptions' {
    interface ChartEventsOptions {
        afterPrint?: Exporting.AfterPrintCallbackFunction;
        beforePrint?: Exporting.BeforePrintCallbackFunction;
    }
}

declare module '../../Core/GlobalsBase' {
    interface GlobalsBase {
        /**
         * Deprecated in favor of [Exporting.downloadSVG](https://api.highcharts.com/class-reference/Highcharts.Exporting#downloadSVG).
         *
         * @deprecated */
        downloadSVGLocal: Exporting.DownloadSVGFunction
    }
}

/* *
 *
 *  Constants
 *
 * */

export const domurl = win.URL || win.webkitURL || win;

/* *
 *
 *  Class
 *
 * */

/**
 * The Exporting class provides methods for exporting charts to images. If the
 * exporting module is loaded, this class is instantiated on the chart and
 * available through the `chart.exporting` property. Read more about the
 * [exporting module](https://www.highcharts.com/docs/export-module-overview).
 *
 * @class
 * @name Highcharts.Exporting
 *
 * @param {Highcharts.Chart} chart
 * The chart instance.
 */
class Exporting {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        chart: Chart,
        options: ExportingOptions
    ) {
        this.chart = chart;
        this.options = options;
        this.btnCount = 0;
        this.buttonOffset = 0;
        this.divElements = [];
        this.svgElements = [];
    }

    /* *
     *
     *  Static Properties
     *
     * */

    public static inlineAllowlist: Array<RegExp> = [];

    // These CSS properties are not inlined. Remember camelCase.
    public static inlineDenylist: Array<RegExp> = [
        /-/, // In Firefox, both hyphened and camelCased names are listed
        /^(clipPath|cssText|d|height|width)$/, // Full words
        /^font$/, // More specific props are set
        /[lL]ogical(Width|Height)$/,
        /^parentRule$/,
        /^(cssRules|ownerRules)$/, // #19516 read-only properties
        /perspective/,
        /TapHighlightColor/,
        /^transition/,
        /^length$/, // #7700
        /^\d+$/ // #17538
    ];

    // These ones are translated to attributes rather than styles
    public static inlineToAttributes: Array<string> = [
        'fill',
        'stroke',
        'strokeLinecap',
        'strokeLinejoin',
        'strokeWidth',
        'textAnchor',
        'x',
        'y'
    ];

    // Milliseconds to defer image load event handlers to offset IE bug
    public static loadEventDeferDelay = isMS ? 150 : 0;

    public static objectURLRevoke?: boolean;

    public static printingChart?: Chart;

    public static unstyledElements: Array<string> = [
        'clipPath',
        'defs',
        'desc'
    ];

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Make hyphenated property names out of camelCase.
     *
     * @private
     * @static
     * @function Highcharts.Exporting#hyphenate
     *
     * @param {string} property
     * Property name in camelCase.
     *
     * @return {string}
     * Hyphenated property name.
     *
     * @requires modules/exporting
     */
    public static hyphenate(
        property: string
    ): string {
        return property.replace(
            /[A-Z]/g,
            function (match: string): string {
                return '-' + match.toLowerCase();
            }
        );
    }

    /**
     * Get data:URL from image URL.
     *
     * @private
     * @static
     * @async
     * @function Highcharts.Exporting#imageToDataURL
     *
     * @param {string} imageURL
     * The address or URL of the image.
     * @param {number} scale
     * The scale of the image.
     * @param {string} imageType
     * The export type of the image.
     *
     * @requires modules/exporting
     */
    public static async imageToDataURL(
        imageURL: string,
        scale: number,
        imageType: string
    ): Promise<string> {
        // First, wait for the image to be loaded
        const img = await Exporting.loadImage(imageURL),
            canvas = doc.createElement('canvas'),
            ctx = canvas?.getContext('2d');

        if (!ctx) {
            throw new Error('No canvas found!');
        } else {
            canvas.height = img.height * scale;
            canvas.width = img.width * scale;
            ctx.drawImage(
                img, 0, 0, canvas.width, canvas.height
            );

            // Now we try to get the contents of the canvas
            return canvas.toDataURL(imageType);
        }
    }

    private static async fetchCSS(href: string): Promise<CSSStyleSheet> {
        const content = await fetch(href)
            .then((res): Promise<string> => res.text());

        const newSheet = new CSSStyleSheet();
        newSheet.replaceSync(content);

        return newSheet;
    }

    private static async handleStyleSheet(
        sheet: CSSStyleSheet,
        resultArray: string[]
    ): Promise<void> {
        try {
            for (const rule of Array.from(sheet.cssRules)) {
                if (rule instanceof CSSImportRule) {
                    const sheet = await Exporting.fetchCSS(rule.href);
                    await Exporting.handleStyleSheet(sheet, resultArray);
                }

                if (rule instanceof CSSFontFaceRule) {
                    let cssText = rule.cssText;

                    if (sheet.href) {
                        const baseUrl = sheet.href,
                            regexp =
                        /url\(\s*(['"]?)(?![a-z]+:|\/\/)([^'")]+?)\1\s*\)/gi;

                        // Replace relative URLs
                        cssText = cssText.replace(
                            regexp,
                            (_, quote: string, relPath: string): string => {
                                const absolutePath =
                                    new URL(relPath, baseUrl).href;
                                return `url(${quote}${absolutePath}${quote})`;
                            });
                    }

                    resultArray.push(cssText);
                }
            }
        } catch {
            if (sheet.href) {
                const newSheet = await Exporting.fetchCSS(sheet.href);
                await Exporting.handleStyleSheet(newSheet, resultArray);
            }
        }
    }

    private static async fetchStyleSheets(): Promise<string[]> {
        const cssTexts: string[] = [];

        for (const sheet of Array.from(doc.styleSheets)) {
            await Exporting.handleStyleSheet(sheet, cssTexts);
        }

        return cssTexts;
    }

    public static async inlineFonts(svg: SVGSVGElement): Promise<SVGSVGElement> {
        const cssTexts = await Exporting.fetchStyleSheets(),
            urlRegex = /url\(([^)]+)\)/g,
            urls: string[] = [];

        let cssText = cssTexts.join('\n'),
            match;

        while ((match = urlRegex.exec(cssText))) {
            const m = match[1].replace(/['"]/g, '');
            if (!urls.includes(m)) {
                urls.push(m);
            }
        }

        const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        };

        const replacements: Record<string, string> = {};
        for (const url of urls) {
            try {
                const res = await fetch(url),
                    contentType = res.headers.get('Content-Type') || '',
                    b64 = arrayBufferToBase64(await res.arrayBuffer());

                replacements[url] = `data:${contentType};base64,${b64}`;
            } catch {
                // eslint-disable-next-line
            }
        }

        cssText = cssText.replace(urlRegex, (_, url: string): string => {
            const strippedUrl = url.replace(/['"]/g, '');
            return `url(${replacements[strippedUrl] || strippedUrl})`;
        });


        const styleEl = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'style'
        );
        styleEl.textContent = cssText;

        // Needs to be appended to pass sanitization
        svg.append(styleEl);

        return svg;
    }


    /**
     * Loads an image from the provided URL.
     *
     * @private
     * @static
     * @function Highcharts.Exporting#loadImage
     *
     * @param {string} imageURL
     * The address or URL of the image.
     *
     * @return {Promise<HTMLImageElement>}
     * Returns a Promise that resolves with the loaded HTMLImageElement.
     *
     * @requires modules/exporting
     */
    public static loadImage(
        imageURL: string
    ): Promise<HTMLImageElement> {
        return new Promise((resolve, reject): void => {
            // Create an image
            const image = new win.Image();

            // Must be set prior to loading image source
            image.crossOrigin = 'Anonymous';

            // Return the image in case of success
            image.onload = (): void => {
                // IE bug where image is not always ready despite load event
                setTimeout((): void => {
                    resolve(image);
                }, Exporting.loadEventDeferDelay);
            };

            // Reject in case of fail
            image.onerror = (error): void => {
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                reject(error);
            };

            // Provide the image URL
            image.src = imageURL;
        });
    }

    /**
     * Prepares and returns the image export options with default values where
     * necessary.
     *
     * @private
     * @static
     * @function Highcharts.Exporting#prepareImageOptions
     *
     * @param {Highcharts.ExportingOptions} exportingOptions
     * The exporting options.
     *
     * @return {Exporting.ImageOptions}
     * The finalized image export options with ensured values.
     *
     * @requires modules/exporting
     */
    public static prepareImageOptions(
        exportingOptions: ExportingOptions
    ): Exporting.ImageOptions {
        const type = exportingOptions?.type || 'image/png',
            libURL = (
                exportingOptions?.libURL ||
                defaultOptions.exporting?.libURL
            );

        return {
            type,
            filename: (
                (exportingOptions?.filename || 'chart') +
                '.' +
                (type === 'image/svg+xml' ? 'svg' : type.split('/')[1])
            ),
            scale: exportingOptions?.scale || 1,
            // Allow libURL to end with or without fordward slash
            libURL: libURL?.slice(-1) !== '/' ? libURL + '/' : libURL
        };
    }

    /**
     * Prepare the SVG DOM for exporting
     *
     * @private
     */
    public static sanitizeDOM(
        svg: SVGDOMElement
    ): void {
        // Increase the size of foreignObjects to avoid clipping when the
        // applied font size in the export is larger than the on-screen font
        // size.
        svg.querySelectorAll('foreignObject').forEach((fo): void => {
            ['width', 'height'].forEach((attr): void => {
                const value = fo.getAttribute(attr);
                if (value) {
                    fo.setAttribute(
                        attr,
                        Math.ceil(parseInt(value, 10) * 1.15)
                    );
                }
            });
        });
    }

    /**
     * A collection of fixes on the produced SVG to account for expand
     * properties and browser bugs. Returns a cleaned SVG.
     *
     * @private
     * @static
     * @function Highcharts.Exporting#sanitizeSVG
     *
     * @param {string} svg
     * SVG code to sanitize.
     * @param {Highcharts.Options} options
     * Chart options to apply.
     *
     * @return {string}
     * Sanitized SVG code.
     *
     * @requires modules/exporting
     */
    public static sanitizeSVG(
        svg: string,
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        options?: Options
    ): string {
        svg = svg
            // Some tags needs to be closed in xhtml (#13726)
            .replace(/(<(?:img|br).*?(?=\>))>/g, '$1 />')
            .replace(/zIndex="[^"]+"/g, '')
            .replace(/symbolName="[^"]+"/g, '')
            .replace(/jQuery\d+="[^"]+"/g, '')
            .replace(/url\(("|&quot;)(.*?)("|&quot;)\;?\)/g, 'url($2)')
            .replace(/url\([^#]+#/g, 'url(#')
            .replace(
                /<svg /,
                '<svg xmlns:xlink="http://www.w3.org/1999/xlink" '
            )
            .replace(/ (NS\d+\:)?href=/g, ' xlink:href=') // #3567
            .replace(/\n+/g, ' ')

            // Replace HTML entities, issue #347
            .replace(/&nbsp;/g, '\u00A0') // No-break space
            .replace(/&shy;/g, '\u00AD'); // Soft hyphen

        return svg;
    }

    /**
     * Get blob URL from SVG code. Falls back to normal data URI.
     *
     * @private
     * @static
     * @function Highcharts.Exporting#svgToDataURL
     *
     * @param {string} svg
     * SVG to get the URL from.
     *
     * @return {string}
     * The data URL.
     *
     * @requires modules/exporting
     */
    public static svgToDataURL(
        svg: string
    ): string {
        // Webkit and not chrome
        const userAgent = win.navigator.userAgent;
        const webKit = (
            userAgent.indexOf('WebKit') > -1 &&
            userAgent.indexOf('Chrome') < 0
        );

        try {
            // Safari requires data URI since it doesn't allow navigation to
            // blob URLs. ForeignObjects also don't work well in Blobs in Chrome
            // (#14780).
            if (!webKit && svg.indexOf('<foreignObject') === -1) {
                return domurl.createObjectURL(new win.Blob([svg], {
                    type: 'image/svg+xml;charset-utf-16'
                }));
            }
        } catch {
            // Ignore
        }
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }

    /* *
     *
     *  Properties
     *
     * */

    public btnCount: number;

    public buttonOffset: number;

    public chart: Chart;

    public contextMenuEl?: Exporting.DivElement;

    public divElements: Array<(Exporting.DivElement | null)>;

    public events?: Array<Function>;

    public group?: SVGElement;

    public isDirty?: boolean;

    public isPrinting?: boolean;

    public menuHeight?: number;

    public menuWidth?: number;

    public openMenu?: boolean;

    public options: ExportingOptions = {};

    public printReverseInfo?: Exporting.PrintReverseInfoObject;

    public svgElements: Array<(SVGElement | undefined)>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Add the export button to the chart, with options.
     *
     * @private
     * @function Highcharts.Exporting#addButton
     *
     * @param {Highcharts.ExportingButtonOptions} options
     * The exporting button options object.
     *
     * @requires modules/exporting
     */
    public addButton(
        options: ExportingButtonOptions
    ): void {
        const exporting = this,
            chart = exporting.chart,
            renderer = chart.renderer,
            btnOptions = merge<ExportingButtonOptions>(
                chart.options.navigation?.buttonOptions,
                options
            ),
            onclick = btnOptions.onclick,
            menuItems = btnOptions.menuItems,
            symbolSize = btnOptions.symbolSize || 12;
        let symbol;

        if (btnOptions.enabled === false || !btnOptions.theme) {
            return;
        }

        const theme = chart.styledMode ? {} : btnOptions.theme;

        let callback: (EventCallback<SVGElement> | undefined) = (
            (): void => {}
        );

        if (onclick) {
            callback = function (
                this: SVGElement,
                e: (Event | AnyRecord)
            ): void {
                if (e) {
                    e.stopPropagation();
                }
                onclick.call(chart, e);
            };
        } else if (menuItems) {
            callback = function (
                this: SVGElement,
                e: (Event | AnyRecord)
            ): void {
                // Consistent with onclick call (#3495)
                if (e) {
                    e.stopPropagation();
                }
                exporting.contextMenu(
                    button.menuClassName,
                    menuItems,
                    button.translateX || 0,
                    button.translateY || 0,
                    button.width || 0,
                    button.height || 0,
                    button
                );
                button.setState(2);
            };
        }

        if (btnOptions.text && btnOptions.symbol) {
            theme.paddingLeft = pick(theme.paddingLeft, 30);
        } else if (!btnOptions.text) {
            extend(theme, {
                width: btnOptions.width,
                height: btnOptions.height,
                padding: 0
            });
        }

        const button: SVGElement = renderer
            .button(
                btnOptions.text || '',
                0,
                0,
                callback,
                theme,
                void 0,
                void 0,
                void 0,
                void 0,
                btnOptions.useHTML
            )
            .addClass(options.className || '')
            .attr({
                title: pick(chart.options.lang[
                    (btnOptions._titleKey ||
                    btnOptions.titleKey) as keyof LangOptions
                ] as string, '')
            });

        button.menuClassName = (
            options.menuClassName ||
            'highcharts-menu-' + exporting.btnCount++
        );

        if (btnOptions.symbol) {
            symbol = renderer
                .symbol(
                    btnOptions.symbol,
                    Math.round(
                        (btnOptions.symbolX || 0) - (symbolSize / 2)
                    ),
                    Math.round(
                        (btnOptions.symbolY || 0) - (symbolSize / 2)
                    ),
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
            .add(exporting.group)
            .align(extend(btnOptions, {
                width: button.width,
                x: pick(btnOptions.x, exporting.buttonOffset) // #1654
            }), true, 'spacingBox');

        exporting.buttonOffset += (
            ((button.width || 0) + (btnOptions.buttonSpacing || 0)) *
            (btnOptions.align === 'right' ? -1 : 1)
        );

        exporting.svgElements.push(button, symbol);
    }

    /**
     * Clean up after printing a chart.
     *
     * @private
     * @function Highcharts.Exporting#afterPrint
     *
     * @emits Highcharts.Chart#event:afterPrint
     *
     * @requires modules/exporting
     */
    public afterPrint(): void {
        const chart = this.chart;

        if (!this.printReverseInfo) {
            return void 0;
        }

        const {
            childNodes,
            origDisplay,
            resetParams
        } = this.printReverseInfo as Exporting.PrintReverseInfoObject;

        // Put the chart back in
        this.moveContainers(chart.renderTo);

        // Restore all body content
        [].forEach.call(childNodes, function (
            node: HTMLDOMElement,
            i: number
        ): void {
            if (node.nodeType === 1) {
                node.style.display = (origDisplay[i] || '');
            }
        });

        this.isPrinting = false;

        // Reset printMaxWidth
        if (resetParams) {
            chart.setSize.apply(chart, resetParams);
        }

        delete this.printReverseInfo;
        Exporting.printingChart = void 0;

        fireEvent(chart, 'afterPrint');
    }

    /**
     * Prepare chart and document before printing a chart.
     *
     * @private
     * @function Highcharts.Exporting#beforePrint
     *
     * @emits Highcharts.Chart#event:beforePrint
     *
     * @requires modules/exporting
     */
    public beforePrint(): void {
        const chart = this.chart,
            body = doc.body,
            printMaxWidth = this.options.printMaxWidth,
            printReverseInfo: Exporting.PrintReverseInfoObject = {
                childNodes: body.childNodes,
                origDisplay: [],
                resetParams: void 0
            };

        this.isPrinting = true;
        chart.pointer?.reset(void 0, 0);

        fireEvent(chart, 'beforePrint');

        // Handle printMaxWidth
        if (printMaxWidth && chart.chartWidth > printMaxWidth) {
            printReverseInfo.resetParams = [
                chart.options.chart.width,
                void 0,
                false
            ];
            chart.setSize(printMaxWidth, void 0, false);
        }

        // Hide all body content
        [].forEach.call(printReverseInfo.childNodes, function (
            node: HTMLDOMElement,
            i: number
        ): void {
            if (node.nodeType === 1) {
                printReverseInfo.origDisplay[i] = node.style.display;
                node.style.display = 'none';
            }
        });

        // Pull out the chart
        this.moveContainers(body);

        // Storage details for undo action after printing
        this.printReverseInfo = printReverseInfo;
    }

    /**
     * Display a popup menu for choosing the export type.
     *
     * @private
     * @function Highcharts.Exporting#contextMenu
     *
     * @param {string} className
     * An identifier for the menu.
     * @param {Array<(string | Highcharts.ExportingMenuObject)>} items
     * A collection with text and onclicks for the items.
     * @param {number} x
     * The x position of the opener button.
     * @param {number} y
     * The y position of the opener button.
     * @param {number} width
     * The width of the opener button.
     * @param {number} height
     * The height of the opener button.
     * @param {SVGElement} button
     * The SVG button element.
     *
     * @emits Highcharts.Chart#event:exportMenuHidden
     * @emits Highcharts.Chart#event:exportMenuShown
     *
     * @requires modules/exporting
     */
    public contextMenu(
        className: string,
        items: Array<(string | Exporting.MenuObject)>,
        x: number,
        y: number,
        width: number,
        height: number,
        button: SVGElement
    ): void {
        const exporting = this,
            chart = exporting.chart,
            navOptions = chart.options.navigation,
            chartWidth = chart.chartWidth,
            chartHeight = chart.chartHeight,
            cacheName = 'cache-' + className,
            // For mouse leave detection
            menuPadding = Math.max(width, height);
        let innerMenu: HTMLDOMElement,
            menu: Exporting.DivElement = (chart as AnyRecord)[cacheName];

        // Create the menu only the first time
        if (!menu) {
            // Create a HTML element above the SVG
            exporting.contextMenuEl = (chart as AnyRecord)[cacheName] = menu =
                createElement(
                    'div', {
                        className: className
                    },
                    {
                        position: 'absolute',
                        zIndex: 1000,
                        padding: menuPadding + 'px',
                        pointerEvents: 'auto',
                        ...chart.renderer.style
                    },
                    chart.scrollablePlotArea?.fixedDiv || chart.container
                ) as Exporting.DivElement;

            innerMenu = createElement(
                'ul',
                { className: 'highcharts-menu' },
                chart.styledMode ? {} : {
                    listStyle: 'none',
                    margin: 0,
                    padding: 0
                },
                menu
            );

            // Presentational CSS
            if (!chart.styledMode) {
                css(innerMenu, extend<CSSObject>({
                    MozBoxShadow: '3px 3px 10px #0008',
                    WebkitBoxShadow: '3px 3px 10px #0008',
                    boxShadow: '3px 3px 10px #0008'
                }, navOptions?.menuStyle || {}));
            }

            // Hide on mouse out
            menu.hideMenu = function (): void {
                css(menu, { display: 'none' });
                if (button) {
                    button.setState(0);
                }
                if (chart.exporting) {
                    chart.exporting.openMenu = false;
                }
                // #10361, #9998
                css(chart.renderTo, { overflow: 'hidden' });
                css(chart.container, { overflow: 'hidden' });
                clearTimeout(menu.hideTimer);
                fireEvent(chart, 'exportMenuHidden');
            };

            // Hide the menu some time after mouse leave (#1357)
            exporting.events?.push(
                addEvent(menu, 'mouseleave', function (): void {
                    menu.hideTimer = win.setTimeout(menu.hideMenu, 500);
                }),

                addEvent(menu, 'mouseenter', function (): void {
                    clearTimeout(menu.hideTimer);
                }),

                // Hide it on clicking or touching outside the menu (#2258,
                // #2335, #2407)
                addEvent(doc, 'mouseup', function (e: PointerEvent): void {
                    if (
                        !chart.pointer?.inClass(
                            e.target as DOMElementType,
                            className
                        )
                    ) {
                        menu.hideMenu();
                    }
                }),

                addEvent(menu, 'click', function (): void {
                    if (chart.exporting?.openMenu) {
                        menu.hideMenu();
                    }
                })
            );

            // Create the items
            items.forEach(function (
                item: (string | Exporting.MenuObject)
            ): void {
                if (typeof item === 'string') {
                    if (exporting.options.menuItemDefinitions?.[item]) {
                        item = exporting.options.menuItemDefinitions[item];
                    }
                }

                if (isObject(item, true)) {
                    let element;

                    if (item.separator) {
                        element = createElement(
                            'hr',
                            void 0,
                            void 0,
                            innerMenu
                        );
                    } else {
                        // When chart initialized with the table, wrong button
                        // text displayed, #14352.
                        if (
                            item.textKey === 'viewData' &&
                            exporting.isDataTableVisible
                        ) {
                            item.textKey = 'hideData';
                        }

                        element = createElement('li', {
                            className: 'highcharts-menu-item',
                            onclick: function (e: PointerEvent): void {
                                if (e) { // IE7
                                    e.stopPropagation();
                                }
                                menu.hideMenu();
                                if (typeof item !== 'string' && item.onclick) {
                                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                                    item.onclick.apply(chart, arguments);
                                }
                            }
                        }, void 0, innerMenu);

                        AST.setElementHTML(
                            element,
                            item.text || chart.options.lang[
                                item.textKey as keyof LangOptions
                            ] as string
                        );

                        if (!chart.styledMode) {
                            element.onmouseover = function (
                                this: GlobalEventHandlers
                            ): void {
                                css(
                                    this as HTMLDOMElement,
                                    navOptions?.menuItemHoverStyle || {}
                                );
                            };
                            element.onmouseout = function (
                                this: GlobalEventHandlers
                            ): void {
                                css(
                                    this as HTMLDOMElement,
                                    navOptions?.menuItemStyle || {}
                                );
                            };

                            css(element, extend({
                                cursor: 'pointer'
                            } as CSSObject, navOptions?.menuItemStyle || {}));
                        }
                    }

                    // Keep references to menu divs to be able to destroy them
                    exporting.divElements.push(element as Exporting.DivElement);
                }
            });

            // Keep references to menu and innerMenu div to be able to destroy
            // them
            exporting.divElements.push(innerMenu as Exporting.DivElement, menu);
            exporting.menuHeight = menu.offsetHeight;
            exporting.menuWidth = menu.offsetWidth;
        }

        const menuStyle: CSSObject = { display: 'block' };

        // If outside right, right align it
        if (x + (exporting.menuWidth || 0) > chartWidth) {
            menuStyle.right = (chartWidth - x - width - menuPadding) + 'px';
        } else {
            menuStyle.left = (x - menuPadding) + 'px';
        }

        // If outside bottom, bottom align it
        if (
            y + height + (exporting.menuHeight || 0) >
            chartHeight &&
            button.alignOptions?.verticalAlign !== 'top'
        ) {
            menuStyle.bottom = (chartHeight - y - menuPadding) + 'px';
        } else {
            menuStyle.top = (y + height - menuPadding) + 'px';
        }

        css(menu, menuStyle);
        // #10361, #9998
        css(chart.renderTo, { overflow: '' });
        css(chart.container, { overflow: '' });

        if (chart.exporting) {
            chart.exporting.openMenu = true;
        }

        fireEvent(chart, 'exportMenuShown');
    }

    /**
     * Destroy the export buttons.
     *
     * @private
     * @function Highcharts.Exporting#destroy
     *
     * @param {global.Event} [e]
     * Event object.
     *
     * @requires modules/exporting
     */
    public destroy(
        e?: Event
    ): void {
        const exporting = this,
            chart = e ? (e.target as unknown as Chart) : exporting.chart,
            { divElements, events, svgElements } = exporting;
        let cacheName;

        // Destroy the extra buttons added
        svgElements.forEach((elem, i): void => {
            // Destroy and null the svg elements
            if (elem) { // #1822
                elem.onclick = elem.ontouchstart = null;
                cacheName = 'cache-' + elem.menuClassName;

                if ((chart as AnyRecord)[cacheName]) {
                    delete (chart as AnyRecord)[cacheName];
                }

                svgElements[i] = elem.destroy();
            }
        });
        svgElements.length = 0;

        // Destroy the exporting group
        if (exporting.group) {
            exporting.group.destroy();
            delete exporting.group;
        }

        // Destroy the divs for the menu
        divElements.forEach(function (
            elem: (Exporting.DivElement | null),
            i: number
        ): void {
            if (elem) {
                // Remove the event handler
                clearTimeout(elem.hideTimer); // #5427
                removeEvent(elem, 'mouseleave');

                // Remove inline events
                divElements[i] =
                    elem.onmouseout =
                    elem.onmouseover =
                    elem.ontouchstart =
                    elem.onclick = null;

                // Destroy the div by moving to garbage bin
                discardElement(elem);
            }
        });
        divElements.length = 0;

        if (events) {
            events.forEach(function (unbind: Function): void {
                unbind();
            });
            events.length = 0;
        }
    }

    /**
     * Get data URL to an image of an SVG and call download on its options
     * object:
     *
     * - **filename:** Name of resulting downloaded file without extension.
     * Default is based on the chart title.
     * - **type:** File type of resulting download. Default is `image/png`.
     * - **scale:** Scaling factor of downloaded image compared to source.
     * Default is `2`.
     * - **libURL:** URL pointing to location of dependency scripts to download
     * on demand. Default is the exporting.libURL option of the global
     * Highcharts options pointing to our server.
     *
     * @async
     * @private
     * @function Highcharts.Exporting#downloadSVG
     *
     * @param {string} svg
     * The generated SVG.
     * @param {Highcharts.ExportingOptions} exportingOptions
     * The exporting options.
     *
     * @requires modules/exporting
     */
    // eslint-disable-next-line @typescript-eslint/require-await
    public async downloadSVG(
        svg: string,
        exportingOptions: ExportingOptions
    ): Promise<void> {
        const eventArgs: Exporting.DownloadSVGEventArgs = {
            svg,
            exportingOptions,
            exporting: this
        };

        // Fire a custom event before the export starts
        fireEvent(
            Exporting.prototype,
            'downloadSVG',
            eventArgs
        );

        // If the event was prevented, do not proceed with the export
        if (eventArgs.defaultPrevented) {
            return;
        }

        // Get the final image options
        const {
            type,
            filename,
            scale,
            libURL
        } = Exporting.prepareImageOptions(exportingOptions);
        let svgURL: string;

        // Initiate download depending on file type
        if (type === 'application/pdf') {
            // Error in case of offline-exporting module is not loaded
            throw new Error(
                'Offline exporting logic for PDF type is not found.'
            );
        } else if (type === 'image/svg+xml') {
            // SVG download. In this case, we want to use Microsoft specific
            // Blob if available
            if (typeof win.MSBlobBuilder !== 'undefined') {
                const blob = new win.MSBlobBuilder();
                blob.append(svg);
                svgURL = blob.getBlob('image/svg+xml');
            } else {
                svgURL = Exporting.svgToDataURL(svg);
            }
            // Download the chart
            downloadURL(svgURL, filename);
        } else {
            // PNG/JPEG download - create bitmap from SVG
            svgURL = Exporting.svgToDataURL(svg);
            try {
                Exporting.objectURLRevoke = true;

                // First, try to get PNG by rendering on canvas
                const dataURL = await Exporting.imageToDataURL(
                    svgURL,
                    scale,
                    type
                );
                downloadURL(dataURL, filename);
            } catch (error) {
                // No need for the below logic to run in case no canvas is
                // found
                if ((error as Error).message === 'No canvas found!') {
                    throw error;
                }

                // Or in case of exceeding the input length
                if (svg.length > RegexLimits.svgLimit) {
                    throw new Error('Input too long');
                }

                // Failed due to tainted canvas
                // Create new and untainted canvas
                const canvas = doc.createElement('canvas'),
                    ctx = canvas.getContext('2d'),
                    matchedImageWidth = svg.match(
                        // eslint-disable-next-line max-len
                        /^<svg[^>]*\s{,1000}width\s{,1000}=\s{,1000}\"?(\d+)\"?[^>]*>/
                    ),
                    matchedImageHeight = svg.match(
                        // eslint-disable-next-line max-len
                        /^<svg[^>]*\s{0,1000}height\s{,1000}=\s{,1000}\"?(\d+)\"?[^>]*>/
                    );

                if (
                    ctx &&
                    matchedImageWidth &&
                    matchedImageHeight
                ) {
                    const imageWidth =
                        +matchedImageWidth[1] * scale,
                        imageHeight =
                            +matchedImageHeight[1] * scale,
                        downloadWithCanVG = (): void => {
                            const v =
                                win.canvg.Canvg.fromString(
                                    ctx,
                                    svg
                                );
                            v.start();

                            downloadURL(
                                win.navigator.msSaveOrOpenBlob ?
                                    canvas.msToBlob() :
                                    canvas.toDataURL(type),
                                filename
                            );
                        };
                    canvas.width = imageWidth;
                    canvas.height = imageHeight;

                    // Must load canVG first if not found. Don't destroy the
                    // object URL yet since we are doing things
                    // asynchronously
                    if (!win.canvg) {
                        Exporting.objectURLRevoke = true;
                        await getScript(libURL + 'canvg.js');
                    }

                    // Use loaded canvg
                    downloadWithCanVG();
                }
            } finally {
                if (Exporting.objectURLRevoke) {
                    try {
                        domurl.revokeObjectURL(svgURL);
                    } catch {
                        // Ignore
                    }
                }
            }
        }
    }

    /**
     * Submit an SVG version of the chart along with some parameters for local
     * conversion (PNG, JPEG, and SVG) or conversion on a server (PDF).
     *
     * @sample highcharts/members/chart-exportchart/
     * Export with no options
     * @sample highcharts/members/chart-exportchart-filename/
     * PDF type and custom filename
     * @sample highcharts/exporting/menuitemdefinitions-webp/
     * Export to WebP
     * @sample highcharts/members/chart-exportchart-custom-background/
     * Different chart background in export
     * @sample stock/members/chart-exportchart/
     * Export with Highcharts Stock
     *
     * @async
     * @function Highcharts.Exporting#exportChart
     *
     * @param {Highcharts.ExportingOptions} [exportingOptions]
     * Exporting options in addition to those defined in
     * [exporting](https://api.highcharts.com/highcharts/exporting).
     * @param {Highcharts.Options} [chartOptions]
     * Additional chart options for the exported chart. For example a different
     * background color can be added here, or `dataLabels` for export only.
     *
     * @requires modules/exporting
     */
    public async exportChart(
        exportingOptions?: ExportingOptions,
        chartOptions?: Options
    ): Promise<void> {
        // Merge the options
        exportingOptions = merge(this.options, exportingOptions);

        // If local if expected
        if (exportingOptions.local) {
            // Trigger the local export logic
            await this.localExport(
                exportingOptions,
                chartOptions || {}
            );
        } else {
            // Get the SVG representation
            const svg = this.getSVGForExport(
                exportingOptions,
                chartOptions
            );

            // Do the post
            if (exportingOptions.url) {
                await HU.post(exportingOptions.url, {
                    filename: exportingOptions.filename ?
                        exportingOptions.filename.replace(/\//g, '-') :
                        this.getFilename(),
                    type: exportingOptions.type,
                    width: exportingOptions.width,
                    scale: exportingOptions.scale,
                    svg
                }, exportingOptions.fetchOptions);
            }
        }
    }

    /**
     * Handles the fallback to the export server when a local export fails.
     *
     * @private
     * @async
     * @function Highcharts.Exporting#fallbackToServer
     *
     * @param {Highcharts.ExportingOptions} exportingOptions
     * The exporting options.
     * @param {Error} err
     * The error that caused the local export to fail.
     *
     * @return {Promise<void>}
     * A promise that resolves when the fallback process is complete.
     *
     * @requires modules/exporting
     */
    public async fallbackToServer(
        exportingOptions: ExportingOptions,
        err: Error
    ): Promise<void> {
        if (exportingOptions.fallbackToExportServer === false) {
            if (exportingOptions.error) {
                exportingOptions.error(exportingOptions, err);
            } else {
                // Fallback disabled
                error(28, true);
            }
        } else if (exportingOptions.type === 'application/pdf') {
            // The local must be false to fallback to server for PDF export
            exportingOptions.local = false;

            // Allow fallbacking to server only for PDFs that failed locally
            await this.exportChart(exportingOptions);
        }
    }

    /**
     * Return the unfiltered innerHTML of the chart container. Used as hook for
     * plugins. In styled mode, it also takes care of inlining CSS style rules.
     *
     * @see Chart#getSVG
     *
     * @function Highcharts.Exporting#getChartHTML
     *
     * @param {boolean} [applyStyleSheets]
     * whether or not to apply the style sheets.
     *
     * @return {string}
     * The unfiltered SVG of the chart.
     *
     * @requires modules/exporting
     */
    public getChartHTML(
        applyStyleSheets?: boolean
    ): string {
        const chart = this.chart;
        if (applyStyleSheets) {
            this.inlineStyles();
        }
        this.resolveCSSVariables();

        Exporting.sanitizeDOM(chart.renderer.box);
        return chart.container.innerHTML;
    }

    /**
     * Get the default file name used for exported charts. By default it creates
     * a file name based on the chart title.
     *
     * @function Highcharts.Exporting#getFilename
     *
     * @return {string}
     * A file name without extension.
     *
     * @requires modules/exporting
     */
    public getFilename(): string {
        const titleText = this.chart.userOptions.title?.text;

        let filename = this.options.filename;
        if (filename) {
            return filename.replace(/\//g, '-');
        }

        if (typeof titleText === 'string') {
            filename = titleText
                .toLowerCase()
                .replace(/<\/?[^>]+(>|$)/g, '') // Strip HTML tags
                .replace(/[\s_]+/g, '-')
                .replace(/[^a-z\d\-]/g, '') // Preserve only latin
                .replace(/^[\-]+/g, '') // Dashes in the start
                .replace(/[\-]+/g, '-') // Dashes in a row
                .substr(0, 24)
                .replace(/[\-]+$/g, ''); // Dashes in the end;
        }

        if (!filename || filename.length < 5) {
            filename = 'chart';
        }

        return filename;
    }

    /**
     * Return an SVG representation of the chart.
     *
     * @sample highcharts/members/chart-getsvg/
     * View the SVG from a button
     *
     * @function Highcharts.Exporting#getSVG
     *
     * @param {Highcharts.Options} [chartOptions]
     * Additional chart options for the generated SVG representation. For
     * collections like `xAxis`, `yAxis` or `series`, the additional options is
     * either merged in to the original item of the same `id`, or to the first
     * item if a common id is not found.
     *
     * @return {string}
     * The SVG representation of the rendered chart.
     *
     * @emits Highcharts.Chart#event:getSVG
     *
     * @requires modules/exporting
     */
    public getSVG(
        chartOptions?: Partial<Options>
    ): string {
        const chart = this.chart;
        let svg,
            seriesOptions: DeepPartial<SeriesTypeOptions>,
            // Copy the options and add extra options
            options: (Options | undefined) = merge<Options>(
                chart.options,
                chartOptions
            );

        // Use userOptions to make the options chain in series right (#3881)
        options.plotOptions = merge(
            chart.userOptions.plotOptions,
            chartOptions?.plotOptions
        );

        // ... and likewise with time, avoid that undefined time properties are
        // merged over legacy global time options
        options.time = merge(
            chart.userOptions.time,
            chartOptions?.time
        );

        // Create a sandbox where a new chart will be generated
        const sandbox = createElement('div', void 0, {
            position: 'absolute',
            top: '-9999em',
            width: chart.chartWidth + 'px',
            height: chart.chartHeight + 'px'
        }, doc.body);

        // Get the source size
        const cssWidth: string = chart.renderTo.style.width,
            cssHeight: string = chart.renderTo.style.height,
            sourceWidth: number = options.exporting?.sourceWidth ||
                options.chart.width ||
                (/px$/.test(cssWidth) && parseInt(cssWidth, 10)) ||
                (options.isGantt ? 800 : 600),
            sourceHeight: (number | string) = options.exporting?.sourceHeight ||
                options.chart.height ||
                (/px$/.test(cssHeight) && parseInt(cssHeight, 10)) ||
                400;

        // Override some options
        extend(options.chart, {
            animation: false,
            renderTo: sandbox,
            forExport: true,
            renderer: 'SVGRenderer',
            width: sourceWidth,
            height: sourceHeight
        });

        if (options.exporting) {
            options.exporting.enabled = false; // Hide buttons in print
        }
        delete options.data; // #3004

        // Prepare for replicating the chart
        options.series = [];
        chart.series.forEach(function (serie): void {
            seriesOptions = merge(serie.userOptions, { // #4912
                animation: false, // Turn off animation
                enableMouseTracking: false,
                showCheckbox: false,
                visible: serie.visible
            });

            // Used for the navigator series that has its own option set
            if (!seriesOptions.isInternal) {
                options?.series?.push(seriesOptions as SeriesOptions);
            }
        });

        const colls: Record<string, boolean> = {};
        chart.axes.forEach(function (axis): void {
            // Assign an internal key to ensure a one-to-one mapping (#5924)
            if (!axis.userOptions.internalKey) { // #6444
                axis.userOptions.internalKey = uniqueKey();
            }

            if (options && !axis.options.isInternal) {
                if (!colls[axis.coll]) {
                    colls[axis.coll] = true;
                    options[axis.coll] = [];
                }

                (options[axis.coll] as DeepPartial<AxisOptions>[]).push(
                    merge(axis.userOptions, {
                        visible: axis.visible,
                        // Force some options that could have be set directly on
                        // the axis while missing in the userOptions or options.
                        type: axis.type,
                        uniqueNames: axis.uniqueNames
                    }));
            }
        });

        // Make sure the `colorAxis` object of the `defaultOptions` isn't used
        // in the chart copy's user options, because a color axis should only be
        // added when the user actually applies it.
        options.colorAxis = chart.userOptions.colorAxis;

        // Generate the chart copy
        const chartCopy = new (chart.constructor as typeof Chart)(
            options,
            chart.callback
        );

        // Axis options and series options  (#2022, #3900, #5982)
        if (chartOptions) {
            type CollType = ('xAxis' | 'yAxis' | 'series');
            (['xAxis', 'yAxis', 'series'] as Array<CollType>).forEach(
                function (coll: CollType): void {
                    if (chartOptions[coll]) {
                        chartCopy.update({
                            [coll]: chartOptions[coll]
                        } as Partial<Options>);
                    }
                }
            );
        }

        // Reflect axis extremes in the export (#5924)
        chart.axes.forEach(function (axis): void {
            const axisCopy = find(chartCopy.axes, (copy: Axis): boolean =>
                copy.options.internalKey === axis.userOptions.internalKey
            );

            if (axisCopy) {
                const extremes = axis.getExtremes(),
                    // Make sure min and max overrides in the
                    // `exporting.chartOptions.xAxis` settings are reflected.
                    // These should override user-set extremes via zooming,
                    // scrollbar etc (#7873).
                    exportOverride = splat(chartOptions?.[axis.coll] || {})[0],
                    userMin = 'min' in exportOverride ?
                        exportOverride.min :
                        extremes.userMin,
                    userMax = 'max' in exportOverride ?
                        exportOverride.max :
                        extremes.userMax;

                if (
                    ((
                        typeof userMin !== 'undefined' &&
                        userMin !== axisCopy.min
                    ) || (
                        typeof userMax !== 'undefined' &&
                        userMax !== axisCopy.max
                    ))
                ) {
                    axisCopy.setExtremes(
                        userMin ?? void 0,
                        userMax ?? void 0,
                        true,
                        false
                    );
                }
            }
        });

        // Get the SVG from the container's innerHTML
        svg = chartCopy.exporting?.getChartHTML(
            chart.styledMode ||
            options.exporting?.applyStyleSheets
        ) || '';

        fireEvent(chart, 'getSVG', { chartCopy: chartCopy });

        svg = Exporting.sanitizeSVG(svg, options);

        // Free up memory
        options = void 0;
        chartCopy.destroy();
        discardElement(sandbox);

        return svg;
    }

    /**
     * Gets the SVG for export using the getSVG function with additional
     * options.
     *
     * @private
     * @function Highcharts.Exporting#getSVGForExport
     *
     * @param {Highcharts.ExportingOptions} [exportingOptions]
     * The exporting options.
     * @param {Highcharts.Options} [chartOptions]
     * Additional chart options for the exported chart.
     *
     * @return {string}
     * The SVG representation of the rendered chart.
     *
     * @requires modules/exporting
     */
    public getSVGForExport(
        exportingOptions?: ExportingOptions,
        chartOptions?: Partial<Options>
    ): string {
        const currentExportingOptions: ExportingOptions = this.options;
        return this.getSVG(merge(
            { chart: { borderRadius: 0 } },
            currentExportingOptions.chartOptions,
            chartOptions,
            {
                exporting: {
                    sourceWidth: (
                        exportingOptions?.sourceWidth ||
                        currentExportingOptions.sourceWidth
                    ),
                    sourceHeight: (
                        exportingOptions?.sourceHeight ||
                        currentExportingOptions.sourceHeight
                    )
                }
            }
        ));
    }

    /**
     * Analyze inherited styles from stylesheets and add them inline.
     *
     * @private
     * @function Highcharts.Exporting#inlineStyles
     *
     * @todo What are the border styles for text about? In general, text has a
     * lot of properties.
     *
     * @todo Make it work with IE9 and IE10.
     *
     * @requires modules/exporting
     */
    public inlineStyles(): void {
        const denylist = Exporting.inlineDenylist,
            allowlist = Exporting.inlineAllowlist, // For IE
            defaultStyles: Record<string, CSSObject> = {};
        let dummySVG: SVGElement;

        // Create an iframe where we read default styles without pollution from
        // this body
        const iframe = createElement(
            'iframe',
            void 0,
            {
                width: '1px',
                height: '1px',
                visibility: 'hidden'
            },
            doc.body
        ) as HTMLIFrameElement;

        const iframeDoc = iframe.contentWindow?.document;
        if (iframeDoc) {
            iframeDoc.body.appendChild(
                iframeDoc.createElementNS(SVG_NS, 'svg')
            );
        }

        /**
         * Call this on all elements and recurse to children.
         *
         * @private
         * @function recurse
         *
         * @param {Highcharts.HTMLDOMElement | Highcharts.SVGSVGElement} node
         * Element child.
         */
        function recurse(node: (HTMLDOMElement | SVGSVGElement)): void {
            const filteredStyles: CSSObject = {};
            let styles: CSSObject,
                parentStyles: (CSSObject | SVGAttributes),
                dummy: Element,
                denylisted: (boolean | undefined),
                allowlisted: (boolean | undefined),
                i: number;

            /**
             * Check computed styles and whether they are in the allow/denylist
             * for styles or attributes.
             *
             * @private
             * @function filterStyles
             *
             * @param {string | number | Highcharts.GradientColor | Highcharts.PatternObject | undefined} val
             * Style value.
             * @param {string} prop
             * Style property name.
             */
            function filterStyles(
                val: (
                    string |
                    number |
                    GradientColor |
                    PatternObject |
                    undefined
                ),
                prop: string
            ): void {

                // Check against allowlist & denylist
                denylisted = allowlisted = false;
                if (allowlist.length) {
                    // Styled mode in IE has a allowlist instead. Exclude all
                    // props not in this list.
                    i = allowlist.length;
                    while (i-- && !allowlisted) {
                        allowlisted = allowlist[i].test(prop);
                    }
                    denylisted = !allowlisted;
                }

                // Explicitly remove empty transforms
                if (prop === 'transform' && val === 'none') {
                    denylisted = true;
                }

                i = denylist.length;
                while (i-- && !denylisted) {
                    if (prop.length > RegexLimits.shortLimit) {
                        throw new Error('Input too long');
                    }
                    denylisted = (
                        denylist[i].test(prop) ||
                        typeof val === 'function'
                    );
                }

                if (!denylisted) {
                    // If parent node has the same style, it gets inherited, no
                    // need to inline it. Top-level props should be diffed
                    // against parent (#7687).
                    if (
                        (
                            (parentStyles as CSSObject)[
                                prop as keyof CSSObject
                            ] !== val ||
                            node.nodeName === 'svg'
                        ) &&
                        (defaultStyles[node.nodeName])[
                            prop as keyof CSSObject
                        ] !== val
                    ) {
                        // Attributes
                        if (
                            !Exporting.inlineToAttributes ||
                            Exporting.inlineToAttributes.indexOf(prop) !== -1
                        ) {
                            if (val) {
                                node.setAttribute(
                                    Exporting.hyphenate(prop), val as string
                                );
                            }
                        // Styles
                        } else {
                            (filteredStyles as Record<string, (string | number | GradientColor | PatternObject | undefined)>)[
                                prop
                            ] = val;
                        }
                    }
                }
            }

            if (
                iframeDoc &&
                node.nodeType === 1 &&
                Exporting.unstyledElements.indexOf(node.nodeName) === -1
            ) {
                styles =
                    win.getComputedStyle(node, null) as unknown as CSSObject;
                parentStyles = node.nodeName === 'svg' ?
                    {} :
                    win.getComputedStyle(
                        node.parentNode, null
                    ) as unknown as CSSObject;

                // Get default styles from the browser so that we don't have to
                // add these
                if (!defaultStyles[node.nodeName]) {
                    /*
                    If (!dummySVG) {
                        dummySVG = doc.createElementNS(H.SVG_NS, 'svg');
                        dummySVG.setAttribute('version', '1.1');
                        doc.body.appendChild(dummySVG);
                    }
                    */
                    dummySVG =
                        iframeDoc.getElementsByTagName(
                            'svg'
                        )[0] as unknown as SVGElement;
                    dummy = iframeDoc.createElementNS(
                        node.namespaceURI,
                        node.nodeName
                    );
                    dummySVG.appendChild(dummy);

                    // Get the defaults into a standard object (simple merge
                    // won't do)
                    const s = win.getComputedStyle(dummy, null),
                        defaults: Record<string, string> = {};
                    // eslint-disable-next-line @typescript-eslint/no-for-in-array
                    for (const key in s) {
                        if (
                            key.length < RegexLimits.shortLimit &&
                            typeof s[key] === 'string' &&
                            !/^\d+$/.test(key)
                        ) {
                            defaults[key] = s[key];
                        }
                    }
                    defaultStyles[node.nodeName] = defaults;

                    // Remove default fill, otherwise text disappears when
                    // exported
                    if (node.nodeName === 'text') {
                        delete defaultStyles.text.fill;
                    }
                    dummySVG.removeChild(dummy);
                }

                // Loop through all styles and add them inline if they are ok
                for (const p in styles) {
                    if (
                        // Some browsers put lots of styles on the prototype...
                        isFirefox ||
                        isMS ||
                        isSafari || // #16902
                        // ... Chrome puts them on the instance
                        Object.hasOwnProperty.call(styles, p)
                    ) {
                        filterStyles(styles[p as keyof CSSObject], p);
                    }
                }

                // Apply styles
                css(node, filteredStyles);

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
         * Remove the dummy objects used to get defaults.
         *
         * @private
         * @function tearDown
         */
        function tearDown(): void {
            dummySVG.parentNode.removeChild(dummySVG);
            // Remove trash from DOM that stayed after each exporting
            iframe.parentNode.removeChild(iframe);
        }

        recurse(this.chart.container.querySelector('svg') as SVGSVGElement);
        tearDown();
    }

    /**
     * Get SVG of chart prepared for client side export. This converts embedded
     * images in the SVG to data URIs. It requires the regular exporting module.
     * The options and chartOptions arguments are passed to the getSVGForExport
     * function.
     *
     * @private
     * @async
     * @function Highcharts.Exporting#localExport
     *
     * @param {Highcharts.ExportingOptions} exportingOptions
     * The exporting options.
     * @param {Highcharts.Options} chartOptions
     * Additional chart options for the exported chart.
     *
     * @return {Promise<string>}
     * The sanitized SVG.
     *
     * @requires modules/exporting
     */
    public async localExport(
        exportingOptions: ExportingOptions,
        chartOptions: Partial<Options>
    ): Promise<string | void> {
        const chart = this.chart,
            exporting = this,
            // After grabbing the SVG of the chart's copy container we need
            // to do sanitation on the SVG
            sanitize = (svg?: string): string => Exporting.sanitizeSVG(
                svg || '',
                chartCopyOptions
            ),
            // Return true if the SVG contains images with external data.
            // With the boost module there are `image` elements with encoded
            // PNGs, these are supported by svg2pdf and should pass (#10243)
            hasExternalImages = function (): boolean {
                return [].some.call(
                    chart.container.getElementsByTagName('image'),
                    function (image: HTMLDOMElement): boolean {
                        const href = image.getAttribute('href');
                        return (
                            href !== '' &&
                            typeof href === 'string' &&
                            href.indexOf('data:') !== 0
                        );
                    }
                );
            };

        let chartCopyContainer: (HTMLDOMElement | undefined),
            chartCopyOptions: Options,
            href: (string | null) = null,
            images: (Array<SVGImageElement> | HTMLCollectionOf<SVGImageElement> | undefined);

        // If we are on IE and in styled mode, add an allowlist to the
        // renderer for inline styles that we want to pass through. There
        // are so many styles by default in IE that we don't want to
        // denylist them all
        if (isMS && chart.styledMode && !Exporting.inlineAllowlist.length) {
            Exporting.inlineAllowlist.push(
                /^blockSize/,
                /^border/,
                /^caretColor/,
                /^color/,
                /^columnRule/,
                /^columnRuleColor/,
                /^cssFloat/,
                /^cursor/,
                /^fill$/,
                /^fillOpacity/,
                /^font/,
                /^inlineSize/,
                /^length/,
                /^lineHeight/,
                /^opacity/,
                /^outline/,
                /^parentRule/,
                /^rx$/,
                /^ry$/,
                /^stroke/,
                /^textAlign/,
                /^textAnchor/,
                /^textDecoration/,
                /^transform/,
                /^vectorEffect/,
                /^visibility/,
                /^x$/,
                /^y$/
            );
        }

        // Always fall back on:
        // - MS browsers: Embedded images JPEG/PNG, or any PDF
        // - Embedded images and PDF
        if (
            (
                isMS &&
                (
                    exportingOptions.type === 'application/pdf' ||
                    chart.container.getElementsByTagName('image').length &&
                    exportingOptions.type !== 'image/svg+xml'
                )
            ) || (
                exportingOptions.type === 'application/pdf' &&
                hasExternalImages()
            )
        ) {
            await this.fallbackToServer(
                exportingOptions,
                new Error(
                    'Image type not supported for this chart/browser.'
                )
            );
            return;
        }

        // Hook into getSVG to get a copy of the chart copy's container (#8273)
        const unbindGetSVG = addEvent(chart, 'getSVG', (
            e: { chartCopy: Chart }
        ): void => {
            chartCopyOptions = e.chartCopy.options;
            chartCopyContainer =
                e.chartCopy.container.cloneNode(true) as HTMLElement;
            images = chartCopyContainer && chartCopyContainer
                .getElementsByTagName('image') || [];
        });

        try {
            // Trigger hook to get chart copy
            this.getSVGForExport(exportingOptions, chartOptions);

            // Get the static array
            const imagesArray = images ? Array.from(images) : [];

            // Go through the images we want to embed
            for (const image of imagesArray) {
                href = image.getAttributeNS(
                    'http://www.w3.org/1999/xlink',
                    'href'
                );

                if (href) {
                    Exporting.objectURLRevoke = false;
                    const dataURL = await Exporting.imageToDataURL(
                        href,
                        exportingOptions?.scale || 1,
                        exportingOptions?.type || 'image/png'
                    );

                    // Change image href in chart copy
                    image.setAttributeNS(
                        'http://www.w3.org/1999/xlink',
                        'href',
                        dataURL
                    );

                // Hidden, boosted series have blank href (#10243)
                } else {
                    image.parentNode.removeChild(image);
                }
            }

            const svgElement = chartCopyContainer?.querySelector('svg');

            if (
                svgElement &&
                !exportingOptions.chartOptions?.chart?.style?.fontFamily
            ) {
                await Exporting.inlineFonts(svgElement);
            }

            // Sanitize the SVG
            const sanitizedSVG = sanitize(chartCopyContainer?.innerHTML);

            // Use SVG of chart copy. If SVG contains foreignObjects PDF fails
            // in all browsers and all exports except SVG will fail in IE, as
            // both CanVG and svg2pdf choke on this. Gracefully fall back.
            if (
                sanitizedSVG.indexOf('<foreignObject') > -1 &&
                exportingOptions.type !== 'image/svg+xml' &&
                (
                    isMS ||
                    exportingOptions.type === 'application/pdf'
                )
            ) {
                throw new Error(
                    'Image type not supported for charts with embedded HTML'
                );
            } else {
                // Trigger SVG download
                await exporting.downloadSVG(
                    sanitizedSVG,
                    extend(
                        { filename: exporting.getFilename() },
                        exportingOptions
                    )
                );
            }

            // Return the sanitized SVG
            return sanitizedSVG;
        } catch (error) {
            await this.fallbackToServer(
                exportingOptions,
                error as Error
            );
        } finally {
            // Clean up
            unbindGetSVG();
        }
    }

    /**
     * Move the chart container(s) to another div.
     *
     * @private
     * @function Highcharts.Exporting#moveContainers
     *
     * @param {Highcharts.HTMLDOMElement} moveTo
     * Move target.
     *
     * @requires modules/exporting
     */
    public moveContainers(
        moveTo: HTMLDOMElement
    ): void {
        const chart = this.chart,
            { scrollablePlotArea } = chart;

        (
            // When scrollablePlotArea is active (#9533)
            scrollablePlotArea ?
                [
                    scrollablePlotArea.fixedDiv,
                    scrollablePlotArea.scrollingContainer
                ] :
                [chart.container]
        ).forEach(function (div: HTMLDOMElement): void {
            moveTo.appendChild(div);
        });
    }

    /**
     * Clears away other elements in the page and prints the chart as it is
     * displayed. By default, when the exporting module is enabled, a context
     * button with a drop down menu in the upper right corner accesses this
     * function.
     *
     * @sample highcharts/members/chart-print/
     * Print from a HTML button
     *
     * @function Highcharts.Exporting#print
     *
     * @emits Highcharts.Chart#event:beforePrint
     * @emits Highcharts.Chart#event:afterPrint
     *
     * @requires modules/exporting
     */
    public print(): void {
        const chart = this.chart;

        // Block the button while in printing mode
        if (this.isPrinting) {
            return;
        }

        Exporting.printingChart = chart;
        if (!isSafari) {
            this.beforePrint();
        }

        // Give the browser time to draw WebGL content, an issue that randomly
        // appears (at least) in Chrome ~67 on the Mac (#8708).
        setTimeout((): void => {
            win.focus(); // #1510
            win.print();

            // Allow the browser to prepare before reverting
            if (!isSafari) {
                setTimeout((): void => {
                    chart.exporting?.afterPrint();
                }, 1000);
            }
        }, 1);
    }

    /**
     * Add the buttons on chart load.
     *
     * @private
     * @function Highcharts.Exporting#render
     *
     * @requires modules/exporting
     */
    public render(): void {
        const exporting = this,
            { chart, options } = exporting,
            isDirty = exporting?.isDirty || !exporting?.svgElements.length;

        exporting.buttonOffset = 0;
        if (exporting.isDirty) {
            exporting.destroy();
        }

        if (isDirty && options.enabled !== false) {
            exporting.events = [];

            exporting.group ||= chart.renderer.g('exporting-group').attr({
                zIndex: 3 // #4955, // #8392
            }).add();

            objectEach(options?.buttons, function (
                button: ExportingButtonOptions
            ): void {
                exporting.addButton(button);
            });
            exporting.isDirty = false;
        }
    }

    /**
     * Resolve CSS variables into hex colors.
     *
     * @private
     * @function Highcharts.Exporting#resolveCSSVariables
     *
     * @requires modules/exporting
     */
    public resolveCSSVariables(): void {
        Array.from(
            this.chart.container.querySelectorAll(
                '*'
            ) as NodeListOf<SVGDOMElement>
        ).forEach((element): void => {
            ['color', 'fill', 'stop-color', 'stroke'].forEach((prop): void => {
                const attrValue = element.getAttribute(prop);
                if (attrValue?.includes('var(')) {
                    element.setAttribute(
                        prop,
                        getComputedStyle(element).getPropertyValue(prop)
                    );
                }

                const styleValue = element.style?.[prop as any];
                if (styleValue?.includes('var(')) {
                    element.style[prop as any] =
                        getComputedStyle(element).getPropertyValue(prop);
                }
            });
        });
    }

    /**
     * Updates the exporting object with the provided exporting options.
     *
     * @private
     * @function Highcharts.Exporting#update
     *
     * @param {Highcharts.ExportingOptions} exportingOptions
     * The exporting options to update with.
     * @param {boolean} [redraw=true]
     * Whether to redraw or not.
     *
     * @requires modules/exporting
     */
    public update(
        exportingOptions: ExportingOptions,
        redraw?: boolean
    ): void {
        this.isDirty = true;
        merge(true, this.options, exportingOptions);
        if (pick(redraw, true)) {
            this.chart.redraw();
        }
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface Exporting extends ExportingBase {}

/* *
 *
 *  Class Namespace
 *
 * */

namespace Exporting {

    /* *
     *
     *  Declarations
     *
     * */

    export interface AfterPrintCallbackFunction {
        (chart: Chart, event: Event): void;
    }

    export interface BeforePrintCallbackFunction {
        (chart: Chart, event: Event): void;
    }

    export declare interface ChartAdditions {
        update(options: ExportingOptions, redraw?: boolean): void;
    }

    export interface DivElement extends HTMLDOMElement {
        hideTimer?: number;
        hideMenu(): void;
    }

    export interface DownloadSVGFunction {
        (
            svg: string,
            exportingOptions: ExportingOptions
        ): Promise<void>
    }

    export interface DownloadSVGEventArgs {
        svg: string;
        exportingOptions: ExportingOptions;
        exporting?: Exporting;
        defaultPrevented?: boolean;
        preventDefault?: Function;
    }

    export interface ErrorCallbackFunction {
        (options: ExportingOptions, err: Error): void;
    }

    export interface ExportEventCallback<T> {
        (this: T, eventArguments: (AnyRecord | Event)): (boolean | void | Promise<boolean | void>);
    }

    export interface ImageOptions {
        type: string;
        filename: string;
        scale: number;
        libURL: string;
    }

    export interface MenuObject {
        onclick?: ExportEventCallback<Chart>;
        separator?: boolean;
        text?: string;
        textKey?: string;
    }

    export interface PrintReverseInfoObject {
        childNodes: NodeListOf<ChildNode>;
        origDisplay: Array<(string | null)> ;
        resetParams?: [
            (number | null)?,
            (number | null)?,
            (boolean | Partial<AnimationOptions>)?
        ];
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Composition function.
     *
     * @private
     * @function Highcharts.Exporting#compose
     *
     * @param {ChartClass} ChartClass
     * Chart class.
     * @param {SVGRendererClass} SVGRendererClass
     * SVGRenderer class.
     *
     * @requires modules/exporting
     */
    export function compose(
        ChartClass: typeof Chart,
        SVGRendererClass: typeof SVGRenderer
    ): void {
        ExportingSymbols.compose(SVGRendererClass);
        Fullscreen.compose(ChartClass);

        // Check the composition registry for the Exporting
        if (!pushUnique(composed, 'Exporting')) {
            return;
        }

        // Adding wrappers for the deprecated functions
        extend(Chart.prototype, {
            exportChart: async function (
                this: Chart,
                exportingOptions?: ExportingOptions,
                chartOptions?: Options
            ): Promise<void> {
                await this.exporting?.exportChart(
                    exportingOptions,
                    chartOptions
                );
                return;
            },
            getChartHTML: function (
                this: Chart,
                applyStyleSheets?: boolean
            ): (string | void) {
                return this.exporting?.getChartHTML(applyStyleSheets);
            },
            getFilename: function (
                this: Chart
            ): (string | void) {
                return this.exporting?.getFilename();
            },
            getSVG: function (
                this: Chart,
                chartOptions?: Partial<Options>
            ): (string | void) {
                return this.exporting?.getSVG(chartOptions);
            },
            print: function (
                this: Chart
            ): void {
                return this.exporting?.print();
            }
        });

        ChartClass.prototype.callbacks.push(chartCallback);
        addEvent(
            ChartClass,
            'afterInit',
            onChartAfterInit
        );
        addEvent(
            ChartClass,
            'layOutTitle',
            onChartLayOutTitle
        );

        if (isSafari) {
            win.matchMedia('print').addListener(
                function (
                    this: MediaQueryList,
                    mqlEvent: MediaQueryListEvent
                ): void {
                    if (!Exporting.printingChart) {
                        return void 0;
                    }
                    if (mqlEvent.matches) {
                        Exporting.printingChart.exporting?.beforePrint();
                    } else {
                        Exporting.printingChart.exporting?.afterPrint();
                    }
                }
            );
        }

        // Update with defaults of the exporting module
        setOptions(ExportingDefaults);
    }

    /**
     * Function that is added to the callbacks array that runs on chart load.
     *
     * @private
     * @function Highcharts#chartCallback
     *
     * @param {Highcharts.Chart} chart
     * The chart instance.
     *
     * @requires modules/exporting
     */
    function chartCallback(
        chart: Chart
    ): void {
        const exporting = chart.exporting;
        if (exporting) {
            exporting.render();

            // Add the exporting buttons on each chart redraw
            addEvent(chart, 'redraw', function (): void {
                this.exporting?.render();
            });

            // Destroy the export elements at chart destroy
            addEvent(chart, 'destroy', function (): void {
                this.exporting?.destroy();
            });
        }

        // Uncomment this to see a button directly below the chart, for quick
        // testing of export
        // let button, viewImage, viewSource;
        // if (!chart.renderer.forExport) {
        //     viewImage = function (): void {
        //         const div = doc.createElement('div');
        //         div.innerHTML = chart.exporting?.getSVGForExport() || '';
        //         chart.renderTo.parentNode.appendChild(div);
        //     };

        //     viewSource = function (): void {
        //         const pre = doc.createElement('pre');
        //         pre.innerHTML = chart.exporting?.getSVGForExport()
        //             .replace(/</g, '\n&lt;')
        //             .replace(/>/g, '&gt;') || '';
        //         chart.renderTo.parentNode.appendChild(pre);
        //     };

        //     viewImage();

        //     // View SVG Image
        //     button = doc.createElement('button');
        //     button.innerHTML = 'View SVG Image';
        //     chart.renderTo.parentNode.appendChild(button);
        //     button.onclick = viewImage;

        //     // View SVG Source
        //     button = doc.createElement('button');
        //     button.innerHTML = 'View SVG Source';
        //     chart.renderTo.parentNode.appendChild(button);
        //     button.onclick = viewSource;
        // }
    }

    /**
     * Add update methods to handle chart.update and chart.exporting.update and
     * chart.navigation.update. These must be added to the chart instance rather
     * than the Chart prototype in order to use the chart instance inside the
     * update function.
     *
     * @private
     * @function Highcharts#onChartAfterInit
     *
     * @requires modules/exporting
     */
    function onChartAfterInit(
        this: Chart
    ): void {
        const chart = this;

        // Create the exporting instance
        if (chart.options.exporting) {
            /**
             * Exporting object.
             *
             * @name Highcharts.Chart#exporting
             * @type {Highcharts.Exporting}
             */
            chart.exporting = new Exporting(
                chart,
                chart.options.exporting
            );

            // Register update() method for navigation. Cannot be set the same
            // way as for exporting, because navigation options are shared with
            // bindings which has separate update() logic.
            ChartNavigationComposition
                .compose(chart).navigation
                .addUpdate((
                    options: NavigationOptions,
                    redraw?: boolean
                ): void => {
                    if (chart.exporting) {
                        chart.exporting.isDirty = true;
                        merge(true, chart.options.navigation, options);
                        if (pick(redraw, true)) {
                            chart.redraw();
                        }
                    }
                });
        }
    }

    /**
     * On layout of titles (title, subtitle and caption), adjust the `alignTo`
     * box to avoid the context menu button.
     *
     * @private
     * @function Highcharts#onChartLayOutTitle
     *
     * @requires modules/exporting
     */
    function onChartLayOutTitle(
        this: Chart,
        { alignTo, key, textPxLength }: Chart.LayoutTitleEventObject
    ): void {
        const exportingOptions = this.options.exporting,
            { align, buttonSpacing = 0, verticalAlign, width = 0 } = merge(
                this.options.navigation?.buttonOptions,
                exportingOptions?.buttons?.contextButton
            ),
            space = alignTo.width - textPxLength,
            widthAdjust = width + buttonSpacing;

        if (
            (exportingOptions?.enabled ?? true) &&
            key === 'title' &&
            align === 'right' &&
            verticalAlign === 'top'
        ) {
            if (space < 2 * widthAdjust) {
                if (space < widthAdjust) {
                    alignTo.width -= widthAdjust;
                } else if (this.title?.alignValue !== 'left') {
                    alignTo.x -= widthAdjust - space / 2;
                }
            }
        }
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default Exporting;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Gets fired after a chart is printed through the context menu item or the
 * Chart.print method.
 *
 * @callback Highcharts.ExportingAfterPrintCallbackFunction
 *
 * @param {Highcharts.Chart} this
 * The chart on which the event occurred.
 * @param {global.Event} event
 * The event that occurred.
 */

/**
 * Gets fired before a chart is printed through the context menu item or the
 * Chart.print method.
 *
 * @callback Highcharts.ExportingBeforePrintCallbackFunction
 *
 * @param {Highcharts.Chart} this
 * The chart on which the event occurred.
 * @param {global.Event} event
 * The event that occurred.
 */

/**
 * Function to call if the offline-exporting module fails to export a chart on
 * the client side.
 *
 * @callback Highcharts.ExportingErrorCallbackFunction
 *
 * @param {Highcharts.ExportingOptions} options
 * The exporting options.
 * @param {global.Error} err
 * The error from the module.
 */

/**
 * Definition for a menu item in the context menu.
 *
 * @interface Highcharts.ExportingMenuObject
 *//**
 * The text for the menu item.
 *
 * @name Highcharts.ExportingMenuObject#text
 * @type {string | undefined}
 *//**
 * If internationalization is required, the key to a language string.
 *
 * @name Highcharts.ExportingMenuObject#textKey
 * @type {string | undefined}
 *//**
 * The click handler for the menu item.
 *
 * @name Highcharts.ExportingMenuObject#onclick
 * @type {Highcharts.EventCallbackFunction<Highcharts.Chart> | undefined}
 *//**
 * Indicates a separator line instead of an item.
 *
 * @name Highcharts.ExportingMenuObject#separator
 * @type {boolean | undefined}
 */

/**
 * Possible MIME types for exporting.
 *
 * @typedef {"image/png" | "image/jpeg" | "application/pdf" | "image/svg+xml"} Highcharts.ExportingMimeTypeValue
 */

(''); // Keeps doclets above in transpiled file

/* *
 *
 *  API Options
 *
 * */

/**
 * Fires after a chart is printed through the context menu item or the
 * `Chart.print` method.
 *
 * @sample highcharts/chart/events-beforeprint-afterprint/
 * Rescale the chart to print
 *
 * @type {Highcharts.ExportingAfterPrintCallbackFunction}
 * @since 4.1.0
 * @context Highcharts.Chart
 * @requires modules/exporting
 * @apioption chart.events.afterPrint
 */

/**
 * Fires before a chart is printed through the context menu item or
 * the `Chart.print` method.
 *
 * @sample highcharts/chart/events-beforeprint-afterprint/
 * Rescale the chart to print
 *
 * @type {Highcharts.ExportingBeforePrintCallbackFunction}
 * @since 4.1.0
 * @context Highcharts.Chart
 * @requires modules/exporting
 * @apioption chart.events.beforePrint
 */

(''); // Keeps doclets above in transpiled file
