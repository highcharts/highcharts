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
import type PositionObject from '../../Core/Renderer/PositionObject';
import ColorMapComposition from '../ColorMapComposition.js';
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
    pick,
    isString,
    isNumber
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

    public fromPos?: PositionObject;

    public toPos?: PositionObject;

    public options: FlowMapPointOptions = void 0 as any;

    public series: FlowMapSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    isValid(): boolean {
        let valid = !!(this.options.to && this.options.from);
        [this.options.to, this.options.from]
            .forEach(function (toOrFrom: any): void {
                valid = valid && (toOrFrom && (
                    isString(toOrFrom) || ( // point id or has lat/lon coords
                        isNumber(pick(toOrFrom[0], toOrFrom.lat)) &&
                        isNumber(pick(toOrFrom[1], toOrFrom.lon))
                    )
                ));
            });
        return valid;
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
