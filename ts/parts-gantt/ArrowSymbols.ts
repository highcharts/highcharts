/* *
 *
 *  (c) 2017 Highsoft AS
 *  Authors: Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface SymbolDictionary {
            /** @requires highcharts-gantt */
            arrow: SymbolFunction<SVGPathArray>;
            /** @requires highcharts-gantt */
            'arrow-filled': SymbolDictionary['triangle-left'];
            /** @requires highcharts-gantt */
            'arrow-filled-half': SymbolDictionary['triangle-left-half'];
            /** @requires highcharts-gantt */
            'arrow-half': SymbolDictionary['arrow'];
            /** @requires highcharts-gantt */
            'triangle-left': SymbolFunction<SVGPathArray>;
            /** @requires highcharts-gantt */
            'triangle-left-half': SymbolDictionary['triangle-left'];
        }
    }
}

/**
 * Creates an arrow symbol. Like a triangle, except not filled.
 * ```
 *                   o
 *             o
 *       o
 * o
 *       o
 *             o
 *                   o
 * ```
 *
 * @private
 * @function
 *
 * @param {number} x
 *        x position of the arrow
 *
 * @param {number} y
 *        y position of the arrow
 *
 * @param {number} w
 *        width of the arrow
 *
 * @param {number} h
 *        height of the arrow
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
H.SVGRenderer.prototype.symbols.arrow = function (
    x: number,
    y: number,
    w: number,
    h: number
): Highcharts.SVGPathArray {
    return [
        'M', x, y + h / 2,
        'L', x + w, y,
        'L', x, y + h / 2,
        'L', x + w, y + h
    ];
};

/**
 * Creates a half-width arrow symbol. Like a triangle, except not filled.
 * ```
 *       o
 *    o
 * o
 *    o
 *       o
 * ```
 *
 * @private
 * @function
 *
 * @param {number} x
 *        x position of the arrow
 *
 * @param {number} y
 *        y position of the arrow
 *
 * @param {number} w
 *        width of the arrow
 *
 * @param {number} h
 *        height of the arrow
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
H.SVGRenderer.prototype.symbols['arrow-half'] = function (
    x: number,
    y: number,
    w: number,
    h: number
): Highcharts.SVGPathArray {
    return H.SVGRenderer.prototype.symbols.arrow(x, y, w / 2, h);
};

/**
 * Creates a left-oriented triangle.
 * ```
 *             o
 *       ooooooo
 * ooooooooooooo
 *       ooooooo
 *             o
 * ```
 *
 * @private
 * @function
 *
 * @param {number} x
 *        x position of the triangle
 *
 * @param {number} y
 *        y position of the triangle
 *
 * @param {number} w
 *        width of the triangle
 *
 * @param {number} h
 *        height of the triangle
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
H.SVGRenderer.prototype.symbols['triangle-left'] = function (
    x: number,
    y: number,
    w: number,
    h: number
): Highcharts.SVGPathArray {
    return [
        'M', x + w, y,
        'L', x, y + h / 2,
        'L', x + w, y + h,
        'Z'
    ];
};

/**
 * Alias function for triangle-left.
 *
 * @private
 * @function
 *
 * @param {number} x
 *        x position of the arrow
 *
 * @param {number} y
 *        y position of the arrow
 *
 * @param {number} w
 *        width of the arrow
 *
 * @param {number} h
 *        height of the arrow
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
H.SVGRenderer.prototype.symbols['arrow-filled'] =
        H.SVGRenderer.prototype.symbols['triangle-left'];

/**
 * Creates a half-width, left-oriented triangle.
 * ```
 *       o
 *    oooo
 * ooooooo
 *    oooo
 *       o
 * ```
 *
 * @private
 * @function
 *
 * @param {number} x
 *        x position of the triangle
 *
 * @param {number} y
 *        y position of the triangle
 *
 * @param {number} w
 *        width of the triangle
 *
 * @param {number} h
 *        height of the triangle
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
H.SVGRenderer.prototype.symbols['triangle-left-half'] = function (
    x: number,
    y: number,
    w: number,
    h: number
): Highcharts.SVGPathArray {
    return H.SVGRenderer.prototype.symbols['triangle-left'](x, y, w / 2, h);
};

/**
 * Alias function for triangle-left-half.
 *
 * @private
 * @function
 *
 * @param {number} x
 *        x position of the arrow
 *
 * @param {number} y
 *        y position of the arrow
 *
 * @param {number} w
 *        width of the arrow
 *
 * @param {number} h
 *        height of the arrow
 *
 * @return {Highcharts.SVGPathArray}
 *         Path array
 */
H.SVGRenderer.prototype.symbols['arrow-filled-half'] =
        H.SVGRenderer.prototype.symbols['triangle-left-half'];
