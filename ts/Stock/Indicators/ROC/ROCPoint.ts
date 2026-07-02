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

import type ROCIndicator from './ROCIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class ROCPoint extends SMAPoint {
    public series: ROCIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default ROCPoint;
