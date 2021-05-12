/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type Axis from './Axis';

/**
 * All possible axis types.
 * @private
 */
export type AxisType = AxisTypeRegistry[keyof AxisTypeRegistry];

export interface AxisBreakBorderObject {
    move: string;
    size?: number;
    value: number;
}

export interface AxisBreakObject {
    from: number;
    len: number;
    to: number;
}

/**
 * Helper interface to add axis types to `AxisType`.
 *
 * Use the `declare module 'Types'` pattern to overload the interface in this
 * definition file.
 */
export interface AxisTypeRegistry extends Record<string, Axis> {
    Axis: Axis;
}
