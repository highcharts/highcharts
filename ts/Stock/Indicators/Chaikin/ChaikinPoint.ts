/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
*
 * */

/* *
 *
 *  Imports
 *
 * */

import type ChaikinIndicator from './ChaikinIndicator';
import type EMAPoint from '../EMA/EMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class ChaikinPoint extends EMAPoint {
    public series: ChaikinIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default ChaikinPoint;
