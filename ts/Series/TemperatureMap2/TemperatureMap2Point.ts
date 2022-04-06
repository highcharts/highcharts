/* *
 *
 *  (c) 2010-2021 Sebastian Bochan, Rafal Sebestjanski
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

import type TemperatureMap2Series from './TemperatureMap2Series.js';
import type TemperatureMap2PointOptions from './TemperatureMap2PointOptions';

import MapBubblePoint from '../MapBubble/MapBubblePoint.js';
import U from '../../Core/Utilities.js';
const {
    extend
} = U;

/* *
 *
 *  Class
 *
 * */

class TemperatureMap2Point extends MapBubblePoint {

    /* *
     *
     *  Properties
     *
     * */

    public series: TemperatureMap2Series = void 0 as any;
    public options: TemperatureMap2PointOptions = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    
}

/* *
 *
 *  Prototype properties
 *
 * */
interface TemperatureMap2Point{
    //pointSetState: typeof AreaRangePoint.prototype.setState;
}

extend(TemperatureMap2Point.prototype, {
    //pointSetState: AreaRangePoint.prototype.setState
});

/* *
 *
 *  Default export
 *
 * */

export default TemperatureMap2Point;
