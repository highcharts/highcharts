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

import type DisparityIndexIndicator from './DisparityIndexIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class DisparityIndexPoint extends SMAPoint {
    public series: DisparityIndexIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default DisparityIndexPoint;
