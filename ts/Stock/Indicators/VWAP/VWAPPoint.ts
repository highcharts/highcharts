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

import type VWAPIndicator from './VWAPIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class VWAPPoint extends SMAPoint {
    public series: VWAPIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default VWAPPoint;
