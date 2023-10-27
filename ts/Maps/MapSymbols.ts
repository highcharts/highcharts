/* *
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

import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import type SymbolOptions from '../Core/Renderer/SVG/SymbolOptions';

import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';
const { prototype: { symbols } } = SVGRenderer;

/* *
 *
 *  Functions
 *
 * */

/* eslint-disable require-jsdoc, valid-jsdoc */

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

symbols.bottombutton = bottomButton;
symbols.topbutton = topButton;

/* *
 *
 *  Default Export
 *
 * */

export default symbols;
