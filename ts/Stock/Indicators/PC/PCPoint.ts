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

declare class PCPoint extends SMAPoint {
    /** @internal */
    public middle?: number;
    /** @internal */
    public series: PCIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default PCPoint;
