/* *
 *
 *  Variable Pie module for Highcharts
 *
 *  (c) 2010-2021 Grzegorz Blachliński
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

import type PieSeriesOptions from '../Pie/PieSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type VariablePieSeries from './VariablePieSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface VariablePieSeriesOptions extends PieSeriesOptions {
    maxPointSize?: (number|string);
    minPointSize?: (number|string);
    sizeBy?: VariablePieSizeByValue;
    states?: SeriesStatesOptions<VariablePieSeries>;
    zMax?: number;
    zMin?: number;
}

export type VariablePieSizeByValue = ('area'|'radius');

export default VariablePieSeriesOptions;
