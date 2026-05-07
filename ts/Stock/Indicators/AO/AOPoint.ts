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

import type AOIndicator from './AOIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class AOPoint extends SMAPoint {
    public series: AOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default AOPoint;
