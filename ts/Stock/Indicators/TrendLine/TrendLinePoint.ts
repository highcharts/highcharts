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

import type SMAPoint from '../SMA/SMAPoint.js';
import type TrendLineIndicator from './TrendLineIndicator.js';

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
