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

/** @internal */
declare class ZigzagPoint extends SMAPoint {
    public series: ZigzagIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default ZigzagPoint;
