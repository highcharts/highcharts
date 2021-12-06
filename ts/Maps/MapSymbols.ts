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
    const r = (options && options.r) || 0;
    return selectiveRoundedRect(x - 1, y - 1, w, h, 0, 0, r, r);
}

/**
 * Create symbols for the zoom buttons
 * @private
 */
function selectiveRoundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    rTopLeft: number,
    rTopRight: number,
    rBottomRight: number,
    rBottomLeft: number
): SVGPath {
    return [
        ['M', x + rTopLeft, y],
        // top side
        ['L', x + w - rTopRight, y],
        // top right corner
        [
            'C',
            x + w - rTopRight / 2,
            y,
            x + w,
            y + rTopRight / 2,
            x + w,
            y + rTopRight
        ],
        // right side
        ['L', x + w, y + h - rBottomRight],
        // bottom right corner
        [
            'C', x + w, y + h - rBottomRight / 2,
            x + w - rBottomRight / 2, y + h,
            x + w - rBottomRight, y + h
        ],
        // bottom side
        ['L', x + rBottomLeft, y + h],
        // bottom left corner
        [
            'C',
            x + rBottomLeft / 2,
            y + h,
            x,
            y + h - rBottomLeft / 2,
            x,
            y + h - rBottomLeft
        ],
        // left side
        ['L', x, y + rTopLeft],
        // top left corner
        ['C', x, y + rTopLeft / 2, x + rTopLeft / 2, y, x + rTopLeft, y],
        ['Z']
    ];
}

function topButton(
    x: number,
    y: number,
    w: number,
    h: number,
    options?: SymbolOptions
): SVGPath {
    const r = (options && options.r) || 0;
    return selectiveRoundedRect(x - 1, y - 1, w, h, r, r, 0, 0);
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
