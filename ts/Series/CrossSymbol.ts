/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Authors: Kamil Musialowski, Markus Barstad
 *
 *  Shared cross marker symbol registration used by series modules.
 *  This keeps `cross` out of Core SVG symbols while allowing modules
 *  like PointAndFigure and Contour to compose it when needed.
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

import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../Core/Renderer/SVG/SVGRenderer';

import H from '../Core/Globals.js';
import { pushUnique } from '../Shared/Utilities.js';
const { composed } = H;

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

namespace CrossSymbol {

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
        if (pushUnique(composed, 'Series.CrossSymbol')) {
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

export default CrossSymbol;
