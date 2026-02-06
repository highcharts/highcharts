/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

declare module '../../Core/Series/KDPointSearchObjectBase' {
    interface KDPointSearchObjectBase {
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
