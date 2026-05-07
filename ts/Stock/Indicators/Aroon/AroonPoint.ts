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

import type AroonIndicator from './AroonIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class AroonPoint extends SMAPoint {
    public aroonDown?: number;
    public series: AroonIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default AroonPoint;
