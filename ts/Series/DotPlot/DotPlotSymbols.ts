/* *
 *
 *  (c) 2009-2021 Torstein Honsi
 *
 *  Dot plot series type for Highcharts
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

import SVGPath from '../../Core/Renderer/SVG/SVGPath.js';
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';

SVGRenderer.prototype.symbols.rect = function (
    x: number,
    y: number,
    w: number,
    h: number,
    options?: Highcharts.SymbolOptionsObject
): SVGPath {
    return SVGRenderer.prototype.symbols.callout(x, y, w, h, options);
};
