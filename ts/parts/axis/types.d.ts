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
import type BrokenAxis from '../../modules/broken-axis.src';
import type DateTimeAxis from '../DateTimeAxis';
import type GridAxis from '../../parts-gantt/GridAxis';
import type HiddenAxis from '../../parts-more/HiddenAxis';
import type LogarithmicAxis from '../LogarithmicAxis';
import type MapAxis from '../../parts-map/MapAxis';
import type NavigatorAxis from '../NavigatorAxis';
import type OrdinalAxis from '../OrdinalAxis';
import type ParallelAxis from '../../modules/parallel-coordinates.src';
import type RadialAxis from '../../parts-more/RadialAxis';
import type ScrollbarAxis from '../ScrollbarAxis';
import type VMLAxis3D from '../../parts-3d/VMLAxis3D';

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
    brokenAxis?: BrokenAxis['brokenAxis'];
    dateTime?: DateTimeAxis['dateTime'];
    grid?: GridAxis['grid'];
    logarithmic?: LogarithmicAxis['logarithmic'];
    navigatorAxis?: NavigatorAxis['navigatorAxis'];
    mapAxis?: MapAxis['mapAxis'];
    ordinal?: OrdinalAxis['ordinal'];
    parallelCoordinates?: ParallelAxis['parallelCoordinates'];
    scrollbar?: ScrollbarAxis['scrollbar'];
    vml?: VMLAxis3D['vml'];
}

/**
 * All possible axis types.
 */
export type AxisType = (
    Axis|
    BrokenAxis|
    GridAxis|
    HiddenAxis|
    LogarithmicAxis|
    MapAxis|
    NavigatorAxis|
    OrdinalAxis|
    ParallelAxis|
    RadialAxis|
    ScrollbarAxis|
    VMLAxis3D
);
