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

import type LinePoint from '../../../Series/Line/LinePoint';
import type SMAIndicator from './SMAIndicator';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class SMAPoint extends LinePoint {
    public series: SMAIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default SMAPoint;
