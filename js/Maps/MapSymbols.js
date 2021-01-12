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
import H from '../Core/Globals.js';
var Renderer = H.Renderer, VMLRenderer = H.VMLRenderer;
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';
/* *
 *
 *  Functions
 *
 * */
// eslint-disable-next-line valid-jsdoc
/**
 * Create symbols for the zoom buttons
 * @private
 */
function selectiveRoundedRect(x, y, w, h, rTopLeft, rTopRight, rBottomRight, rBottomLeft) {
    return [
        ['M', x + rTopLeft, y],
        // top side
        ['L', x + w - rTopRight, y],
        // top right corner
        ['C', x + w - rTopRight / 2, y, x + w, y + rTopRight / 2, x + w, y + rTopRight],
        // right side
        ['L', x + w, y + h - rBottomRight],
        // bottom right corner
        ['C', x + w, y + h - rBottomRight / 2, x + w - rBottomRight / 2, y + h, x + w - rBottomRight, y + h],
        // bottom side
        ['L', x + rBottomLeft, y + h],
        // bottom left corner
        ['C', x + rBottomLeft / 2, y + h, x, y + h - rBottomLeft / 2, x, y + h - rBottomLeft],
        // left side
        ['L', x, y + rTopLeft],
        // top left corner
        ['C', x, y + rTopLeft / 2, x + rTopLeft / 2, y, x + rTopLeft, y],
        ['Z']
    ];
}
SVGRenderer.prototype.symbols.topbutton = function (x, y, w, h, options) {
    var r = (options && options.r) || 0;
    return selectiveRoundedRect(x - 1, y - 1, w, h, r, r, 0, 0);
};
SVGRenderer.prototype.symbols.bottombutton = function (x, y, w, h, options) {
    var r = (options && options.r) || 0;
    return selectiveRoundedRect(x - 1, y - 1, w, h, 0, 0, r, r);
};
// The symbol callbacks are generated on the SVGRenderer object in all browsers.
// Even VML browsers need this in order to generate shapes in export. Now share
// them with the VMLRenderer.
if (Renderer !== SVGRenderer) {
    ['topbutton', 'bottombutton'].forEach(function (shape) {
        Renderer.prototype.symbols[shape] = SVGRenderer.prototype.symbols[shape];
    });
}
export default SVGRenderer.prototype.symbols;
