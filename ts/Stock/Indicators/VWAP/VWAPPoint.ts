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

import type VWAPIndicator from './VWAPIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class VWAPPoint extends SMAPoint {
    /** @internal */
    public series: VWAPIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default VWAPPoint;
