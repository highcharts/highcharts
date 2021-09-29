/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2021 Torstein Honsi, Lars A. V. Cabrera
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
import type ColumnPointOptions from '../Column/ColumnPointOptions';
import type ColorType from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */
export interface XRangePointOptions extends ColumnPointOptions {
    partialFill?: XRangePointPartialFillOptions;
    x2?: number;
}

export interface XRangePointPartialFillOptions {
    amount?: number;
    fill?: ColorType;
    height?: number;
    width?: number;
    r?: number;
    x?: number;
    y?: number;
}

/* *
 *
 *  Default Export
 *
 * */
export default XRangePointOptions;
