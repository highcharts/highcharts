/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
import { extend } from '../../Shared/Utilities.js';
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
