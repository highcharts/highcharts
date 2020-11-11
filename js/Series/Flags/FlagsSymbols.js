/* *
 *
 *  Imports
 *
 * */
import H from '../../Core/Globals.js';
var Renderer = H.Renderer, VMLRenderer = H.VMLRenderer;
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
var symbols = SVGRenderer.prototype.symbols;
/* *
 *
 *  Symbols
 *
 * */
// create the flag icon with anchor
symbols.flag = function (x, y, w, h, options) {
    var anchorX = (options && options.anchorX) || x, anchorY = (options && options.anchorY) || y;
    // To do: unwanted any cast because symbols.circle has wrong type, it
    // actually returns an SVGPathArray
    var path = symbols.circle(anchorX - 1, anchorY - 1, 2, 2);
    path.push(['M', anchorX, anchorY], ['L', x, y + h], ['L', x, y], ['L', x + w, y], ['L', x + w, y + h], ['L', x, y + h], ['Z']);
    return path;
};
/**
 * Create the circlepin and squarepin icons with anchor.
 * @private
 * @param {string} shape - circle or square
 * @return {void}
 */
function createPinSymbol(shape) {
    symbols[shape + 'pin'] = function (x, y, w, h, options) {
        var anchorX = options && options.anchorX, anchorY = options && options.anchorY, path;
        // For single-letter flags, make sure circular flags are not taller
        // than their width
        if (shape === 'circle' && h > w) {
            x -= Math.round((h - w) / 2);
            w = h;
        }
        path = (symbols[shape])(x, y, w, h);
        if (anchorX && anchorY) {
            /**
             * If the label is below the anchor, draw the connecting line from
             * the top edge of the label, otherwise start drawing from the
             * bottom edge
             */
            var labelX = anchorX;
            if (shape === 'circle') {
                labelX = x + w / 2;
            }
            else {
                var startSeg = path[0];
                var endSeg = path[1];
                if (startSeg[0] === 'M' && endSeg[0] === 'L') {
                    labelX = (startSeg[1] + endSeg[1]) / 2;
                }
            }
            var labelY = (y > anchorY) ? y : y + h;
            path.push([
                'M',
                labelX,
                labelY
            ], [
                'L',
                anchorX,
                anchorY
            ]);
            path = path.concat(symbols.circle(anchorX - 1, anchorY - 1, 2, 2));
        }
        return path;
    };
}
createPinSymbol('circle');
createPinSymbol('square');
/**
 * The symbol callbacks are generated on the SVGRenderer object in all browsers.
 * Even VML browsers need this in order to generate shapes in export. Now share
 * them with the VMLRenderer.
 */
if (Renderer === VMLRenderer) {
    ['circlepin', 'flag', 'squarepin'].forEach(function (shape) {
        VMLRenderer.prototype.symbols[shape] = symbols[shape];
    });
}
/* *
 *
 *  Default Export
 *
 * */
export default symbols;
