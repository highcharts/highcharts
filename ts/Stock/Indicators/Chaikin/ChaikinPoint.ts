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

declare class ChaikinPoint extends EMAPoint {
    /** @internal */
    public series: ChaikinIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default ChaikinPoint;
