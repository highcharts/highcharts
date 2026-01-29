/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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
