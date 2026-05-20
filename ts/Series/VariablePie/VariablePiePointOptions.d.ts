/* *
 *
 *  Variable Pie module for Highcharts
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Grzegorz Blachliński
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
