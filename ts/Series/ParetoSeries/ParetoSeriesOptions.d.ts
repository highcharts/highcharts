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

import type ParetoSeries from './ParetoSeries';
import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

interface ParetoSeriesOptions extends LineSeriesOptions {
    states?: SeriesStatesOptions<ParetoSeries>;
}

/* *
 *
 *  Default export
 *
 * */

export default ParetoSeriesOptions;
