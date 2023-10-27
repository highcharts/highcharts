/* *
 *
 *  Highcharts funnel module
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

import type FunnelSeriesOptions from '../Funnel/FunnelSeriesOptions';
import type PyramidSeries from './PyramidSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface PyramidSeriesOptions extends FunnelSeriesOptions {
    states?: SeriesStatesOptions<PyramidSeries>;
}

export default PyramidSeriesOptions;
