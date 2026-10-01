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

import type EMAIndicator from './EMAIndicator.js';
import type SMAPoint from '../SMA/SMAPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class EMAPoint extends SMAPoint {
    /** @internal */
    public series: EMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default EMAPoint;
