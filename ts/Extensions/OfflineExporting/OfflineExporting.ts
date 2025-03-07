/* *
 *
 *  Client side exporting module
 *
 *  (c) 2015 Torstein Honsi / Oystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 * Imports
 *
 * */

import type {
    DOMElementType,
    HTMLDOMElement,
    SVGDOMElement
} from '../../Core/Renderer/DOMElementType';
import type Chart from '../../Core/Chart/Chart';
import type ExportingOptions from '../Exporting/ExportingOptions';
import type Options from '../../Core/Options';

import AST from '../../Core/Renderer/HTML/AST.js';
import D from '../../Core/Defaults.js';
const { defaultOptions } = D;
import DownloadURL from '../DownloadURL.js';
const { downloadURL } = DownloadURL;
import Exporting from '../Exporting/Exporting.js';
import H from '../../Core/Globals.js';
const {
    doc,
    win
} = H;
import HU from '../../Core/HttpUtilities.js';
const { ajax } = HU;
import OfflineExportingDefaults from './OfflineExportingDefaults.js';
import U from '../../Core/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike' {
    interface ChartLike {
        exportChartLocal(
            exportingOptions?: ExportingOptions,
            chartOptions?: Partial<Options>
        ): void;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace OfflineExporting {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class ChartComposition extends Chart {
        exportChartLocal(
            exportingOptions?: ExportingOptions,
            chartOptions?: Partial<Options>
        ): void;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Extends OfflineExporting with Chart.
     * @private
     */
    export function compose<T extends typeof Chart>(
        ChartClass: T
    ): (typeof ChartComposition & T) {
        const chartProto = ChartClass.prototype as ChartComposition;

        if (!chartProto.exportChartLocal) {
            chartProto.exportChartLocal = exportChartLocal;

            // Extend the default options to use the local exporter logic
            U.merge(true, defaultOptions.exporting, OfflineExportingDefaults);
        }

        return ChartClass as (typeof ChartComposition & T);
    }

    /**
     * Get data URL to an image of an SVG and call download on it options
     * object:
     *
     * - **filename:** Name of resulting downloaded file without extension.
     * Default is `chart`.
     * - **type:** File type of resulting download. Default is `image/png`.
     * - **scale:** Scaling factor of downloaded image compared to source.
     * Default is `1`.
     * - **libURL:** URL pointing to location of dependency scripts to download
     * on demand. Default is the exporting.libURL option of the global
     * Highcharts options pointing to our server.
     *
     * @function Highcharts.downloadSVGLocal
     *
     * @param {string} svg
     * The generated SVG
     *
     * @param {Highcharts.ExportingOptions} options
     * The exporting options
     *
     * @param {Function} failCallback
     * The callback function in case of errors
     *
     * @param {Function} [successCallback]
     * The callback function in case of success
     *
     */
    export function downloadSVGLocal(
        svg: string,
        options: ExportingOptions,
        failCallback: Function,
        successCallback?: Function
    ): void {
        const dummySVGContainer = doc.createElement('div'),
            imageType = options.type || 'image/png',
            filename = (
                (options.filename || 'chart') +
                '.' +
                (
                    imageType === 'image/svg+xml' ?
                        'svg' : imageType.split('/')[1]
                )
            ),
            scale = options.scale || 1;
        let libURL = (
                options.libURL || (defaultOptions.exporting as any).libURL
            ),
            pdfFont = options.pdfFont;

        // Allow libURL to end with or without fordward slash
        libURL = libURL.slice(-1) !== '/' ? libURL + '/' : libURL;

        /*
         * Detect if we need to load TTF fonts for the PDF, then load them and
         * proceed.
         *
         * @private
         */
        const loadPdfFonts = (
            svgElement: SVGElement,
            callback: Function
        ): void => {

            const hasNonASCII = (s: string): boolean => (
                // eslint-disable-next-line no-control-regex
                /[^\u0000-\u007F\u200B]+/.test(s)
            );

            // Register an event in order to add the font once jsPDF is
            // initialized
            const addFont = (
                variant: 'bold'|'bolditalic'|'italic'|'normal',
                base64: string
            ): void => {
                win.jspdf.jsPDF.API.events.push([
                    'initialized',
                    function (): void {
                        this.addFileToVFS(variant, base64);
                        this.addFont(
                            variant,
                            'HighchartsFont',
                            variant
                        );
                        if (!(this as any).getFontList().HighchartsFont) {
                            this.setFont('HighchartsFont');
                        }
                    }
                ]);
            };

            // If there are no non-ASCII characters in the SVG, do not use
            // bother downloading the font files
            if (pdfFont && !hasNonASCII(svgElement.textContent || '')) {
                pdfFont = void 0;
            }


            // Add new font if the URL is declared, #6417.
            const variants = ['normal', 'italic', 'bold', 'bolditalic'] as
                ('bold'|'bolditalic'|'italic'|'normal')[];

            // Shift the first element off the variants and add as a font.
            // Then asynchronously trigger the next variant until calling the
            // callback when the variants are empty.
            let normalBase64: string|undefined;
            const shiftAndLoadVariant = (): void => {
                const variant = variants.shift();

                // All variants shifted and possibly loaded, proceed
                if (!variant) {
                    return callback();
                }

                const url = pdfFont && pdfFont[variant];

                if (url) {
                    ajax({
                        url,
                        responseType: 'blob',
                        success: (data, xhr): void => {
                            const reader = new FileReader();
                            reader.onloadend = function (): void {
                                if (typeof this.result === 'string') {
                                    const base64 = this.result.split(',')[1];
                                    addFont(variant, base64);

                                    if (variant === 'normal') {
                                        normalBase64 = base64;
                                    }
                                }
                                shiftAndLoadVariant();
                            };

                            reader.readAsDataURL(xhr.response);
                        },
                        error: shiftAndLoadVariant
                    });
                } else {
                    // For other variants, fall back to normal text weight/style
                    if (normalBase64) {
                        addFont(variant, normalBase64);
                    }
                    shiftAndLoadVariant();
                }
            };
            shiftAndLoadVariant();
        };

        /*
         * @private
         */
        const downloadPDF = (): void => {
            AST.setElementHTML(dummySVGContainer, svg);
            const textElements = dummySVGContainer.getElementsByTagName('text'),
                // Copy style property to element from parents if it's not
                // there. Searches up hierarchy until it finds prop, or hits the
                // chart container.
                setStylePropertyFromParents = function (
                    el: DOMElementType,
                    propName: 'fontFamily'|'fontSize'
                ): void {
                    let curParent = el;

                    while (curParent && curParent !== dummySVGContainer) {
                        if (curParent.style[propName]) {
                            let value = curParent.style[propName];
                            if (propName === 'fontSize' && /em$/.test(value)) {
                                value = Math.round(
                                    parseFloat(value) * 16
                                ) + 'px';
                            }
                            el.style[propName] = value;
                            break;
                        }
                        curParent = curParent.parentNode as any;
                    }
                };
            let titleElements,
                outlineElements;

            // Workaround for the text styling. Making sure it does pick up
            // settings for parent elements.
            [].forEach.call(textElements, function (el: SVGDOMElement): void {
                // Workaround for the text styling. making sure it does pick up
                // the root element
                (['fontFamily', 'fontSize'] as ['fontFamily', 'fontSize'])
                    .forEach((property): void => {
                        setStylePropertyFromParents(el, property);
                    });

                el.style.fontFamily = pdfFont && pdfFont.normal ?
                    // Custom PDF font
                    'HighchartsFont' :
                    // Generic font (serif, sans-serif etc)
                    String(
                        el.style.fontFamily &&
                        el.style.fontFamily.split(' ').splice(-1)
                    );

                // Workaround for plotband with width, removing title from text
                // nodes
                titleElements = el.getElementsByTagName('title');
                [].forEach.call(titleElements, function (
                    titleElement: HTMLDOMElement
                ): void {
                    el.removeChild(titleElement);
                });

                // Remove all .highcharts-text-outline elements, #17170
                outlineElements =
                    el.getElementsByClassName('highcharts-text-outline');
                while (outlineElements.length > 0) {
                    const outline = outlineElements[0];
                    if (outline.parentNode) {
                        outline.parentNode.removeChild(outline);
                    }
                }
            });


            const svgNode = dummySVGContainer.querySelector('svg');
            if (svgNode) {
                loadPdfFonts(svgNode, (): void => {
                    svgToPdf(
                        svgNode,
                        0,
                        scale,
                        (pdfData: string): void => {
                            try {
                                downloadURL(pdfData, filename);
                                if (successCallback) {
                                    successCallback();
                                }
                            } catch (e) {
                                failCallback(e);
                            }
                        }
                    );
                });
            }

        };

        if (imageType === 'application/pdf') {
            if (win.jspdf && win.jspdf.jsPDF) {
                downloadPDF();
            } else {
                // Must load pdf libraries first. // Don't destroy the object
                // URL yet since we are doing things asynchronously. A cleaner
                // solution would be nice, but this will do for now.
                Exporting.getScript(libURL + 'jspdf.js', function (): void {
                    Exporting.getScript(libURL + 'svg2pdf.js', downloadPDF);
                });
            }
        }
    }

    /**
     * Exporting and offline-exporting modules required. Export a chart to PDF
     * locally in the user's browser.
     *
     * @function Highcharts.Chart#exportChartLocal
     *
     * @param {Highcharts.ExportingOptions} [exportingOptions]
     * Exporting options, the same as in {@link Highcharts.Chart#exportChart}.
     *
     * @param {Highcharts.Options} [chartOptions]
     * Additional chart options for the exported chart. For example a different
     * background color can be added here, or `dataLabels` for export only.
     *
     * @requires modules/exporting
     * @requires modules/offline-exporting
     */
    function exportChartLocal(
        this: Chart,
        exportingOptions?: ExportingOptions,
        chartOptions?: Partial<Options>
    ): void {
        Exporting.exportChartLocalCore(
            OfflineExporting.downloadSVGLocal,
            this as Exporting.ChartComposition,
            exportingOptions,
            chartOptions
        );
    }

    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    export function svgToPdf(
        svgElement: SVGElement,
        margin: number,
        scale: number,
        callback: Function
    ): void {
        const width = (Number(svgElement.getAttribute('width')) + 2 * margin) *
            scale,
            height = (Number(svgElement.getAttribute('height')) + 2 * margin) *
                scale,
            pdfDoc = new win.jspdf.jsPDF( // eslint-disable-line new-cap
                // setting orientation to portrait if height exceeds width
                height > width ? 'p' : 'l',
                'pt',
                [width, height]
            );

        // Workaround for #7090, hidden elements were drawn anyway. It comes
        // down to https://github.com/yWorks/svg2pdf.js/issues/28. Check this
        // later.
        [].forEach.call(
            svgElement.querySelectorAll('*[visibility="hidden"]'),
            function (node: SVGDOMElement): void {
                (node.parentNode as any).removeChild(node);
            }
        );

        // Workaround for #13948, multiple stops in linear gradient set to 0
        // causing error in Acrobat
        const gradients = svgElement.querySelectorAll('linearGradient');
        for (let index = 0; index < gradients.length; index++) {
            const gradient = gradients[index];
            const stops = gradient.querySelectorAll('stop');
            let i = 0;
            while (
                i < stops.length &&
                stops[i].getAttribute('offset') === '0' &&
                stops[i + 1].getAttribute('offset') === '0'
            ) {
                stops[i].remove();
                i++;
            }
        }

        // Workaround for #15135, zero width spaces, which Highcharts uses
        // to break lines, are not correctly rendered in PDF. Replace it
        // with a regular space and offset by some pixels to compensate.
        [].forEach.call(
            svgElement.querySelectorAll('tspan'),
            (tspan: SVGDOMElement): void => {
                if (tspan.textContent === '\u200B') {
                    tspan.textContent = ' ';
                    tspan.setAttribute('dx', -5);
                }
            }
        );

        pdfDoc.svg(svgElement, {
            x: 0,
            y: 0,
            width,
            height,
            removeInvalid: true
        }).then(():void => callback(pdfDoc.output('datauristring')));
    }
}

/* *
 *
 * Default Export
 *
 * */

export default OfflineExporting;
