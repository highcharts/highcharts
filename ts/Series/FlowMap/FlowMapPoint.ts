/* *
 *
 *  (c) 2010-2022 Askel Eirik Johansson, Piotr Madej
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

import type FlowMapPointOptions from './FlowMapPointOptions';
import type FlowMapSeries from './FlowMapSeries';
import type Point from '../../Core/Series/Point';

import ColorMapComposition from '../ColorMapComposition.js';
import { PointShortOptions } from '../../Core/Series/PointOptions';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        mapline: {
            prototype: {
                pointClass: MapLinePoint
            }
        }
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    defined,
    isString
} = U;

/* *
 *
 *  Class
 *
 * */

class FlowMapPoint extends MapLinePoint {

    /* *
     *
     *  Properties
     *
     * */

    public options: FlowMapPointOptions = void 0 as any;

    public series: FlowMapSeries = void 0 as any;

    public oldFromPoint?: Point;

    public oldToPoint?: Point;

    public removeEventForToPoint: Function = void 0 as any;

    public removeEventForFromPoint: Function = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    public isValid(): boolean {
        return isString(this.options.from) &&
            isString(this.options.to) &&
            defined(this.options.weight || this.series.options.weight);
    }

    /**
     * @private
     */
    public applyOptions(
        options: (FlowMapPointOptions|PointShortOptions),
        x?: number
    ): any {
        const point = super.applyOptions.call(this, options, x);

        // Flowmap point doesn't need `value`, but if it's not there, the point
        // is treated as a null point. So we just set `value: 0`.
        if (point.value === null) {
            point.value = 0;
        }

        return point;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface FlowMapPoint {
    isValid: ColorMapComposition.PointComposition['isValid'];
}

/* *
 *
 *  Default Export
 *
 * */

export default FlowMapPoint;
