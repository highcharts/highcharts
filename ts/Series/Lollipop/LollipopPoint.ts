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
            pointClass: Point
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
    public series: LollipopSeries = void 0 as any;
    public options: LollipopPointOptions = void 0 as any;
}

/* *
 *
 *  Prototype properties
 *
 * */
interface LollipopPoint {
    pointSetState: typeof areaProto.pointClass.prototype.setState;
    init: typeof Point.prototype.init;
}

extend(LollipopPoint.prototype, {
    pointSetState: areaProto.pointClass.prototype.setState,
    // Does not work with the inherited `isvalid`
    isValid: Point.prototype.isValid,
    init: function (
        series: LollipopSeries,
        options: LollipopPointOptions,
        x?: number
    ): typeof Point.prototype {
        if (isObject(options) && 'low' in options) {
            options.y = options.low;
            delete options.low;
        }
        return Point.prototype.init.apply(this, arguments);
    }
});

/* *
 *
 *  Default export
 *
 * */

export default LollipopPoint;
