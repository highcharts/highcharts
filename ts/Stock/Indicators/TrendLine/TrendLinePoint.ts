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

import type SMAPoint from '../SMA/SMAPoint';
import type TrendLineIndicator from './TrendLineIndicator';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class TrendLinePoint extends SMAPoint {
    public series: TrendLineIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default TrendLinePoint;
