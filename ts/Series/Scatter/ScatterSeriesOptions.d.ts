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

import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type ScatterSeries from './ScatterSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ScatterSeriesJitterOptions {
    x?: number;
    y?: number;
}

export interface ScatterSeriesOptions extends LineSeriesOptions {
    jitter?: ScatterSeriesJitterOptions;
    states?: SeriesStatesOptions<ScatterSeries>;
}

export default ScatterSeriesOptions;
