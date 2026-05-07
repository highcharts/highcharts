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

import type DMIIndicator from './DMIIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class DMIPoint extends SMAPoint {
    public minusDI?: number;
    public plusDI?: number;
    public series: DMIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default DMIPoint;
