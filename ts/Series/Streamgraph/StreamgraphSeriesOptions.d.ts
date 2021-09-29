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

import type AreaSplineSeriesOptions from '../AreaSpline/AreaSplineSeriesOptions';
import type StreamgraphSeries from './StreamgraphSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface StreamgraphSeriesOptions extends AreaSplineSeriesOptions {
    fillOpacity?: number;
    states?: SeriesStatesOptions<StreamgraphSeries>;
}

/* *
 *
 *  Default export
 *
 * */

export default StreamgraphSeriesOptions;
