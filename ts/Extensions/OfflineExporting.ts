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

/* global MSBlobBuilder */

import type {
    DOMElementType,
    HTMLDOMElement,
    SVGDOMElement
} from '../Core/Renderer/DOMElementType';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
const {
    win,
    doc
} = H;
import '../Core/Options.js';
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    error,
    extend,
    fireEvent,
    getOptions,
    merge
} = U;

declare module '../Core/Chart/ChartLike' {
    interface ChartLike {
        unbindGetSVG?: Function;
        exportChartLocal(
            exportingOptions?: Highcharts.ExportingOptions,
            chartOptions?: Highcharts.Options
        ): void;
        getSVGForLocalExport(
            options: Highcharts.ExportingOptions,
            chartOptions: Highcharts.Options,
            failCallback: Function,
            successCallback: Function
        ): void;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface ScriptOnLoadCallbackFunction {
            (this: GlobalEventHandlers, ev: Event): void;
        }
        interface SVGRenderer {
            inlineWhitelist?: Array<RegExp>;
        }
        let CanVGRenderer: object;
        function downloadSVGLocal(
            svg: string,
            options: ExportingOptions,
            failCallback: Function,
            successCallback?: Function
        ): void;
        function imageToDataUrl(
            imageURL: string,
            imageType: string,
            callbackArgs: {
                imageElement?: HTMLDOMElement;
            },
            scale: number,
            successCallback: Function,
            taintedCallback: Function,
            noCanvasSupportCallback: Function,
            failedLoadCallback: Function,
            finallyCallback?: Function
        ): void;
        function svgToDataUrl(svg: string): string;
    }
    interface CanvasRenderingContext2D {
        drawSvg: Function;
    }
    interface HTMLCanvasElement {
        /** @deprecated */
        msToBlob: Function;
    }
    interface Window {
        canvg: unknown;
        jsPDF: typeof jsPDF;
        svg2pdf: Function;
    }
    class jsPDF { // eslint-disable-line @typescript-eslint/class-name-casing
        constructor (a: string, b: string, c: Array<number>);
        output: Function;
    }
}

import DownloadURL from '../Extensions/DownloadURL.js';
const { downloadURL } = DownloadURL;

var domurl = win.URL || win.webkitURL || win,
    // Milliseconds to defer image load event handlers to offset IE bug
    loadEventDeferDelay = H.isMS ? 150 : 0;

// Dummy object so we can reuse our canvas-tools.js without errors
H.CanVGRenderer = {};

/* eslint-disable valid-jsdoc */

/**
 * Downloads a script and executes a callback when done.
 *
 * @private
 * @function getScript
 * @param {string} scriptLocation
 * @param {Function} callback
 * @return {void}
 */
function getScript(
    scriptLocation: string,
    callback: Highcharts.ScriptOnLoadCallbackFunction
): void {
    var head = doc.getElementsByTagName('head')[0],
        script = doc.createElement('script');

    script.type = 'text/javascript';
    script.src = scriptLocation;
    script.onload = callback;
    script.onerror = function (): void {
        error('Error loading script ' + scriptLocation);
    };

    head.appendChild(script);
}

/**
 * Get blob URL from SVG code. Falls back to normal data URI.
 *
 * @private
 * @function Highcharts.svgToDataURL
 * @param {string} svg
 * @return {string}
 */
