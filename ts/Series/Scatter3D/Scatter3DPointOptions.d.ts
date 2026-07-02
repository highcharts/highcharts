/* *
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
 *  Imports
 *
 * */

import type ScatterPointOptions from '../Scatter/ScatterPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface Scatter3DPointOptions extends ScatterPointOptions {

    /**
     * The z value for each data point.
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

export default Scatter3DPointOptions;
