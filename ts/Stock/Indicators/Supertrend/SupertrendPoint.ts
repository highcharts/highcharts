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

import type SupertrendIndicator from './SupertrendIndicator.js';
import type SMAPoint from '../SMA/SMAPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class SupertrendPoint extends SMAPoint {
    /** @internal */
    public series: SupertrendIndicator;
    /** @internal */
    public y: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default SupertrendPoint;
