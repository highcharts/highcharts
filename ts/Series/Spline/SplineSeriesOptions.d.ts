/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type SplineSeries from './SplineSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface SplineSeriesOptions extends LineSeriesOptions {
    states?: SeriesStatesOptions<SplineSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default SplineSeriesOptions;
