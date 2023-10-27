/* *
 *
 *  Copyright (c) 2010-2021 Highsoft AS
 *  Author: Sebastian Domas
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

import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type HistogramSeries from './HistogramSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface HistogramSeriesOptions extends ColumnSeriesOptions {
    baseSeries?: (number|string);
    binsNumber?: string;
    binWidth?: number;
    states?: SeriesStatesOptions<HistogramSeries>;
}

export default HistogramSeriesOptions;
