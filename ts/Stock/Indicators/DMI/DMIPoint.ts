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

declare class DMIPoint extends SMAPoint {
    /** @internal */
    public minusDI?: number;
    /** @internal */
    public plusDI?: number;
    /** @internal */
    public series: DMIIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default DMIPoint;
