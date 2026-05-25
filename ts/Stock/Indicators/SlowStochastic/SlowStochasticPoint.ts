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

import type SlowStochasticIndicator from './SlowStochasticIndicator';
import type StochasticPoint from '../Stochastic/StochasticPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class SlowStochasticPoint extends StochasticPoint {
    public series: SlowStochasticIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default SlowStochasticPoint;
