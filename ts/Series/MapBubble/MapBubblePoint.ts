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

import BubblePoint from '../Bubble/BubblePoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        map: {
            prototype: {
                pointClass: {
                    prototype: mapPointProto
                }
            }
        }
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const { extend } = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/KDPointSearchObjectLike' {
    interface KDPointSearchObjectLike {
        plotX?: number;
        plotY?: number;
    }
}

/* *
 *
 *  Class
 *
 * */

class MapBubblePoint extends BubblePoint {

    /* *
     *
     *  Functions
     *
     * */

    public isValid(): boolean {
        return typeof this.z === 'number';
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface MapBubblePoint {
    getProjectedBounds: typeof mapPointProto.getProjectedBounds;
}

extend(MapBubblePoint.prototype, {
    applyOptions: mapPointProto.applyOptions,
    getProjectedBounds: mapPointProto.getProjectedBounds
});

/* *
 *
 *  Default Export
 *
 * */

export default MapBubblePoint;
