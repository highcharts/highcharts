/* *
 *
 *  Client side exporting module
 *
 *  (c) 2015-2026 Highsoft AS
 *  Author: Torstein Honsi / Oystein Moseng
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

import type Exporting from '../Exporting/Exporting';
import type {
    DOMElementType,
    HTMLDOMElement,
    SVGDOMElement
} from '../../Core/Renderer/DOMElementType';
import type ExportingOptions from '../Exporting/ExportingOptions';
import type { PdfFontOptions } from '../Exporting/ExportingOptions';
import type Options from '../../Core/Options';

import AST from '../../Core/Renderer/HTML/AST.js';
import Chart from '../../Core/Chart/Chart.js';
import D from '../../Core/Defaults.js';
const {
    getOptions,
    setOptions
} = D;
import DownloadURL from '../../Shared/DownloadURL.js';
const {
    downloadURL,
    getScript
} = DownloadURL;
import G from '../../Core/Globals.js';
const {
    composed,
    doc,
    win
} = G;
import OfflineExportingDefaults from './OfflineExportingDefaults.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    extend,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartBase' {
    interface ChartBase {
        /**
         * Deprecated in favor of [Exporting.exportChart](https://api.highcharts.com/class-reference/Highcharts.Exporting#exportChart).
         *
         * @deprecated */
        exportChartLocal(
            exportingOptions?: ExportingOptions,
            chartOptions?: Options
        ): Promise<void>;
    }
}

declare module '../../Core/GlobalsBase' {
    interface GlobalsBase {
        Exporting: typeof Exporting
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
     *  Functions
     *
     * */

    /**
     * Composition function.
     *
     * @private
     * @function compose
     *
     * @param {ExportingClass} ExportingClass
     * Exporting class.
     *
     * @requires modules/exporting
     * @requires modules/offline-exporting
     */
    export function compose(
        ExportingClass: typeof Exporting
    ): void {
        // Add the downloadSVG event to the Exporting class for local PDF export
        addEvent(
            ExportingClass,
            'downloadSVG',
            async function (
                e: Exporting.DownloadSVGEventArgs
            ): Promise<void> {
                const { svg, exportingOptions, exporting, preventDefault } = e;

                // Check if PDF export is requested
                if (exportingOptions?.type === 'application/pdf') {
                    // Prevent the default export behavior
                    preventDefault?.();

                    // Run the PDF local export
                    try {
                        // Get the final image options
                        const {
                            type,
                            filename,
                            scale,
                            libURL
                        } = G.Exporting.prepareImageOptions(exportingOptions);

                        // Local PDF download
                        if (type === 'application/pdf') {
                            // Must load pdf libraries first if not found. Don't
                            // destroy the object URL yet since we are doing
                            // things asynchronously
                            if (!win.jspdf?.jsPDF) {
                                // Get jspdf
                                await getScript(`${libURL}jspdf.js`);
                                // Get svg2pdf
                                await getScript(`${libURL}svg2pdf.js`);
                            }

                            // Call the PDF download if SVG element found
                            await downloadPDF(
                                svg,
                                scale,
                                filename,
                                exportingOptions?.pdfFont
                            );
                        }
                    } catch (error) {
                        // Try to fallback to the server
                        await exporting?.fallbackToServer(
                            exportingOptions,
                            error as Error
                        );
                    }
                }
            }
        );

        // Check the composition registry for the OfflineExporting
        if (!pushUnique(composed, 'OfflineExporting')) {
            return;
        }

        // Adding wrappers for the deprecated functions
        extend(Chart.prototype, {
            exportChartLocal: async function (
                this: Chart,
                exportingOptions?: ExportingOptions,
                chartOptions?: Options
            ): Promise<void> {
                await this.exporting?.exportChart(
                    exportingOptions,
                    chartOptions
                );
                return;
            }
        });

        // Update with defaults of the offline exporting module
        setOptions(OfflineExportingDefaults);

        // Additionaly, extend the menuItems with the offline exporting variants
        const menuItems =
            getOptions().exporting?.buttons?.contextButton?.menuItems;
        menuItems && menuItems.push('downloadPDF');

    }

