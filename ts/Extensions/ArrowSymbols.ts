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

/* *
 *
 *  Imports
 *
 * */

import type SVGPath from '../Core/Renderer/SVG/SVGPath';

import SymbolRegistry from '../Core/Renderer/SVG/SymbolRegistry.js';

/* *
 *
 *  Functions
 *
 * */

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
function arrow(
    x: number,
    y: number,
    w: number,
    h: number
): SVGPath {
    return [
        ['M', x, y + h / 2],
        ['L', x + w, y],
        ['L', x, y + h / 2],
        ['L', x + w, y + h]
    ];
}

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
function arrowHalf(
    x: number,
    y: number,
    w: number,
    h: number
): SVGPath {
    return arrow(x, y, w / 2, h);
}

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
function triangleLeft(
    x: number,
    y: number,
    w: number,
    h: number
): SVGPath {
    return [
        ['M', x + w, y],
        ['L', x, y + h / 2],
        ['L', x + w, y + h],
        ['Z']
    ];
}

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
function triangleLeftHalf(
    x: number,
    y: number,
    w: number,
    h: number
): SVGPath {
    return triangleLeft(x, y, w / 2, h);
}

/* *
 *
 *  Registry
 *
 * */

declare module '../Core/Renderer/SVG/SymbolTypeRegistry' {
    interface SymbolTypeRegistry {
        /** @requires Extensions/ArrowSymbols */
        arrow: typeof arrow;
        /** @requires Extensions/ArrowSymbols */
        'arrow-filled': typeof triangleLeft;
        /** @requires Extensions/ArrowSymbols */
        'arrow-filled-half': typeof triangleLeftHalf;
        /** @requires Extensions/ArrowSymbols */
        'arrow-half': typeof arrowHalf;
        /** @requires Extensions/ArrowSymbols */
        'triangle-left': typeof triangleLeft;
        /** @requires Extensions/ArrowSymbols */
        'triangle-left-half': typeof triangleLeftHalf;
    }
}

SymbolRegistry.register('arrow', arrow);
SymbolRegistry.register('arrow-filled', triangleLeft);
SymbolRegistry.register('arrow-filled-half', triangleLeftHalf);
SymbolRegistry.register('arrow-half', arrowHalf);
SymbolRegistry.register('triangle-left', triangleLeft);
SymbolRegistry.register('triangle-left-half', triangleLeftHalf);

/* *
 *
 *  Default Export
 *
 * */

export default SymbolRegistry;
