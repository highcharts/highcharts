/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
