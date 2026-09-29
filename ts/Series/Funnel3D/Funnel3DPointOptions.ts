/* *
 *
 *  Imports
 *
 * */

import type ColumnPointOptions from '../Column/ColumnPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface Funnel3DPointOptions extends ColumnPointOptions {
    /**
     * By default sides fill is set to a gradient through this option being
     * set to `true`. Set to `false` to get solid color for the sides.
     *
     * @product highcharts
     */
    gradientForSides?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default Funnel3DPointOptions;
