/* *
 *
 *  Imports
 *
 * */

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';

import { pushUnique } from '../../Shared/Utilities.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        /** @requires Series/PointAndFigure */
        cross: SymbolFunction;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace PointAndFigureSymbols {

    /* *
     *
     *  Constants
     *
     * */

    const modifiedMembers: Array<typeof SVGRenderer> = [];

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
        if (pushUnique(modifiedMembers, SVGRendererClass)) {
            const symbols = SVGRendererClass.prototype.symbols;

            symbols.cross = cross;
        }
    }

    /**
     *
     */
    function cross(
        x: number,
        y: number,
        w: number,
        h: number
    ): SVGPath {
        return [
            ['M', x, y],
            ['L', x + w, y + h],
            ['M', x + w, y],
            ['L', x, y + h],
            ['Z']
        ];
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default PointAndFigureSymbols;
