/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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
 *  Export
 *
 * */
export default CandlestickPoint;