function svgToDataUrl(svg: string): string {
    // Webkit and not chrome
    const userAgent = win.navigator.userAgent;
    const webKit = (
        userAgent.indexOf('WebKit') > -1 &&
        userAgent.indexOf('Chrome') < 0
    );

    try {
        // Safari requires data URI since it doesn't allow navigation to blob
        // URLs. Firefox has an issue with Blobs and internal references,
        // leading to gradients not working using Blobs (#4550)
        if (!webKit && !H.isFirefox) {
            return domurl.createObjectURL(new win.Blob([svg], {
                type: 'image/svg+xml;charset-utf-16'
            }));
        }
    } catch (e) {
        // Ignore
    }
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

/**
 * Get data:URL from image URL. Pass in callbacks to handle results.
 *
 * @private
 * @function Highcharts.imageToDataUrl
 *
 * @param {string} imageURL
 *
 * @param {string} imageType
 *
 * @param {*} callbackArgs
 *        callbackArgs is used only by callbacks.
 *
 * @param {number} scale
 *
 * @param {Function} successCallback
 *        Receives four arguments: imageURL, imageType, callbackArgs, and scale.
 *
 * @param {Function} taintedCallback
 *        Receives four arguments: imageURL, imageType, callbackArgs, and scale.
 *
 * @param {Function} noCanvasSupportCallback
 *        Receives four arguments: imageURL, imageType, callbackArgs, and scale.
 *
 * @param {Function} failedLoadCallback
 *        Receives four arguments: imageURL, imageType, callbackArgs, and scale.
 *
 * @param {Function} [finallyCallback]
 *        finallyCallback is always called at the end of the process. All
 *        callbacks receive four arguments: imageURL, imageType, callbackArgs,
 *        and scale.
 *
 * @return {void}
 */
function imageToDataUrl(
    imageURL: string,
    imageType: string,
    callbackArgs: unknown,
    scale: number,
    successCallback: Function,
    taintedCallback: Function,
    noCanvasSupportCallback: Function,
    failedLoadCallback: Function,
    finallyCallback?: Function
): void {
    var img = new win.Image(),
        taintedHandler: Function,
        loadHandler = function (): void {
            setTimeout(function (): void {
                var canvas = doc.createElement('canvas'),
                    ctx = canvas.getContext && canvas.getContext('2d'),
                    dataURL;

                try {
                    if (!ctx) {
                        noCanvasSupportCallback(
                            imageURL,
                            imageType,
                            callbackArgs,
                            scale
                        );
                    } else {
                        canvas.height = img.height * scale;
                        canvas.width = img.width * scale;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        // Now we try to get the contents of the canvas.
                        try {
                            dataURL = canvas.toDataURL(imageType);
                            successCallback(
                                dataURL,
                                imageType,
                                callbackArgs,
                                scale
                            );
                        } catch (e) {
                            taintedHandler(
                                imageURL,
                                imageType,
                                callbackArgs,
                                scale
                            );
                        }
                    }
                } finally {
                    if (finallyCallback) {
                        finallyCallback(
                            imageURL,
                            imageType,
                            callbackArgs,
                            scale
                        );
                    }
                }
            // IE bug where image is not always ready despite calling load
            // event.
            }, loadEventDeferDelay);
        },
        // Image load failed (e.g. invalid URL)
        errorHandler = function (): void {
            failedLoadCallback(imageURL, imageType, callbackArgs, scale);
            if (finallyCallback) {
                finallyCallback(imageURL, imageType, callbackArgs, scale);
            }
        };

    // This is called on load if the image drawing to canvas failed with a
    // security error. We retry the drawing with crossOrigin set to Anonymous.
    taintedHandler = function (): void {
        img = new win.Image();
        taintedHandler = taintedCallback;
        // Must be set prior to loading image source
        img.crossOrigin = 'Anonymous';
        img.onload = loadHandler;
        img.onerror = errorHandler;
        img.src = imageURL;
    };

    img.onload = loadHandler;
    img.onerror = errorHandler;
    img.src = imageURL;
}

/* eslint-enable valid-jsdoc */

/**
 * Get data URL to an image of an SVG and call download on it options object:
 *
 * - **filename:** Name of resulting downloaded file without extension. Default
 *   is `chart`.
 *
 * - **type:** File type of resulting download. Default is `image/png`.
 *
 * - **scale:** Scaling factor of downloaded image compared to source. Default
 *   is `1`.
 *
 * - **libURL:** URL pointing to location of dependency scripts to download on
 *   demand. Default is the exporting.libURL option of the global Highcharts
 *   options pointing to our server.
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
 * @return {void}
 */
function downloadSVGLocal(
    svg: string,
    options: Highcharts.ExportingOptions,
    failCallback: Function,
    successCallback?: Function
): void {
    var svgurl: string,
        blob,
        objectURLRevoke = true,
        finallyHandler: Function,
        libURL = (
            options.libURL || (getOptions().exporting as any).libURL
        ),
        dummySVGContainer = doc.createElement('div'),
        imageType = options.type || 'image/png',
        filename = (
            (options.filename || 'chart') +
            '.' +
            (imageType === 'image/svg+xml' ? 'svg' : imageType.split('/')[1])
        ),
        scale = options.scale || 1;

    // Allow libURL to end with or without fordward slash
    libURL = libURL.slice(-1) !== '/' ? libURL + '/' : libURL;

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    function svgToPdf(svgElement: SVGElement, margin: number): string {
        var width = svgElement.width.baseVal.value + 2 * margin,
            height = svgElement.height.baseVal.value + 2 * margin,
            pdf = new win.jsPDF( // eslint-disable-line new-cap
                height > width ? 'p' : 'l', // setting orientation to portrait if height exceeds width
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

        // Workaround for #15135, zero width spaces, which Highcharts uses to
        // break lines, are not correctly rendered in PDF. Replace it with a
        // regular space and offset by some pixels to compensate.
        [].forEach.call(
            svgElement.querySelectorAll('tspan'),
            (tspan: SVGDOMElement): void => {
                if (tspan.textContent === '\u200B') {
                    tspan.textContent = ' ';
                    tspan.setAttribute('dx', -5);
                }
            }
        );

        win.svg2pdf(svgElement, pdf, { removeInvalid: true });
        return pdf.output('datauristring');
    }

    /**
     * @private
     * @return {void}
     */
    function downloadPDF(): void {
        dummySVGContainer.innerHTML = svg;
        var textElements = dummySVGContainer.getElementsByTagName('text'),
            titleElements,
            svgData,
            // Copy style property to element from parents if it's not there.
            // Searches up hierarchy until it finds prop, or hits the chart
            // container.
            setStylePropertyFromParents = function (
                el: DOMElementType,
                propName: string
            ): void {
                var curParent = el;

                while (curParent && curParent !== dummySVGContainer) {
                    if (curParent.style[propName as any]) {
                        el.style[propName as any] =
                            curParent.style[propName as any];
                        break;
                    }
                    curParent = curParent.parentNode as any;
                }
            };

        // Workaround for the text styling. Making sure it does pick up settings
        // for parent elements.
        [].forEach.call(textElements, function (el: SVGDOMElement): void {
            // Workaround for the text styling. making sure it does pick up the
            // root element
            ['font-family', 'font-size'].forEach(function (
                property: string
            ): void {
                setStylePropertyFromParents(el, property);
            });
            el.style['font-family' as any] = (
                el.style['font-family' as any] &&
                el.style['font-family' as any].split(' ').splice(-1)
            ) as any;

            // Workaround for plotband with width, removing title from text
            // nodes
            titleElements = el.getElementsByTagName('title');
            [].forEach.call(titleElements, function (
                titleElement: HTMLDOMElement
            ): void {
                el.removeChild(titleElement);
            });
        });
        svgData = svgToPdf(dummySVGContainer.firstChild as any, 0);
        try {
            downloadURL(svgData, filename);
            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            failCallback(e);
        }
    }

    /* eslint-enable valid-jsdoc */

    // Initiate download depending on file type
    if (imageType === 'image/svg+xml') {
        // SVG download. In this case, we want to use Microsoft specific Blob if
        // available
        try {
            if (typeof win.navigator.msSaveOrOpenBlob !== 'undefined') {
                blob = new MSBlobBuilder();
                blob.append(svg);
                svgurl = blob.getBlob('image/svg+xml') as any;
            } else {
                svgurl = svgToDataUrl(svg);
            }
            downloadURL(svgurl, filename);
            if (successCallback) {
                successCallback();
            }
        } catch (e) {
            failCallback(e);
        }
    } else if (imageType === 'application/pdf') {
        if (win.jsPDF && win.svg2pdf) {
            downloadPDF();
        } else {
            // Must load pdf libraries first. // Don't destroy the object URL
            // yet since we are doing things asynchronously. A cleaner solution
            // would be nice, but this will do for now.
            objectURLRevoke = true;
            getScript(libURL + 'jspdf.js', function (): void {
                getScript(libURL + 'svg2pdf.js', function (): void {
                    downloadPDF();
                });
            });
        }
    } else {
        // PNG/JPEG download - create bitmap from SVG

        svgurl = svgToDataUrl(svg);
        finallyHandler = function (): void {
            try {
                domurl.revokeObjectURL(svgurl);
            } catch (e) {
                // Ignore
            }
        };
        // First, try to get PNG by rendering on canvas
        imageToDataUrl(
            svgurl,
            imageType,
            {},
            scale,
            function (imageURL: string): void {
                // Success
                try {
                    downloadURL(imageURL, filename);
                    if (successCallback) {
                        successCallback();
                    }
                } catch (e) {
                    failCallback(e);
                }
            }, function (): void {
                // Failed due to tainted canvas
                // Create new and untainted canvas
                var canvas = doc.createElement('canvas'),
                    ctx: CanvasRenderingContext2D =
                        canvas.getContext('2d') as any,
                    imageWidth = (svg.match(
                        /^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/
                    ) as any)[1] * scale,
                    imageHeight = (svg.match(
                        /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
                    ) as any)[1] * scale,
                    downloadWithCanVG = function (): void {
                        ctx.drawSvg(svg, 0, 0, imageWidth, imageHeight);
                        try {
                            downloadURL(
                                win.navigator.msSaveOrOpenBlob as any ?
                                    canvas.msToBlob() :
                                    canvas.toDataURL(imageType),
                                filename
                            );
                            if (successCallback) {
                                successCallback();
                            }
                        } catch (e) {
                            failCallback(e);
                        } finally {
                            finallyHandler();
                        }
                    };

                canvas.width = imageWidth;
                canvas.height = imageHeight;
                if (win.canvg) {
                    // Use preloaded canvg
                    downloadWithCanVG();
                } else {
                    // Must load canVG first. // Don't destroy the object URL
                    // yet since we are doing things asynchronously. A cleaner
                    // solution would be nice, but this will do for now.
                    objectURLRevoke = true;
                    // Get RGBColor.js first, then canvg
                    getScript(libURL + 'rgbcolor.js', function (): void {
                        getScript(libURL + 'canvg.js', function (): void {
                            downloadWithCanVG();
                        });
                    });
                }
            },
            // No canvas support
            failCallback,
            // Failed to load image
            failCallback,
            // Finally
            function (): void {
                if (objectURLRevoke) {
                    finallyHandler();
                }
            }
        );
    }
}

/* eslint-disable valid-jsdoc */

/**
 * Get SVG of chart prepared for client side export. This converts embedded
 * images in the SVG to data URIs. It requires the regular exporting module. The
 * options and chartOptions arguments are passed to the getSVGForExport
 * function.
 *
 * @private
 * @function Highcharts.Chart#getSVGForLocalExport
 * @param {Highcharts.ExportingOptions} options
 * @param {Highcharts.Options} chartOptions
 * @param {Function} failCallback
 * @param {Function} successCallback
 * @return {void}
 */
Chart.prototype.getSVGForLocalExport = function (
    options: Highcharts.ExportingOptions,
    chartOptions: Highcharts.Options,
    failCallback: Function,
    successCallback: Function
): void {
    var chart = this,
        images,
        imagesEmbedded = 0,
        chartCopyContainer: (HTMLDOMElement|undefined),
        chartCopyOptions: (Highcharts.Options|undefined),
        el,
        i,
        l,
        href: (string|undefined),
        // After grabbing the SVG of the chart's copy container we need to do
        // sanitation on the SVG
        sanitize = function (svg: string): string {
            return chart.sanitizeSVG(svg, chartCopyOptions as any);
        },
        // When done with last image we have our SVG
        checkDone = function (): void {
            if (imagesEmbedded === images.length) {
                successCallback(sanitize(
                    (chartCopyContainer as any).innerHTML
                ));
            }
        },
        // Success handler, we converted image to base64!
        embeddedSuccess = function (
            imageURL: string,
            imageType: string,
            callbackArgs: {
                imageElement: HTMLDOMElement;
            }
        ): void {
            ++imagesEmbedded;

            // Change image href in chart copy
            callbackArgs.imageElement.setAttributeNS(
                'http://www.w3.org/1999/xlink',
                'href',
                imageURL
            );

            checkDone();
        };

    // Hook into getSVG to get a copy of the chart copy's container (#8273)
    chart.unbindGetSVG = addEvent(chart, 'getSVG', function (
        e: {
            chartCopy: Chart;
        }
    ): void {
        chartCopyOptions = e.chartCopy.options;
        chartCopyContainer = e.chartCopy.container.cloneNode(true) as any;
    });

    // Trigger hook to get chart copy
    chart.getSVGForExport(options, chartOptions);
    images = (chartCopyContainer as any).getElementsByTagName('image');

    try {
        // If there are no images to embed, the SVG is okay now.
        if (!images.length) {
            // Use SVG of chart copy
            successCallback(sanitize((chartCopyContainer as any).innerHTML));
            return;
        }

        // Go through the images we want to embed
        for (i = 0, l = images.length; i < l; ++i) {
            el = images[i];
            href = el.getAttributeNS(
                'http://www.w3.org/1999/xlink',
                'href'
            );
            if (href) {
                imageToDataUrl(
                    href,
                    'image/png',
                    { imageElement: el },
                    options.scale as any,
                    embeddedSuccess,
                    // Tainted canvas
                    failCallback,
                    // No canvas support
                    failCallback,
                    // Failed to load source
                    failCallback
                );

            // Hidden, boosted series have blank href (#10243)
            } else {
                ++imagesEmbedded;
                el.parentNode.removeChild(el);
                checkDone();
            }
        }
    } catch (e) {
        failCallback(e);
    }

    // Clean up
    chart.unbindGetSVG();
};

/* eslint-enable valid-jsdoc */

/**
 * Exporting and offline-exporting modules required. Export a chart to an image
 * locally in the user's browser.
 *
 * @function Highcharts.Chart#exportChartLocal
 *
 * @param  {Highcharts.ExportingOptions} [exportingOptions]
 *         Exporting options, the same as in
 *         {@link Highcharts.Chart#exportChart}.
 *
 * @param  {Highcharts.Options} [chartOptions]
 *         Additional chart options for the exported chart. For example a
 *         different background color can be added here, or `dataLabels`
 *         for export only.
 *
 * @return {void}
 *
 * @requires modules/exporting
 */
Chart.prototype.exportChartLocal = function (
    exportingOptions?: Highcharts.ExportingOptions,
    chartOptions?: Highcharts.Options
): void {
    var chart = this,
        options = merge(chart.options.exporting, exportingOptions),
        fallbackToExportServer = function (err: Error): void {
            if (options.fallbackToExportServer === false) {
                if (options.error) {
                    options.error(options, err);
                } else {
                    error(28, true); // Fallback disabled
                }
            } else {
                chart.exportChart(options);
            }
        },
        svgSuccess = function (svg: string): void {
            // If SVG contains foreignObjects all exports except SVG will fail,
            // as both CanVG and svg2pdf choke on this. Gracefully fall back.
            if (
                svg.indexOf('<foreignObject') > -1 &&
                options.type !== 'image/svg+xml'
            ) {
                fallbackToExportServer(
                    'Image type not supported' +
                    'for charts with embedded HTML' as any
                );
            } else {
                downloadSVGLocal(
                    svg,
                    extend(
                        { filename: chart.getFilename() },
                        options
                    ),
                    fallbackToExportServer,
                    (): void => fireEvent(chart, 'exportChartLocalSuccess')
                );
            }
        },

        // Return true if the SVG contains images with external data. With the
        // boost module there are `image` elements with encoded PNGs, these are
        // supported by svg2pdf and should pass (#10243).
        hasExternalImages = function (): boolean {
            return [].some.call(
                chart.container.getElementsByTagName('image'),
                function (image: HTMLDOMElement): boolean {
                    var href = image.getAttribute('href');
                    return href !== '' && (href as any).indexOf('data:') !== 0;
                }
            );
        };

    // If we are on IE and in styled mode, add a whitelist to the renderer for
    // inline styles that we want to pass through. There are so many styles by
    // default in IE that we don't want to blacklist them all.
    if (H.isMS && chart.styledMode) {
        SVGRenderer.prototype.inlineWhitelist = [
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
        ];
    }

    // Always fall back on:
    // - MS browsers: Embedded images JPEG/PNG, or any PDF
    // - Embedded images and PDF
    if (
        (
            H.isMS &&
            (
                options.type === 'application/pdf' ||
                chart.container.getElementsByTagName('image').length &&
                options.type !== 'image/svg+xml'
            )
        ) || (
            options.type === 'application/pdf' &&
            hasExternalImages()
        )
    ) {
        fallbackToExportServer(
            'Image type not supported for this chart/browser.' as any
        );
        return;
    }

    chart.getSVGForLocalExport(
        options,
        chartOptions as any,
        fallbackToExportServer,
        svgSuccess
    );
};

// Extend the default options to use the local exporter logic
merge(true, getOptions().exporting, {
    libURL: 'https://code.highcharts.com/@product.version@/lib/',

    // When offline-exporting is loaded, redefine the menu item definitions
    // related to download.
    menuItemDefinitions: {
        downloadPNG: {
            textKey: 'downloadPNG',
            onclick: function (this: Chart): void {
                this.exportChartLocal();
            }
        },
        downloadJPEG: {
            textKey: 'downloadJPEG',
            onclick: function (this: Chart): void {
                this.exportChartLocal({
                    type: 'image/jpeg'
                });
            }
        },
        downloadSVG: {
            textKey: 'downloadSVG',
            onclick: function (this: Chart): void {
                this.exportChartLocal({
                    type: 'image/svg+xml'
                });
            }
        },
        downloadPDF: {
            textKey: 'downloadPDF',
            onclick: function (this: Chart): void {
                this.exportChartLocal({
                    type: 'application/pdf'
                });
            }
        }

    }
});

// Compatibility
H.downloadSVGLocal = downloadSVGLocal;
