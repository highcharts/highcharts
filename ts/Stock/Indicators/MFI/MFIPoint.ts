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

import type MFIIndicator from './MFIIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class MFIPoint extends SMAPoint {
    /** @internal */
    public series: MFIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default MFIPoint;
