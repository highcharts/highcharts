/* *
 *
 *  Dependency wheel module
 *
 *  (c) 2018-2026 Highsoft AS
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
