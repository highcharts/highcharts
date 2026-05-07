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

import type CMOIndicator from './CMOIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class CMOPoint extends SMAPoint {
    public series: CMOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default CMOPoint;
