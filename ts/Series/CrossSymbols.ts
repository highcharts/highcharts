/* *
 *
 *  Shared cross marker symbol registration used by series modules.
 *  This keeps `cross` out of Core SVG symbols while allowing modules
 *  like PointAndFigure and Contour to compose it when needed.
 *
 * */

import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../Core/Renderer/SVG/SVGRenderer';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        /** Shared by Series/PointAndFigure and Series/Contour. */
        cross: SymbolFunction;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace CrossSymbols {

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

    /**
     * Register the shared `cross` symbol on a renderer class.
     *
     * @private
     */
    export function compose(
        SVGRendererClass: typeof SVGRenderer
    ): void {
        if (modifiedMembers.indexOf(SVGRendererClass) === -1) {
            modifiedMembers.push(SVGRendererClass);

            SVGRendererClass.prototype.symbols.cross = cross;
        }
    }

    /**
     * Cross marker path.
     * @private
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

export default CrossSymbols;
