/* *
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
