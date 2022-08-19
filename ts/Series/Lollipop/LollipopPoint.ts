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

import type AreaPointType from '../Area/AreaPoint';
import type DumbbellPointType from '../Dumbbell/DumbbellPoint';
import type LollipopPointOptions from './LollipopPointOptions';
import type LollipopSeries from './LollipopSeries';
import type PointType from '../../Core/Series/Point';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const SeriesTypes = SeriesRegistry.seriesTypes,
    DumbbellPoint: typeof DumbbellPointType =
        SeriesTypes.dumbbell.prototype.pointClass,
    areaProto: AreaPointType = SeriesTypes.area.prototype.pointClass.prototype,
    pointProto: PointType =
        SeriesRegistry.series.prototype.pointClass.prototype;
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
    pointSetState: typeof areaProto.setState;
}

extend(LollipopPoint.prototype, {
    pointSetState: areaProto.setState,
    // Does not work with the inherited `isvalid`
    isValid: pointProto.isValid
});

/* *
 *
 *  Default Export
 *
 * */

export default LollipopPoint;
