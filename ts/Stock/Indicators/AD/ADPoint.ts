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

import type ADIndicator from './ADIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class ADPoint extends SMAPoint {
    public series: ADIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default ADPoint;
