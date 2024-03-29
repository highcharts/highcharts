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

import type BoxPlotPoint from './BoxPlotPoint';
import type BoxPlotSeries from './BoxPlotSeries';
import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface BoxPlotSeriesOptions extends ColumnSeriesOptions {
    boxDashStyle?: BoxPlotPoint['boxDashStyle'];
    fillColor?: BoxPlotPoint['fillColor'];
    medianColor?: BoxPlotPoint['medianColor'];
    medianDashStyle?: BoxPlotPoint['medianDashStyle'];
    medianWidth?: BoxPlotPoint['medianWidth'];
    states?: SeriesStatesOptions<BoxPlotSeries>;
    stemColor?: BoxPlotPoint['stemColor'];
    stemDashStyle?: BoxPlotPoint['stemDashStyle'];
    stemWidth?: BoxPlotPoint['stemWidth'];
    whiskerColor?: BoxPlotPoint['whiskerColor'];
    whiskerDashStyle?: BoxPlotPoint['whiskerDashStyle'];
    whiskerLength?: BoxPlotPoint['whiskerLength'];
    whiskerWidth?: BoxPlotPoint['whiskerWidth'];
}

/* *
 *
 *  Default Export
 *
 * */

export default BoxPlotSeriesOptions;
