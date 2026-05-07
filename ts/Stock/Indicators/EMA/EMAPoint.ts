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

import type EMAIndicator from './EMAIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class EMAPoint extends SMAPoint {
    public series: EMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default EMAPoint;
