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

declare class DPOPoint extends SMAPoint {
    /** @internal */
    public series: DPOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default DPOPoint;
