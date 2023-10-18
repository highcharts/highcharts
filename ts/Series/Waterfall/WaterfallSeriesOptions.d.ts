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
import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type WaterfallSeries from './WaterfallSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface WaterfallSeriesOptions extends ColumnSeriesOptions {
    upColor?: ColorType;
    states?: SeriesStatesOptions<WaterfallSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default WaterfallSeriesOptions;
