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
import PPOIndicator from './PPOIndicator';
import type EMAPoint from '../EMA/EMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class PPOPoint extends EMAPoint {
    public series: PPOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default PPOPoint;
