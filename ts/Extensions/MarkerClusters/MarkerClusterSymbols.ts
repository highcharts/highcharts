/* *
 *
 *  Marker clusters module.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Wojciech Chmiel
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Declarations
 *
 * */

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';
import type Symbols from '../../Core/Renderer/SVG/Symbols';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        /** @requires Extensions/MarkerClusters */
        cluster: SymbolFunction;
    }
}

/* *
 *
 *  Variables
 *
 * */

let symbols: typeof Symbols;

/* *
 *
 *  Functions
 *
 * */

/**
 * Cluster symbol.
 * @private
 */
function cluster(
    x: number,
    y: number,
    width: number,
    height: number
): SVGPath {
    const w = width / 2,
        h = height / 2,
        outerWidth = 1,
        space = 1,
        inner = symbols.arc(x + w, y + h, w - space * 4, h - space * 4, {
            start: Math.PI * 0.5,
            end: Math.PI * 2.5,
            open: false
        }),
        outer1 = symbols.arc(x + w, y + h, w - space * 3, h - space * 3, {
            start: Math.PI * 0.5,
            end: Math.PI * 2.5,
            innerR: w - outerWidth * 2,
            open: false
        }),
        outer2 = symbols.arc(x + w, y + h, w - space, h - space, {
            start: Math.PI * 0.5,
            end: Math.PI * 2.5,
            innerR: w,
            open: false
        });

    return outer2.concat(outer1, inner);
}

/**
 * @private
 */
function compose(
    SVGRendererClass: typeof SVGRenderer
): void {
    symbols = SVGRendererClass.prototype.symbols;

    symbols.cluster = cluster;
}

/* *
 *
 *  Default Export
 *
 * */

const MarkerClusterSymbols = {
    compose
};

export default MarkerClusterSymbols;
