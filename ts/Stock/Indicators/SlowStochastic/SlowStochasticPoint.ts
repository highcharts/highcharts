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

import type SlowStochasticIndicator from './SlowStochasticIndicator.js';
import type StochasticPoint from '../Stochastic/StochasticPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class SlowStochasticPoint extends StochasticPoint {
    /** @internal */
    public series: SlowStochasticIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default SlowStochasticPoint;
