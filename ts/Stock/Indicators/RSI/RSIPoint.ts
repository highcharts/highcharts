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

import type RSIIndicator from './RSIIndicator.js';
import type SMAPoint from '../SMA/SMAPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class RSIPoint extends SMAPoint {
    /** @internal */
    public series: RSIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default RSIPoint;
