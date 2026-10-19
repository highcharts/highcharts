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

declare class DisparityIndexPoint extends SMAPoint {
    /** @internal */
    public series: DisparityIndexIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default DisparityIndexPoint;
