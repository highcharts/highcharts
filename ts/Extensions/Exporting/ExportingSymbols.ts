/* *
 *
 *  Exporting module
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';
import type Symbols from '../../Core/Renderer/SVG/Symbols';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        /** @requires Extensions/Exporting */
        menu: SymbolFunction;
        /** @requires Extensions/Exporting */
        menuball: SymbolFunction;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace ExportingSymbols {

    /* *
     *
     *  Constants
     *
     * */

    const modifiedClasses: Array<Function> = [];

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
        if (modifiedClasses.indexOf(SVGRendererClass) === -1) {
            modifiedClasses.push(SVGRendererClass);

            const symbols = SVGRendererClass.prototype.symbols;

            symbols.menu = menu;
            symbols.menuball = menuball.bind(symbols);
        }
    }

    /**
     * @private
     */
    function menu(
        x: number,
        y: number,
        width: number,
        height: number
    ): SVGPath {
        const arr: SVGPath = [
            ['M', x, y + 2.5],
            ['L', x + width, y + 2.5],
            ['M', x, y + height / 2 + 0.5],
            ['L', x + width, y + height / 2 + 0.5],
            ['M', x, y + height - 1.5],
            ['L', x + width, y + height - 1.5]
        ];

        return arr;
    }

    /**
     * @private
     */
    function menuball(
        this: typeof Symbols,
        x: number,
        y: number,
        width: number,
        height: number
    ): SVGPath {
        const h = (height / 3) - 2;

        let path: SVGPath = [];

        path = path.concat(
            this.circle(width - h, y, h, h),
            this.circle(width - h, y + h + 4, h, h),
            this.circle(width - h, y + 2 * (h + 4), h, h)
        );
        return path;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ExportingSymbols;
