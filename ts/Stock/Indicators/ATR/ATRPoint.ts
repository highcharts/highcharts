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

import type ATRIndicator from './ATRIndicator';
import type SMAPoint from '../SMA/SMAPoint';

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
