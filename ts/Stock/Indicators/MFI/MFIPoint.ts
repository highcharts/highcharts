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

import MFIIndicator from './MFIIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class MFIPoint extends SMAPoint {
    public series: MFIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default MFIPoint;
