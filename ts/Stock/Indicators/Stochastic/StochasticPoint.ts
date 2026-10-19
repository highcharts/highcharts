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

declare class StochasticPoint extends SMAPoint {
    /** @internal */
    public series: StochasticIndicator;
    /** @internal */
    public smoothed?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default StochasticPoint;
