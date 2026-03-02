/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
