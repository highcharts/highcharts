import type { AssertionError } from 'assert';
import { message, failure, warn } from '../../tools/gulptasks/lib/log.js';

const { argv } = process;

/**
 * Logs the output if `argv.verbose` is given
 * @param text
 */
export function describe(...text: string[]): void {
    if (argv.includes('--verbose')) {
        message(text);
    }
}

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

export function setupDOM( customBody = '' ){
  const { JSDOM } = require('jsdom');
  const { doc, win } = new JSDOM(
      customBody ??
    '<!DOCTYPE html><html><body></body></html>');

  global.Node = win.Node; // Workaround for issue #1
  win.Date = Date;

  // DispatchEvent workaround
  const originalDispatchEvent = win.dispatchEvent;
  win.dispatchEvent = function (e: Record<string, any>){
      const event = new win.Event(e.type, e);
      return originalDispatchEvent.call(this, event);
  };
  // Do some modifications to the jsdom document in order to get the SVG bounding
  // boxes right.
  let el = doc.createElement('div');
  doc.body.appendChild(el);

  return {
    win,
    doc,
    el
  };
}

export function loadHCWithModules(hc = 'highcharts', modules: string[] = []){
    const { doc, win } = setupDOM(
        '<!DOCTYPE html><html><body><div id="container"></div></body></html>'
    );

    global.window = global.window || win;

    let Highcharts = require(`highcharts/${hc}`);

    if (typeof Highcharts === 'function') {
        Highcharts = Highcharts(win); // old UMD pattern
    } else {
        Highcharts.doc = Highcharts.doc || doc;
        Highcharts.win = Highcharts.win || win;
    }
    console.log(Object.keys(Highcharts).filter(k => k[0] === 'S'));

    if (modules.length){
        modules.forEach(module => {
            const m = require(`../../code/${module}.src.js`);
            if (typeof m === 'function') {
                m(Highcharts); // old UMD pattern
            }
        });
    }

    return Highcharts;
}
