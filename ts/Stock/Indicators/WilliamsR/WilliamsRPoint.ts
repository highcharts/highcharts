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

declare class WilliamsRPoint extends SMAPoint {
    /** @internal */
    public series: WilliamsRIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default WilliamsRPoint;
