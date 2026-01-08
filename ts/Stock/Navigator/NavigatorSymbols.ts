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

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SymbolOptions from '../../Core/Renderer/SVG/SymbolOptions';
import type { SymbolTypeRegistry } from '../../Core/Renderer/SVG/SymbolType';


import rect from '../../Core/Renderer/SVG/Symbols.js';
import U from '../../Core/Utilities.js';
const { relativeLength } = U;
/* *
 *
 *  Constants
 *
 * */

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
        markerPosition = 1.5,
        r = relativeLength(
            options.borderRadius || 0,
            Math.min(halfWidth * 2, height)
        );

    height = options.height || height;
    return [
        ['M', -markerPosition, height / 2 - 3.5],
        ['L', -markerPosition, height / 2 + 4.5],
        ['M', markerPosition - 1, height / 2 - 3.5],
        ['L', markerPosition - 1, height / 2 + 4.5],
        ...rect.rect(-halfWidth - 1, 0.5, halfWidth * 2 + 1, height, { r })
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
