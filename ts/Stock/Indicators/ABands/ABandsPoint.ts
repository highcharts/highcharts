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

import type ABandsIndicator from './ABandsIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class ABandsPoint extends SMAPoint {
    public middle?: number;
    public series: ABandsIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default ABandsPoint;
