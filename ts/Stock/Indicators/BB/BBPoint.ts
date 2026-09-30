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

import type BBIndicator from './BBIndicator.js';
import type SMAPoint from '../SMA/SMAPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class BBPoint extends SMAPoint {
    /** @internal */
    public middle?: number;
    /** @internal */
    public series: BBIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default BBPoint;
