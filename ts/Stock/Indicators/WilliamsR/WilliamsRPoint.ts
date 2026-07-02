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

import type WilliamsRIndicator from './WilliamsRIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class WilliamsRPoint extends SMAPoint {
    public series: WilliamsRIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default WilliamsRPoint;
