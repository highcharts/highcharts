/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
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

import type CandlestickPointOptions from './CandlestickPointOptions';
import type CandlestickSeries from './CandlestickSeries';
import type OHLCPoint from '../OHLC/OHLCPoint';

/* *
 *
 *  Declarations
 *
 * */

declare class CandlestickPoint extends OHLCPoint {
    public close: number;
    public open: number;
    public options: CandlestickPointOptions;
    public series: CandlestickSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default CandlestickPoint;
