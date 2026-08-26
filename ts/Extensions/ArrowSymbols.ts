/* *
 *
 *  (c) 2017-2026 Highsoft AS
 *  Authors: Lars A. V. Cabrera
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../Core/Renderer/SVG/SVGRenderer';

import Symbols from '../Core/Renderer/SVG/Symbols.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        /** @requires modules/arrow-symbols */
        arrow: typeof arrow;
        /** @requires modules/arrow-symbols */
        'arrow-filled': SymbolTypeRegistry['triangle-left'];
        /** @requires modules/arrow-symbols */
        'arrow-filled-half': typeof triangleLeftHalf;
        /** @requires modules/arrow-symbols */
        'arrow-half': typeof arrowHalf;
        /** @requires modules/arrow-symbols */
        'triangle-left-half': typeof triangleLeftHalf;
    }
}

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
 * Adds the arrow symbols to the SVGRenderer.
 *
 * @internal
 */
export function composeArrowSymbols(
    SVGRendererClass: typeof SVGRenderer
): void {
    const symbols = SVGRendererClass.prototype.symbols;

    symbols.arrow = arrow;
    symbols['arrow-filled'] = Symbols['triangle-left'];
    symbols['arrow-filled-half'] = triangleLeftHalf;
    symbols['arrow-half'] = arrowHalf;
    symbols['triangle-left-half'] = triangleLeftHalf;
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
    return Symbols['triangle-left'](x, y, w / 2, h);
}
