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
import type Chart from '../Chart/Chart';
import type Series from '../Series/Series';
import type Tick from './Tick';

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
 * Helper interface for axis compositions to add optional composition members
 * to all axis instances.
 *
 * Use the `declare module 'Types'` pattern to overload the interface in this
 * definition file.
 */
export interface AxisComposition extends AxisLike {
}

/**
 * Helper interface for axis types to add optional members to all axis
 * instances.
 *
 * Use the `declare module 'Types'` pattern to overload the interface in this
 * definition file.
 */
export interface AxisLike {
    categories?: Array<string>;
    chart: Chart;
    coll: string;
    isXAxis?: boolean;
    max: (null|number);
    min: (null|number);
    options: Highcharts.AxisOptions;
    reversed?: boolean;
    series: Array<Series>;
    side: number;
    ticks: Record<string, Tick>;
    userOptions: DeepPartial<Highcharts.AxisOptions>;
    visible: boolean;
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

/**
 *
 * Helper interface for Tick.
 *
 */
export interface TickLike {
    // Nothing here
}
