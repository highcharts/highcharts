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
