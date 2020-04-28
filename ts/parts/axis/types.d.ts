/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type Axis from '../Axis';
import type ParallelAxis from '../../modules/parallel-coordinates.src';
import type RadialAxis from '../../parts-more/RadialAxis';
import type ScrollbarAxis from '../ScrollbarAxis';
import type StackingAxis from '../StackingAxis';
import type Tick from '../Tick';
import type TreeGridAxis from '../../parts-gantt/TreeGridAxis';
import type VMLAxis3D from '../../parts-3d/VMLAxis3D';
import type ZAxis from '../../parts-3d/ZAxis';

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

export interface AxisComposition {
    // interface for composition types
}

export interface AxisLike {
    categories?: Array<string>;
    chart: Highcharts.Chart;
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
