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
import type PPOIndicator from './PPOIndicator';
import type EMAPoint from '../EMA/EMAPoint';

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
