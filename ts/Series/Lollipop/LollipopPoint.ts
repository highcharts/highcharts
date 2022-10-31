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
        scatter: {
            prototype: {
                pointClass: ScatterPoint
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

class LollipopPoint extends ScatterPoint {

    /* *
     *
     *  Properties
     *
     * */

    public options: LollipopPointOptions = void 0 as any;

    public series: LollipopSeries = void 0 as any;

    /**
     * Range series only. The low or minimum value for each data point.
     * @name Highcharts.Point#low
     * @type {number|undefined}
     */
    public low: number = void 0 as any;

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
}

extend(LollipopPoint.prototype, {
    // Does not work with the inherited `isvalid`
    isValid: pointProto.isValid
});

/* *
 *
 *  Default Export
 *
 * */

export default LollipopPoint;
