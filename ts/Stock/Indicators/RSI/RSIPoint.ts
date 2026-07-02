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

import type RSIIndicator from './RSIIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class RSIPoint extends SMAPoint {
    public series: RSIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default RSIPoint;
