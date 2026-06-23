/* *
 *
 *  Highcharts variwide module
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
