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

declare class MACDPoint extends SMAPoint {
    /** @internal */
    public series: MACDIndicator;
    /** @internal */
    public signal: number;
    /** @internal */
    public MACD: number;
    /** @internal */
    public y: number;
    /** @internal */
    public plotMACD?: number;
    /** @internal */
    public plotSignal?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default MACDPoint;
