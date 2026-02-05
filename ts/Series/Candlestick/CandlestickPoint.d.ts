/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
