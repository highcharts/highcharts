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

import type DPOIndicator from './DPOIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class DPOPoint extends SMAPoint {
    public series: DPOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default DPOPoint;
