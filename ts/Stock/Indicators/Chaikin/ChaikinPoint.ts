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

import type ChaikinIndicator from './ChaikinIndicator';
import type EMAPoint from '../EMA/EMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class ChaikinPoint extends EMAPoint {
    public series: ChaikinIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default ChaikinPoint;
