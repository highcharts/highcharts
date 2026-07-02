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

import type WMAIndicator from './WMAIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class WMAPoint extends SMAPoint {
    public series: WMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default WMAPoint;
