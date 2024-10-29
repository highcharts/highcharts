import type { AssertionError } from 'assert';
import * as PosixPath from 'node:path/posix';
import { failure } from '../../tools/libs/log.js';

const codePath = PosixPath.join(__dirname, '../../code/');

const defaultHTML = (
    '<!DOCTYPE html><html><head><meta charset="UTF-8" /></head>' +
    '<body><div id="container"></div></body></html>'
);

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
            id = codePath + id;
        }
        return originalRequire.call(this, id);
    };
}
