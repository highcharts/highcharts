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

import type OBVIndicator from './OBVIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class OBVPoint extends SMAPoint {
    public series: OBVIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default OBVPoint;
