/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface DotPlotSeriesOptions extends ColumnSeriesOptions {
    itemPadding?: number;
    slotsPerBar?: number;
    states?: SeriesStatesOptions<DotPlotSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default DotPlotSeriesOptions;
