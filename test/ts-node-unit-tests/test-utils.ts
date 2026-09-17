import type { AssertionError } from 'assert';
import * as PosixPath from 'node:path/posix';
import { failure } from '../../tools/libs/log.js';

const codePath = PosixPath.join(__dirname, '..', '..', 'code');

const defaultHTML = (
    '<!DOCTYPE html><html><head><meta charset="UTF-8" /></head>' +
    '<body><div id="container"></div></body></html>'
);


console.log('test')

/**
 * Handles logging a failed test to the console.
 * @param error
 * The error object
 */
export function reportError(error: (AssertionError & Error)): void {
    const { actual, expected, code, message: errorMessage, stack } = error;

    const printArrayOrString = (array: string | []) =>
        (Array.isArray(array) ? JSON.stringify(array, undefined, 4) : array);

    failure(`${code} ${errorMessage}
        ${stack?.split('\n')[1]}

Got: ${printArrayOrString(actual as any)}

Expected: ${printArrayOrString(expected as any)}
`);
}

/**
 * jsdom does not compute layout and does not implement `SVGElement.getBBox`
 * (see: https://github.com/jsdom/jsdom/issues/918).
 * Long story short, `Axis.setScale` marks the axis dirty on every redraw.
 * Charts are then permanently dirty, and any work a change avoids is invisible
 * to the benchmarks (eg isDirty optimizations).
 *
 * This is workaround from `highcharts-jsdom` utility,
 * https://github.com/highcharts/highcharts-jsdom
 * It provides just enough information to get Highcharts to render text boxes
 * correctly, and is not intended to work like a general getBBox implementation.
 */
function patchSVGBoundingBoxes(doc: Record<string, any>): void {
    let oldCreateElementNS = doc.createElementNS;
    doc.createElementNS = (ns, tagName) => {
        let elem = oldCreateElementNS.call(doc, ns, tagName);
        if (ns !== 'http://www.w3.org/2000/svg') {
            return elem;
        }

        /**
         * Pass Highcharts' test for SVG capabilities
         * @returns {undefined}
         */
        elem.createSVGRect = () => {};
        /**
         * jsdom doesn't compute layout (see
         * https://github.com/tmpvar/jsdom/issues/135). This getBBox implementation
         * provides just enough information to get Highcharts to render text boxes
         * correctly, and is not intended to work like a general getBBox
         * implementation. The height of the boxes are computed from the sum of
         * tspans and their font sizes. The width is based on an average width for
         * each glyph. It could easily be improved to take font-weight into account.
         * For a more exact result we could to create a map over glyph widths for
         * several fonts and sizes, but it may not be necessary for the purpose.
         * @returns {Object} The bounding box
         */
        elem.getBBox = () => {
            let lineWidth = 0,
                width = 0,
                height = 0;

            let children = [].slice.call(
                elem.children.length ? elem.children : [elem]
            );

            children
                .filter(child => {
                    if (child.getAttribute('class') === 'highcharts-text-outline') {
                        child.parentNode.removeChild(child);
                        return false;
                    }
                    return true;
                })
                .forEach(child => {
                    let fontSize = child.style.fontSize || elem.style.fontSize,
                        lineHeight,
                        textLength;

                    // The font size and lineHeight is based on empirical values,
                    // copied from the SVGRenderer.fontMetrics function in
                    // Highcharts.
                    if (/px/.test(fontSize)) {
                        fontSize = parseInt(fontSize, 10);
                    } else {
                        fontSize = /em/.test(fontSize) ?
                            parseFloat(fontSize) * 12 :
                            12;
                    }
                    lineHeight = fontSize < 24 ?
                        fontSize + 3 :
                        Math.round(fontSize * 1.2);
                    textLength = child.textContent.length * fontSize * 0.55;

                    // Tspans on the same line
                    if (child.getAttribute('dx') !== '0') {
                        height += lineHeight;
                    }

                    // New line
                    if (child.getAttribute('dy') !== null) {
                        lineWidth = 0;
                    }

                    lineWidth += textLength;
                    width = Math.max(width, lineWidth);

                }
            );

            return {
                x: 0,
                y: 0,
                width: width,
                height: height
            };
        };
        return elem;
    };
}

