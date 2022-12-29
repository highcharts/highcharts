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
    public isValid(): boolean {
        return isString(this.options.from) &&
            isString(this.options.to) &&
            defined(this.options.weight || this.series.options.weight);
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
