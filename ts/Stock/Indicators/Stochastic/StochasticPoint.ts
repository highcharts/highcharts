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

import type StochasticIndicator from './StochasticIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class StochasticPoint extends SMAPoint {
    public series: StochasticIndicator;
    public smoothed?: number;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default StochasticPoint;
