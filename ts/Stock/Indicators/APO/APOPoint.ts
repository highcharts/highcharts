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

import APOIndicator from './APOIndicator';
import type EMAPoint from '../EMA/EMAPoint';


/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class APOPoint extends EMAPoint {
    public series: APOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default APOPoint;
