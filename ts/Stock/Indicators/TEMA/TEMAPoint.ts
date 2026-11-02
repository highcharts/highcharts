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

import type TEMAIndicator from './TEMAIndicator';
import type EMAPoint from '../EMA/EMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class TEMAPoint extends EMAPoint {
    /** @internal */
    public series: TEMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default TEMAPoint;
