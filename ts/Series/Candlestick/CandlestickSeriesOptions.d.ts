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
import type CandlestickSeries from './CandlestickSeries';
import type ColorType from '../../Core/Color/ColorType';
import type OHLCSeriesOptions from '../OHLC/OHLCSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */
export interface CandlestickSeriesOptions extends OHLCSeriesOptions {
    lineColor?: ColorType;
    states?: SeriesStatesOptions<CandlestickSeries>;
    upLineColor?: ColorType;
}

/* *
 *
 *  Export
 *
 * */
export default CandlestickSeriesOptions;
