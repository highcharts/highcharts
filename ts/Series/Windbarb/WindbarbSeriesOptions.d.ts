/* *
 *
 *  Wind barb series module
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

import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type WindbarbSeries from './WindbarbSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface WindbarbSeriesOptions extends ColumnSeriesOptions {
    onSeries?: (string|null);
    states?: SeriesStatesOptions<WindbarbSeries>;
    vectorLength?: number;
    xOffset?: number;
    yOffset?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default WindbarbSeriesOptions;
