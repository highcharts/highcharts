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

import type DEMAIndicator from './DEMAIndicator';
import type EMAPoint from '../EMA/EMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class DEMAPoint extends EMAPoint {
    public series: DEMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default DEMAPoint;
