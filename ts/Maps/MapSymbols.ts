/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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
import type SVGRenderer from '../Core/Renderer/SVG/SVGRenderer';
import type SymbolOptions from '../Core/Renderer/SVG/SymbolOptions';
import type { SymbolTypeRegistry } from '../Core/Renderer/SVG/SymbolType';

import H from '../Core/Globals.js';
const { composed } = H;
import U from '../Core/Utilities.js';
const { pushUnique } = U;

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

function compose(
    SVGRendererClass: typeof SVGRenderer
): void {

    if (pushUnique(composed, compose)) {
        symbols = SVGRendererClass.prototype.symbols;
        symbols.bottombutton = bottomButton;
        symbols.topbutton = topButton;
    }

}

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

declare module '../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        /** @requires Map/MapSymbols */
        bottombutton: typeof bottomButton;
        /** @requires Map/MapSymbols */
        topbutton: typeof topButton;
    }
}

/* *
 *
 *  Default Export
 *
 * */

const MapSymbols = {
    compose
};

export default MapSymbols;
