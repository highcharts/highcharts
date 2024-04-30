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
 * Imports
 *
 * */

import type ColumnPointOptions from '../Column/ColumnPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface VariwidePointOptions extends ColumnPointOptions {

    /**
     * The relative width for each column. On a category axis, the widths are
     * distributed so they sum up to the X axis length. On linear and datetime
     * axes, the columns will be laid out from the X value and Z units along the
     * axis.
     *
     * @product highcharts
     */
    z?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default VariwidePointOptions;
