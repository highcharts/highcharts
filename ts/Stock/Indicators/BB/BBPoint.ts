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

import type BBIndicator from './BBIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class BBPoint extends SMAPoint {
    public middle?: number;
    public series: BBIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default BBPoint;
