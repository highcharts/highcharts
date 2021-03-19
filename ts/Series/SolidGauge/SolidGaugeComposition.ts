/* *
 *
 *  Solid angular gauge module
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import H from '../../Core/Globals.js';
const { Renderer } = H;
import U from '../../Core/Utilities.js';
const {
    wrap
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface SymbolOptionsObject {
            rounded?: boolean;
        }
    }
}

/**
 * Additional options, depending on the actual symbol drawn.
 *
 * @interface Highcharts.SymbolOptionsObject
 *//**
 * Whether to draw rounded edges.
 * @name Highcharts.SymbolOptionsObject#rounded
 * @type {boolean|undefined}
 */

/**
 * Symbol definition of an arc with round edges.
 *
 * @private
 * @function Highcharts.Renderer#symbols.arc
 *
 * @param {number} x
 *        The X coordinate for the top left position.
 *
 * @param {number} y
 *        The Y coordinate for the top left position.
 *
 * @param {number} w
 *        The pixel width.
 *
 * @param {number} h
 *        The pixel height.
 *
 * @param {Highcharts.SymbolOptionsObject} [options]
 *        Additional options, depending on the actual symbol drawn.
 *
 * @return {Highcharts.SVGPathArray}
 *         Path of the created arc.
 */
wrap(
    Renderer.prototype.symbols,
    'arc',
    function (
        proceed: Function,
        x: number,
        y: number,
        w: number,
        h: number,
        options: Highcharts.SymbolOptionsObject
    ): SVGPath {
        var arc = proceed,
            path: SVGPath = arc(x, y, w, h, options);

        if (options.rounded) {
            var r = options.r || w,
                smallR = (r - (options.innerR || 0)) / 2,
                outerArcStart = path[0],
                innerArcStart = path[2];

            if (outerArcStart[0] === 'M' && innerArcStart[0] === 'L') {
                const x1 = outerArcStart[1],
                    y1 = outerArcStart[2],
                    x2 = innerArcStart[1],
                    y2 = innerArcStart[2],
                    roundStart: SVGPath.Arc = ['A', smallR, smallR, 0, 1, 1, x1, y1],
                    roundEnd: SVGPath.Arc = ['A', smallR, smallR, 0, 1, 1, x2, y2];

                // Replace the line segment and the last close segment
                path[2] = roundEnd;
                path[4] = roundStart;
            }
        }

        return path;
    }
);
