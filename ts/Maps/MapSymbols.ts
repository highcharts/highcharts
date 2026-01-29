/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
import type SymbolOptions from '../Core/Renderer/SVG/SymbolOptions';
import type { SymbolTypeRegistry } from '../Core/Renderer/SVG/SymbolType';

/* *
 *
 *  Variables
 *
 * */

let symbols: SymbolTypeRegistry;

/* *
 *
 *  Functions
 *
 * */

/** @internal */
function bottomButton(
    x: number,
    y: number,
    w: number,
    h: number,
    options?: SymbolOptions
): SVGPath {
    if (options) {
        const r = options?.r || 0;
        options.brBoxY = y - r;
        options.brBoxHeight = h + r;
    }
    return symbols.roundedRect(x, y, w, h, options);
}

/** @internal */
function compose(
    SVGRendererClass: typeof SVGRenderer
): void {
    symbols = SVGRendererClass.prototype.symbols;
    symbols.bottombutton = bottomButton;
    symbols.topbutton = topButton;
}

/** @internal */
function topButton(
    x: number,
    y: number,
    w: number,
    h: number,
    options?: SymbolOptions
): SVGPath {
    if (options) {
        const r = options?.r || 0;
        options.brBoxHeight = h + r;
    }
    return symbols.roundedRect(x, y, w, h, options);
}

/* *
 *
 *  Registry
 *
 * */

/** @internal */
declare module '../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        /**
         * @requires Map/MapSymbols
         */
        bottombutton: typeof bottomButton;

        /**
         * @requires Map/MapSymbols
         */
        topbutton: typeof topButton;
    }
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
const MapSymbols = {
    compose
};

/** @internal */
export default MapSymbols;
