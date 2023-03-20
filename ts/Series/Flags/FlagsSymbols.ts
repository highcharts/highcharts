/* *
 *
 *  Imports
 *
 * */

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';
import type SymbolOptions from '../../Core/Renderer/SVG/SymbolOptions';
import type Symbols from '../../Core/Renderer/SVG/Symbols';

import RendererRegistry from '../../Core/Renderer/RendererRegistry.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        /** @requires Series/Flags */
        circlepin: SymbolFunction;
        /** @requires Series/Flags */
        flag: SymbolFunction;
        /** @requires Series/Flags */
        squarepin: SymbolFunction;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace FlagsSymbols {

    /* *
     *
     *  Constants
     *
     * */

    const modifiedMembers: Array<unknown> = [];

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    export function compose(
        SVGRendererClass: typeof SVGRenderer
    ): void {

        if (modifiedMembers.indexOf(SVGRendererClass) === -1) {
            modifiedMembers.push(SVGRendererClass);

            const symbols = SVGRendererClass.prototype.symbols;

            symbols.flag = flag;
            createPinSymbol(symbols, 'circle');
            createPinSymbol(symbols, 'square');

        }

        const RendererClass = RendererRegistry.getRendererType();

        // The symbol callbacks are generated on the SVGRenderer object in all
        // browsers.
        if (modifiedMembers.indexOf(RendererClass)) {
            modifiedMembers.push(RendererClass);
        }

    }


    /**
     * Create the flag icon with anchor.
     * @private
     */
    function flag(
        this: typeof Symbols,
        x: number,
        y: number,
        w: number,
        h: number,
        options?: SymbolOptions
    ): SVGPath {
        const anchorX = (options && options.anchorX) || x,
            anchorY = (options && options.anchorY) || y;

        // To do: unwanted any cast because symbols.circle has wrong type, it
        // actually returns an SVGPathArray
        const path = this.circle(anchorX - 1, anchorY - 1, 2, 2) as any;
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
    }

    /**
     * Create the circlepin and squarepin icons with anchor.
     * @private
     */
    function createPinSymbol(
        symbols: typeof Symbols,
        shape: ('circle'|'square')
    ): void {
        symbols[(shape + 'pin') as ('circlepin'|'squarepin')] = function (
            x,
            y,
            w,
            h,
            options
        ): SVGPath {

            const anchorX = options && options.anchorX,
                anchorY = options && options.anchorY;

            let path: SVGPath;

            // For single-letter flags, make sure circular flags are not taller
            // than their width
            if (shape === 'circle' && h > w) {
                x -= Math.round((h - w) / 2);
                w = h;
            }

            path = (symbols[shape])(x, y, w, h);

            if (anchorX && anchorY) {
                /**
                 * If the label is below the anchor, draw the connecting line
                 * from the top edge of the label, otherwise start drawing from
                 * the bottom edge
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

}

/* *
 *
 *  Default Export
 *
 * */

export default FlagsSymbols;
