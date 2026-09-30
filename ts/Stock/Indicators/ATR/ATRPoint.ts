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

import type ATRIndicator from './ATRIndicator.js';
import type SMAPoint from '../SMA/SMAPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class ATRPoint extends SMAPoint {
    /** @internal */
    public series: ATRIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default ATRPoint;
