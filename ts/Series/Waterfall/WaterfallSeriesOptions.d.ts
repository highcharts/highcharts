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
import type ColorType from '../../Core/Color/ColorType';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import ColumnSeriesOptions from '../Column/ColumnSeriesOptions.js';
import WaterfallSeries from './WaterfallSeries.js';

/* *
 *
 * Declarations
 *
 * */
export interface WaterfallSeriesOptions extends ColumnSeriesOptions {
    upColor?: ColorType;
    states?: SeriesStatesOptions<WaterfallSeries>;
}

/* *
 *
 * Export
 *
 * */
export default WaterfallSeriesOptions;