    /**
     * Get data URL to an image of an SVG and call download on it options
     * object:
     * - **filename:** Name of resulting downloaded file without extension.
     * Default is `chart`.
     *
     * - **type:** File type of resulting download. Default is `image/png`.
     *
     * - **scale:** Scaling factor of downloaded image compared to source.
     * Default is `1`.
     * - **libURL:** URL pointing to location of dependency scripts to download
     * on demand. Default is the exporting.libURL option of the global
     * Highcharts options pointing to our server.
     *
     * @function Highcharts.downloadSVGLocal
     * @deprecated
     *
     * @param {string} svg
     * The generated SVG
     *
     * @param {Highcharts.ExportingOptions} options
     * The exporting options
     *
     */
    export async function downloadSVGLocal(
        svg: string,
        options: ExportingOptions
    ): Promise<void> {
        await G.Exporting.prototype.downloadSVG.call(
            void 0,
            svg,
            options
        );
    }

    /**
     * Converts an SVG string into a PDF file and triggers its download. This
     * function processes the SVG, applies necessary font adjustments, converts
     * it to a PDF, and initiates the file download.
     *
     * @private
     * @async
     * @function downloadPDF
     *
     * @param {string} svg
     * A string representation of the SVG markup to be converted into a PDF.
     * @param {number} scale
     * The scaling factor for the PDF output.
     * @param {string} filename
     * The name of the downloaded PDF file.
     * @param {Highcharts.PdfFontOptions} [pdfFont]
     * An optional object specifying URLs for different font variants (normal,
     * bold, italic, bolditalic).
     *
     * @return {Promise<void>}
     * A promise that resolves when the PDF has been successfully generated and
     * downloaded.
     *
     * @requires modules/exporting
     * @requires modules/offline-exporting
     */
    async function downloadPDF(
        svg: string,
        scale: number,
        filename: string,
        pdfFont?: PdfFontOptions
    ): Promise<void> {
        const svgNode = preparePDF(svg, pdfFont);
        if (svgNode) {
            // Loads all required fonts
            await loadPdfFonts(svgNode, pdfFont);

            // Transform SVG to PDF
            const pdfData = await svgToPdf(svgNode, 0, scale);

            // Download the PDF
            downloadURL(pdfData, filename);
        }
    }

