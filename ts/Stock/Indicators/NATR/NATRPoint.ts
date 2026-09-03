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

import type NATRIndicator from './NATRIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class NATRPoint extends SMAPoint {
    public series: NATRIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default NATRPoint;
