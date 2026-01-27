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

import type WilliamsRIndicator from './WilliamsRIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class WilliamsRPoint extends SMAPoint {
    public series: WilliamsRIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default WilliamsRPoint;
