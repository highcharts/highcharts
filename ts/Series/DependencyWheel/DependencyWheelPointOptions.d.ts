/* *
 *
 *  Dependency wheel module
 *
 *  (c) 2018-2026 Highsoft AS
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

import type SankeyPointOptions from '../Sankey/SankeyPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface DependencyWheelPointOptions extends SankeyPointOptions {
    linkWeight?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default DependencyWheelPointOptions;
