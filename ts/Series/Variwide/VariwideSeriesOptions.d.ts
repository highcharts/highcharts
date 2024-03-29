/* *
 *
 *  Highcharts variwide module
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

import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type VariwideSeries from './VariwideSeries';

/* *
 *
 *  Declarations
 *
 * */

interface VariwideSeriesOptions extends ColumnSeriesOptions {
    states?: SeriesStatesOptions<VariwideSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default VariwideSeriesOptions;
