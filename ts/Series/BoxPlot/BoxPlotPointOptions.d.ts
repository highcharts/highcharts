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
import type BoxPlotPoint from './BoxPlotPoint';
import type ColumnPointOptions from '../Column/ColumnPointOptions';

/* *
 *
 *  Declarations
 *
 * */
export interface BoxPlotPointOptions extends ColumnPointOptions {
    high?: BoxPlotPoint['high'];
    low?: BoxPlotPoint['low'];
    median?: BoxPlotPoint['median'];
    q1?: BoxPlotPoint['q1'];
    q3?: BoxPlotPoint['q3'];
}

/* *
 *
 *  Export
 *
 * */

export default BoxPlotPointOptions;
