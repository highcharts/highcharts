/* *
 *
 *  Imports
 *
 * */

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';

import RendererRegistry from '../../Core/Renderer/RendererRegistry.js';

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

            symbols.cross = cross;

        }

        const RendererClass = RendererRegistry.getRendererType();

        // The symbol callbacks are generated on the SVGRenderer object in all
        // browsers.
        if (modifiedMembers.indexOf(RendererClass)) {
            modifiedMembers.push(RendererClass);
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