export function setupDOM(
    customHTML = defaultHTML
){
    const { JSDOM } = require('jsdom');
    const { window, window: { document } } = new JSDOM(customHTML);

    if (!global.Node) {
        global.Node = window.Node;
    }
    if (!window.Date) {
        window.Date = Date;
    }

    // DispatchEvent workaround
    const originalDispatchEvent = window.dispatchEvent;
    window.dispatchEvent = function (e: Record<string, any>){
        const event = new window.Event(e.type, e);
        return originalDispatchEvent.call(this, event);
    };
    
    // Do some modifications to the jsdom document in order to get the SVG bounding
    // boxes right.
    let el = document.createElement('div');
    document.body.appendChild(el);

    patchSVGBoundingBoxes(document);

    return {
        win: window,
        doc: document,
        el
    };
}

export function getHighchartsJSDOM(hc = 'highcharts', modules: string[] = []) {
    const { doc, win, el } = setupDOM(defaultHTML);

    global.window = global.window || win;

    let Highcharts = require(`../../code/${hc}.src.js`);

    if (typeof Highcharts === 'function') {
        Highcharts = Highcharts(win); // old UMD pattern
    } else if (!Highcharts.win) {
        Highcharts.doc = doc;
        Highcharts.win = win;
    }

    if (modules.length) {
        for (const module of modules) {
            const m = require(`../../code/${module}.src.js`);
            if (typeof m === 'function') {
                m(Highcharts); // old UMD pattern
            }
        }
    }

    Highcharts.setOptions({
        chart: {
            animation: false
        },
        plotOptions: {
            series: {
                animation: false,
                kdNow: true,
                dataLabels: {
                    defer: false
                },
                states: {
                    hover: {
                        animation: false
                    },
                    select: {
                        animation: false
                    },
                    inactive: {
                        animation: false
                    },
                    normal: {
                        animation: false
                    }
                },
                label: {
                    // Disable it to avoid diff. Consider enabling it in the future,
                    // then it can be enabled in the clean-up commit right after a
                    // release.
                    enabled: false
                }
            },
            // We cannot use it in plotOptions.series because treemap
            // has the same layout option: layoutAlgorithm.
            networkgraph: {
                layoutAlgorithm: {
                    enableSimulation: false,
                    maxIterations: 10
                }
            },
            packedbubble: {
                layoutAlgorithm: {
                    enableSimulation: false,
                    maxIterations: 10
                }
            }
        },
        // Stock's Toolbar decreases width of the chart. At the same time, some
        // tests have hardcoded x/y positions for events which cuases them to fail.
        // For these tests, let's disable stockTools.gui globally.
        stockTools: {
            gui: {
                enabled: false
            }
        },
        tooltip: {
            animation: false
        },
        drilldown: {
            animation: false
        }
    });

    return { Highcharts, el };
}

export function loadHCWithModules(
    hc = 'highcharts',
    modules: string[] = []
){
    const { doc, win } = setupDOM(defaultHTML);

    global.window = global.window || win;

    let Highcharts = require(`../../code/${hc}.src.js`);

    if (typeof Highcharts === 'function') {
        Highcharts = Highcharts(win); // old UMD pattern
    } else if (!Highcharts.win) {
        Highcharts.doc = doc;
        Highcharts.win = win;
    }

    if (modules.length) {
        modules.forEach(module => {
            const m = require(`../../code/${module}.src.js`);
            if (typeof m === 'function') {
                m(Highcharts); // old UMD pattern
            }
        });
    }

    return Highcharts;
}

export function wrapRequire() {
    const modulePrototype = Object.getPrototypeOf(module);
    const originalRequire = modulePrototype.require;

    modulePrototype.require = function (id) {
        if (id.startsWith('highcharts')) {
            if (id.startsWith('highcharts/')) {
                id = id.substring(11);
            }
            if (!id.endsWith('.js')) {
                id += '.src.js';
            }
            id = PosixPath.join(codePath, id);
        }
        return originalRequire.call(this, id);
    };
}

export function mockObservers(win: any): void {

    if (!win.ResizeObserver) {
        win.ResizeObserver = class ResizeObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    }

    if (!win.MutationObserver) {
        win.MutationObserver = class MutationObserver {
            constructor(callback: any) {}
            observe() {}
            disconnect() {}
            takeRecords() { return []; }
        };
    }
}

wrapRequire();
