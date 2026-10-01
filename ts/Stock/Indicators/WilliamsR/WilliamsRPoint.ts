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

import type WilliamsRIndicator from './WilliamsRIndicator.js';
import type SMAPoint from '../SMA/SMAPoint.js';

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
