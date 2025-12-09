/* *
 *
 *  (c) 2010-2025 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
import type DotPlotSeries from './DotPlotSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface DotPlotSeriesOptions extends ColumnSeriesOptions {
    itemPadding?: number;
    slotsPerBar?: number;
    states?: SeriesStatesOptions<DotPlotSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default DotPlotSeriesOptions;
