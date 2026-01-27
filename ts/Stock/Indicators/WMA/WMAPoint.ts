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

import type WMAIndicator from './WMAIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class WMAPoint extends SMAPoint {
    public series: WMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default WMAPoint;
