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
