/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
    public series: StochasticIndicator;
    public smoothed?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default StochasticPoint;
