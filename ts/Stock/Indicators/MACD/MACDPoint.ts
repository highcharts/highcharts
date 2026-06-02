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

import type MACDIndicator from './MACDIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class MACDPoint extends SMAPoint {
    public series: MACDIndicator;
    public signal: number;
    public MACD: number;
    public y: number;
    public plotMACD?: number;
    public plotSignal?: number;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default MACDPoint;
