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

import type MomentumIndicator from './MomentumIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class MomentumPoint extends SMAPoint {
    public series: MomentumIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default MomentumPoint;
