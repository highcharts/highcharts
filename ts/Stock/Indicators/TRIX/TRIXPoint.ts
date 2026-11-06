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

declare class TRIXPoint extends TEMAPoint {
    /** @internal */
    public series: TRIXIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default TRIXPoint;
