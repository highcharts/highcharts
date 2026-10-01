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

import type CCIIndicator from './CCIIndicator.js';
import type SMAPoint from '../SMA/SMAPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class CCIPoint extends SMAPoint {
    /** @internal */
    public series: CCIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default CCIPoint;
