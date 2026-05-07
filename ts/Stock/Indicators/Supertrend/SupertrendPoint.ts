/* *
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type SupertrendIndicator from './SupertrendIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class SupertrendPoint extends SMAPoint {
    public series: SupertrendIndicator;
    public y: number;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default SupertrendPoint;
