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

import type ADIndicator from './ADIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class ADPoint extends SMAPoint {
    /** @internal */
    public series: ADIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default ADPoint;
