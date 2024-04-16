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

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SymbolOptions from '../../Core/Renderer/SVG/SymbolOptions';
import type { SymbolTypeRegistry } from '../../Core/Renderer/SVG/SymbolType';

/* *
 *
 *  Constants
 *
 * */

function relativeLength(
    value: string | number,
    base: number,
    offset?: number
): number {
    return (/%$/).test(value as any) ?
        (base * parseFloat(value as any) / 100) + (offset || 0) :
        parseFloat(value as any);
}
function roundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    options?: SymbolOptions
): SVGPath {
    const r = options?.r || 0;
    return [
        ['M', x + r, y],
        ['L', x + w - r, y], // Top side
        ['A', r, r, 0, 0, 1, x + w, y + r], // Top-right corner
        ['L', x + w, y + h - r], // Right side
        ['A', r, r, 0, 0, 1, x + w - r, y + h], // Bottom-right corner
        ['L', x + r, y + h], // Bottom side
        ['A', r, r, 0, 0, 1, x, y + h - r], // Bottom-left corner
        ['L', x, y + r], // Left side
        ['A', r, r, 0, 0, 1, x + r, y],
        ['Z'] // Top-left corner
    ];
}

function rect(
    x: number,
    y: number,
    w: number,
    h: number,
    options?: SymbolOptions
): SVGPath {
    if (options && options.r) {
        return roundedRect(x, y, w, h, options);
    }
    return [
        ['M', x, y],
        ['L', x + w, y],
        ['L', x + w, y + h],
        ['L', x, y + h],
        ['Z']
    ];
}

/**
 * Draw one of the handles on the side of the zoomed range in the navigator.
 * @private
 */
function navigatorHandle(
    _x: number,
    _y: number,
    width: number,
    height: number,
    options: SymbolOptions = {}
): SVGPath {
    const halfWidth = options.width ? options.width / 2 : width,
        markerPosition = Math.round(halfWidth / 3) + 0.5,
        r = relativeLength(
            options.borderRadius || 0,
            Math.min(halfWidth * 2, height)
        );

    height = options.height || height;
    return [
        ['M', -markerPosition, 4],
        ['L', -markerPosition, height - 3],
        ['M', markerPosition - 1, 4],
        ['L', markerPosition - 1, height - 3],
        ...rect(-halfWidth - 1, 0.5, halfWidth * 2, height + 0.5, { r })
    ];
}

/* *
 *
 *  Default Export
 *
 * */

const NavigatorSymbols: Partial<SymbolTypeRegistry> = {
    'navigator-handle': navigatorHandle
};

export default NavigatorSymbols;
