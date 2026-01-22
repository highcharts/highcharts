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

import type SlowStochasticIndicator from './SlowStochasticIndicator';
import type StochasticPoint from '../Stochastic/StochasticPoint';

/* *
 *
 *  Class
 *
 * */

declare class SlowStochasticPoint extends StochasticPoint {
    public series: SlowStochasticIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default SlowStochasticPoint;
