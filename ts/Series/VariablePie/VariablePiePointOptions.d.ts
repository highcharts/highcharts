/* *
 *
 *  Variable Pie module for Highcharts
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Grzegorz Blachliński
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type PiePointOptions from '../Pie/PiePointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface VariablePiePointOptions extends PiePointOptions {
    /**
     * The z value of the point.
     *
     * @type {number}
     *
     * @product highcharts
     *
     * @apioption series.variablepie.data.z
     */
}

/* *
 *
 *  Default Export
 *
 * */

export default VariablePiePointOptions;