    /**
     * Loads and registers custom fonts for PDF export if non-ASCII characters
     * are detected in the given SVG element. This function ensures that text
     * content with special characters is properly rendered in the exported PDF.
     *
     * It fetches font files (if provided in `pdfFont`), converts them to
     * base64, and registers them with jsPDF.
     *
     * @private
     * @function loadPdfFonts
     *
     * @param {SVGElement} svgElement
     * The generated SVG element containing the text content to be exported.
     * @param {Highcharts.PdfFontOptions} [pdfFont]
     * An optional object specifying URLs for different font variants (normal,
     * bold, italic, bolditalic). If non-ASCII characters are not detected,
     * fonts are not loaded.
     *
     * @requires modules/exporting
     * @requires modules/offline-exporting
     */
    async function loadPdfFonts(
        svgElement: SVGElement,
        pdfFont?: PdfFontOptions
    ): Promise<void> {
        const hasNonASCII = (s: string): boolean => (
            // eslint-disable-next-line no-control-regex
            /[^\u0000-\u007F\u200B]+/.test(s)
        );

        // Register an event in order to add the font once jsPDF is initialized
        const addFont = (
            variant: ('bold' | 'bolditalic' | 'italic' | 'normal'),
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

                    if (!this.getFontList()?.HighchartsFont) {
                        this.setFont('HighchartsFont');
                    }
                }
            ]);
        };

        // If there are no non-ASCII characters in the SVG, do not use bother
        // downloading the font files
        if (pdfFont && !hasNonASCII(svgElement.textContent || '')) {
            pdfFont = void 0;
        }

        // Add new font if the URL is declared, #6417
        const variants = ['normal', 'italic', 'bold', 'bolditalic'] as
            ('bold' | 'bolditalic' | 'italic' | 'normal')[];

        // Shift the first element off the variants and add as a font.
        // Then asynchronously trigger the next variant until variants are empty
        let normalBase64: (string | undefined);

        for (const variant of variants) {
            const url = pdfFont?.[variant];
            if (url) {
                try {
                    const response = await win.fetch(url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch font: ${url}`);
                    }
                    const blob = await response.blob(),
                        reader = new FileReader();

                    const base64: string = await new Promise((
                        resolve,
                        reject
                    ): void => {
                        reader.onloadend = (): void => {
                            if (typeof reader.result === 'string') {
                                resolve(reader.result.split(',')[1]);
                            } else {
                                reject(
                                    new Error('Failed to read font as base64')
                                );
                            }
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                    addFont(variant, base64);

                    if (variant === 'normal') {
                        normalBase64 = base64;
                    }
                } catch {
                    // If fetch or reading fails, fallback to next variant
                }
            } else {
                // For other variants, fall back to normal text weight/style
                if (normalBase64) {
                    addFont(variant, normalBase64);
                }
            }
        }
    }

    /**
     * Prepares an SVG for PDF export by ensuring proper text styling and
     * removing unnecessary elements. This function extracts an SVG element from
     * a given SVG string, applies font styles inherited from parent elements,
     * and removes text outlines and title elements to improve PDF rendering.
     *
     * @private
     * @function preparePDF
     *
     * @param {string} svg
     * A string representation of the SVG markup.
     * @param {Highcharts.PdfFontOptions} [pdfFont]
     * An optional object specifying URLs for different font variants (normal,
     * bold, italic, bolditalic). If provided, the text elements are assigned a
     * custom PDF font.
     *
     * @return {SVGSVGElement | null}
     * Returns the parsed SVG element from the container or `null` if the SVG is
     * not found.
     *
     * @requires modules/exporting
     * @requires modules/offline-exporting
     */
    function preparePDF(
        svg: string,
        pdfFont?: PdfFontOptions
    ): (SVGSVGElement | null) {
        const dummySVGContainer = doc.createElement('div');
        AST.setElementHTML(dummySVGContainer, svg);
        const textElements = dummySVGContainer.getElementsByTagName('text'),
            // Copy style property to element from parents if it's not there.
            // Searches up hierarchy until it finds prop, or hits the chart
            // container
            setStylePropertyFromParents = function (
                el: DOMElementType,
                propName: ('fontFamily' | 'fontSize')
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
                    curParent = curParent.parentNode;
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

            el.style.fontFamily = pdfFont?.normal ?
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
        return dummySVGContainer.querySelector('svg');
    }

    /**
     * Transform from PDF to SVG.
     *
     * @async
     * @private
     * @function svgToPdf
     *
     * @param {Highcharts.SVGElement} svgElement
     * The SVG element to convert.
     * @param {number} margin
     * The margin to apply.
     * @param {number} scale
     * The scale of the SVG.
     *
     * @requires modules/exporting
     * @requires modules/offline-exporting
     */
    async function svgToPdf(
        svgElement: SVGElement,
        margin: number,
        scale: number
    ): Promise<string> {
        const width = (Number(svgElement.getAttribute('width')) + 2 * margin) *
            scale,
            height = (Number(svgElement.getAttribute('height')) + 2 * margin) *
                scale,
            pdfDoc = new win.jspdf.jsPDF( // eslint-disable-line new-cap
                // Setting orientation to portrait if height exceeds width
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
                node.parentNode.removeChild(node);
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

        // Transform from PDF to SVG
        await pdfDoc.svg(svgElement, {
            x: 0,
            y: 0,
            width,
            height,
            removeInvalid: true
        });

        // Return the output
        return pdfDoc.output('datauristring');
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default OfflineExporting;
