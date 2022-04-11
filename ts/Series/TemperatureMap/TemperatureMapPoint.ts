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

import type TemperatureMapSeries from './TemperatureMapSeries.js';
import type TemperatureMapPointOptions from './TemperatureMapPointOptions';

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

class TemperatureMapPoint extends MapBubblePoint {

    /* *
     *
     *  Properties
     *
     * */

    public series: TemperatureMapSeries = void 0 as any;
    public options: TemperatureMapPointOptions = void 0 as any;

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
interface TemperatureMapPoint{
    // pointSetState: typeof AreaRangePoint.prototype.setState;
}

extend(TemperatureMapPoint.prototype, {
    // pointSetState: AreaRangePoint.prototype.setState
});

/* *
 *
 *  Default export
 *
 * */

export default TemperatureMapPoint;
