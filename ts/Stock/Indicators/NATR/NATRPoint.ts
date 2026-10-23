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

declare class NATRPoint extends SMAPoint {
    /** @internal */
    public series: NATRIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default NATRPoint;
