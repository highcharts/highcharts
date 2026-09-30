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

import type DEMAIndicator from './DEMAIndicator.js';
import type EMAPoint from '../EMA/EMAPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class DEMAPoint extends EMAPoint {
    /** @internal */
    public series: DEMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default DEMAPoint;
