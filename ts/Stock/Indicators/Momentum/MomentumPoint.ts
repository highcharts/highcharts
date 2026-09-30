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

import type MomentumIndicator from './MomentumIndicator.js';
import type SMAPoint from '../SMA/SMAPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class MomentumPoint extends SMAPoint {
    /** @internal */
    public series: MomentumIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default MomentumPoint;
