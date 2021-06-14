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

import type ColorType from '../../Core/Color/ColorType';
import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type HLCSeries from './HLCSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface HLCSeriesOptions extends ColumnSeriesOptions {
    states?: SeriesStatesOptions<HLCSeries>;
}

export default HLCSeriesOptions;
