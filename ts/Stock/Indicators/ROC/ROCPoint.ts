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

declare class ROCPoint extends SMAPoint {
    /** @internal */
    public series: ROCIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default ROCPoint;
