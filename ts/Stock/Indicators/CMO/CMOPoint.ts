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

import type CMOIndicator from './CMOIndicator.js';
import type SMAPoint from '../SMA/SMAPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class CMOPoint extends SMAPoint {
    /** @internal */
    public series: CMOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default CMOPoint;
