/* *
 *
 *  Imports
 *
 * */

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import H from '../../Core/Globals.js';
const {
    Renderer,
    VMLRenderer
} = H;
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer.js';
const { symbols } = SVGRenderer.prototype;

/* *
 *
 *  Symbols
 *
 * */

// create the flag icon with anchor
symbols.flag = function (
    x: number,
    y: number,
    w: number,
    h: number,
    options?: Highcharts.SymbolOptionsObject
): SVGPath {
    var anchorX = (options && options.anchorX) || x,
        anchorY = (options && options.anchorY) || y;

    // To do: unwanted any cast because symbols.circle has wrong type, it
    // actually returns an SVGPathArray
    const path = symbols.circle(anchorX - 1, anchorY - 1, 2, 2) as any;
    path.push(
        ['M', anchorX, anchorY],
        ['L', x, y + h],
        ['L', x, y],
        ['L', x + w, y],
        ['L', x + w, y + h],
        ['L', x, y + h],
        ['Z']
    );

    return path;
};

/**
 * Create the circlepin and squarepin icons with anchor.
 * @private
 * @param {string} shape - circle or square
 * @return {void}
 */
function createPinSymbol(shape: ('circle'|'square')): void {
    symbols[shape + 'pin'] = function (
        x: number,
        y: number,
        w: number,
        h: number,
        options?: Highcharts.SymbolOptionsObject
    ): SVGPath {

        var anchorX = options && options.anchorX,
            anchorY = options && options.anchorY,
            path: SVGPath;

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
            let labelX = anchorX;
            if (shape === 'circle') {
                labelX = x + w / 2;
            } else {
                const startSeg = path[0];
                const endSeg = path[1];
                if (startSeg[0] === 'M' && endSeg[0] === 'L') {
                    labelX = (startSeg[1] + endSeg[1]) / 2;
                }
            }
            const labelY = (y > anchorY) ? y : y + h;

            path.push([
                'M',
                labelX,
                labelY
            ], [
                'L',
                anchorX,
                anchorY
            ]);
            path = path.concat(
                symbols.circle(anchorX - 1, anchorY - 1, 2, 2)
            );
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
if ((Renderer as unknown) === VMLRenderer) {
    ['circlepin', 'flag', 'squarepin'].forEach(function (shape: string): void {
        VMLRenderer.prototype.symbols[shape] = symbols[shape];
    });
}

/* *
 *
 *  Default Export
 *
 * */

export default symbols;
