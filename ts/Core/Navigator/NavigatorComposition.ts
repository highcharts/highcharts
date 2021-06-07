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

/* *
 *
 *  Imports
 *
 * */

import type SVGPath from '../Renderer/SVG/SVGPath';
import type SymbolOptions from '../Renderer/SVG/SymbolOptions';

import RendererRegistry from '../Renderer/RendererRegistry.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Renderer/SVG/SymbolType' {
    interface SymbolTypeRegistry {
        'navigator-handle': SymbolFunction;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace NavigatorComposition {

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable require-jsdoc, valid-jsdoc */

    export function compose(): void {
        const symbols = RendererRegistry.getRendererType().prototype.symbols;

        symbols['navigator-handle'] = navigatorHandle;
    }

    /**
     * Draw one of the handles on the side of the zoomed range in the navigator
     *
     * @return {Highcharts.SVGPathArray}
     * Path to be used in a handle
     */
    function navigatorHandle(
        _x: number,
        _y: number,
        width: number,
        height: number,
        options?: SymbolOptions
    ): SVGPath {
        width = (options && options.width || 0) / 2;
        height = options && options.height || 0;

        const markerPosition = Math.round(width / 3) + 0.5;

        return [
            ['M', -width - 1, 0.5],
            ['L', width, 0.5],
            ['L', width, height + 0.5],
            ['L', -width - 1, height + 0.5],
            ['L', -width - 1, 0.5],
            ['M', -markerPosition, 4],
            ['L', -markerPosition, height - 3],
            ['M', markerPosition - 1, 4],
            ['L', markerPosition - 1, height - 3]
        ];
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default NavigatorComposition;
