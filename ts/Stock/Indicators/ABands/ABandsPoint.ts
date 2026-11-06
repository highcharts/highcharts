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

declare class ABandsPoint extends SMAPoint {
    /** @internal */
    public middle?: number;
    /** @internal */
    public series: ABandsIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default ABandsPoint;
