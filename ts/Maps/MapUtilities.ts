/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type {
    MapBounds
} from './MapViewOptions';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';

// Compute bounds from a path element
const boundsFromPath = function (
    path: SVGPath
): MapBounds|undefined {
    let x2 = -Number.MAX_VALUE,
        x1 = Number.MAX_VALUE,
        y2 = -Number.MAX_VALUE,
        y1 = Number.MAX_VALUE,
        validBounds;

    path.forEach((seg): void => {
        const x = seg[seg.length - 2],
            y = seg[seg.length - 1];
        if (
            typeof x === 'number' &&
            typeof y === 'number'
        ) {
            x1 = Math.min(x1, x);
            x2 = Math.max(x2, x);
            y1 = Math.min(y1, y);
            y2 = Math.max(y2, y);
            validBounds = true;
        }
    });

    if (validBounds) {
        return { x1, y1, x2, y2 };
    }
};

/* *
 *
 *  Default Export
 *
 * */

const MapUtilities = {
    boundsFromPath
};

export default MapUtilities;
