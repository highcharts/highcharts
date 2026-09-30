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

import type APOIndicator from './APOIndicator.js';
import type EMAPoint from '../EMA/EMAPoint.js';


/* *
 *
 *  Class
 *
 * */

declare class APOPoint extends EMAPoint {
    /** @internal */
    public series: APOIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default APOPoint;
