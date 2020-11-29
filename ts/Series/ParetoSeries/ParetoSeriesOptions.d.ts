/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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

import ParetoSeries from './ParetoSeries';
import LineSeriesOptions from '../Line/LineSeriesOptions';
import { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

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
