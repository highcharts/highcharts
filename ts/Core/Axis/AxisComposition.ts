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

import type AxisBase from './AxisBase';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Helper interface for axis compositions to add optional composition members
 * to all axis instances.
 *
 * Use the `declare module 'Types'` pattern to overload the interface in this
 * definition file.
 */
export interface AxisComposition extends AxisBase {
    // Add with `declare module` pattern
}

/* *
 *
 *  Default Export
 *
 * */

export default AxisComposition;
