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

import type LollipopSeries from './LollipopSeries';
import type DumbbellSeriesOptions from '../Dumbbell/DumbbellSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface LollipopSeriesOptions extends DumbbellSeriesOptions {
    lowColor?: undefined;
    states?: SeriesStatesOptions<LollipopSeries>;
}

/* *
 *
 *  Default export
 *
 * */

export default LollipopSeriesOptions;
