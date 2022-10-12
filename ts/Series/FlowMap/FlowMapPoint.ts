/* *
 *
 *  (c) 2010-2022 Askel Eirik Johansson, Piotr Madej
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type FlowMapPointOptions from './FlowMapPointOptions';
import type FlowMapSeries from './FlowMapSeries';
import Point from '../../Core/Series/Point';
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

/* *
 *
 *  Class
 *
 * */

declare class FlowMapPoint extends MapLinePoint {
    public options: FlowMapPointOptions;
    public series: FlowMapSeries;
    public oldFromPoint?: Point;
    public oldToPoint?: Point;
    public removeEventForToPoint: Function;
    public removeEventForFromPoint: Function;
}

/* *
 *
 *  Default Export
 *
 * */

export default FlowMapPoint;
