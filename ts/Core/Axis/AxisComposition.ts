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
