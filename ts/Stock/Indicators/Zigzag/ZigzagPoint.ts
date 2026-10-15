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

import type ZigzagIndicator from './ZigzagIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class ZigzagPoint extends SMAPoint {
    /** @internal */
    public series: ZigzagIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default ZigzagPoint;
