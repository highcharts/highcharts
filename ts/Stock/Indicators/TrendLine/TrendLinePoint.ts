/* *
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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

declare class TrendLinePoint extends SMAPoint {
    /** @internal */
    public series: TrendLineIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default TrendLinePoint;
