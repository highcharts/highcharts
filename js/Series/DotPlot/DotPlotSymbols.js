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
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
SVGRenderer.prototype.symbols.rect = function (x, y, w, h, options) {
    return SVGRenderer.prototype.symbols.callout(x, y, w, h, options);
};
