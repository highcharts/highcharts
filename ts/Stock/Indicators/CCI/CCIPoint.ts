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

import type CCIIndicator from './CCIIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class CCIPoint extends SMAPoint {
    public series: CCIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default CCIPoint;
