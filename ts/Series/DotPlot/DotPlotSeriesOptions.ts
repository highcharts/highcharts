/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
