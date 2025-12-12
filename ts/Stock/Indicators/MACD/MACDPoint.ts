/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

export default MACDPoint;
