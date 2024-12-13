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

    /**
     * The fill color of an individual flag. By default it inherits from
     * the series color.
     *
     * @product highstock
     *
     * @apioption series.flags.data.fillColor
     */
    fillColor?: ColorType;

    labelrank?: number;

    selected?: boolean;

    shape?: FlagsShapeValue;

    /**
     * The longer text to be shown in the flag's tooltip.
     *
     * @product highstock
     */
    text?: string;

    /**
     * The short text to be shown on the flag.
     *
     * @product highstock
     */
    title?: string;

    x?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default FlagsPointOptions;
