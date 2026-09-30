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

import type OBVIndicator from './OBVIndicator.js';
import type SMAPoint from '../SMA/SMAPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class OBVPoint extends SMAPoint {
    /** @internal */
    public series: OBVIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default OBVPoint;
