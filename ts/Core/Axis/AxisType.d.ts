/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type Axis from './Axis';

/* *
 *
 *  Declarations
 *
 * */

/**
 * All possible axis types.
 */
export type AxisType = AxisTypeRegistry[keyof AxisTypeRegistry];

/**
 * All possible axis options.
 */
export type AxisTypeOptions = AxisType['options'];

/**
 * Helper interface to add axis types to `AxisType`.
 *
 * Use the `declare module 'Types'` pattern to overload the interface in this
 * definition file.
 */
export interface AxisTypeRegistry {
    Axis: Axis;
}

/* *
 *
 *  Default Export
 *
 * */

export default AxisType;
