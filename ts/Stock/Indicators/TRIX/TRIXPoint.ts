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

import type TEMAPoint from '../TEMA/TEMAPoint';
import type TEMAIndicator from '../TEMA/TEMAIndicator';

/* *
 *
 *  Class
 *
 * */

/** @internal */
interface TRIXIndicator extends TEMAIndicator {
    pointClass: typeof TRIXPoint;
}

/** @internal */
declare class TRIXPoint extends TEMAPoint {
    public series: TRIXIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default TRIXPoint;
