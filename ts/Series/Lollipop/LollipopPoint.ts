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

import type LollipopPointOptions from './LollipopPointOptions';
import type LollipopSeries from './LollipopSeries';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: {
        prototype: {
            pointClass: {
                prototype: pointProto
            }
        }
    },
    seriesTypes: {
        area: {
            prototype: areaProto
        },
        dumbbell: {
            prototype: {
                pointClass: DumbbellPoint
            }
        }
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    isObject,
    extend
} = U;

/* *
 *
 *  Class
 *
 * */

class LollipopPoint extends DumbbellPoint {

    /* *
     *
     *  Properties
     *
     * */

    public options: LollipopPointOptions = void 0 as any;

    public series: LollipopSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public init(
        _series: LollipopSeries,
        options: LollipopPointOptions,
        _x?: number
    ): typeof pointProto {
        if (isObject(options) && 'low' in options) {
            options.y = options.low;
            delete options.low;
        }
        return pointProto.init.apply(this, arguments);
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface LollipopPoint {
    pointSetState: typeof areaProto.pointClass.prototype.setState;
}

extend(LollipopPoint.prototype, {
    pointSetState: areaProto.pointClass.prototype.setState,
    // Does not work with the inherited `isvalid`
    isValid: pointProto.isValid
});

/* *
 *
 *  Default Export
 *
 * */

export default LollipopPoint;
