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

import type PSARIndicator from './PSARIndicator.js';
import type SMAPoint from '../SMA/SMAPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class PSARPoint extends SMAPoint {
    /** @internal */
    public series: PSARIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default PSARPoint;
