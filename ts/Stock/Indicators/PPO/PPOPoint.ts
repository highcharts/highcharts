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
import type PPOIndicator from './PPOIndicator.js';
import type EMAPoint from '../EMA/EMAPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class PPOPoint extends EMAPoint {
    /** @internal */
    public series: PPOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default PPOPoint;
