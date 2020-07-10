/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type Axis from './Axis';
import type Chart from '../Chart/Chart';
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

export interface AxisComposition extends AxisLike {
    // interface for composition types
}

export interface AxisLike {
    categories?: Array<string>;
    chart: Chart;
    coll: string;
    isXAxis?: boolean;
    max: (null|number);
    min: (null|number);
    options: Highcharts.AxisOptions;
    reversed?: boolean;
    series: Array<Highcharts.Series>;
    side: number;
    ticks: Record<string, Tick>;
    userOptions: DeepPartial<Highcharts.AxisOptions>;
    visible: boolean;
}

interface AxisTypeRegistry {
    Axis: Axis;
}
