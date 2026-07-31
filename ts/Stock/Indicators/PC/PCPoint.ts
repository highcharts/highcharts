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

import type PCIndicator from './PCIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class PCPoint extends SMAPoint {
    public middle?: number;
    public series: PCIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default PCPoint;
