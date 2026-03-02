/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
