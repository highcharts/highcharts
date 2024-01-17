/* *
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

import type ColorType from '../../Core/Color/ColorType';
import type ColumnPointOptions from '../Column/ColumnPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export type FlagsShapeValue = ('circlepin'|'flag'|'nopin'|'squarepin');

export interface FlagsPointOptions extends ColumnPointOptions {
    fillColor?: ColorType;
    labelrank?: number;
    selected?: boolean;
    shape?: FlagsShapeValue;
    text?: string;
    title?: string;
    x?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default FlagsPointOptions;
