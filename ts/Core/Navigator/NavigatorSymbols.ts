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
import type { SymbolTypeRegistry } from '../Renderer/SVG/SymbolType';

/* *
 *
 *  Constants
 *
 * */

const NavigatorSymbols: Partial<SymbolTypeRegistry> = {
    /**
     * Draw one of the handles on the side of the zoomed range in the navigator.
     * @private
     */
    'navigator-handle': function (
        _x, _y, _w, _h, options
    ): SVGPath {
        const halfWidth = (options && options.width || 0) / 2,
            markerPosition = Math.round(halfWidth / 3) + 0.5,
            height = options && options.height || 0;

        return [
            ['M', -halfWidth - 1, 0.5],
            ['L', halfWidth, 0.5],
            ['L', halfWidth, height + 0.5],
            ['L', -halfWidth - 1, height + 0.5],
            ['L', -halfWidth - 1, 0.5],
            ['M', -markerPosition, 4],
            ['L', -markerPosition, height - 3],
            ['M', markerPosition - 1, 4],
            ['L', markerPosition - 1, height - 3]
        ];
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default NavigatorSymbols;
