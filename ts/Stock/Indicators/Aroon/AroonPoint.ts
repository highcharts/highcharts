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

import type AroonIndicator from './AroonIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class AroonPoint extends SMAPoint {
    /** @internal */
    public aroonDown?: number;
    /** @internal */
    public series: AroonIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default AroonPoint;
