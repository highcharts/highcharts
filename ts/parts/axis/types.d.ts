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
import type HiddenAxis from '../../parts-more/HiddenAxis';
import type OrdinalAxis from '../OrdinalAxis';
import type RadialAxis from '../../parts-more/RadialAxis';
import type ScrollbarAxis from '../ScrollbarAxis';

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
    ordinal?: OrdinalAxis['ordinal'];
    scrollbar?: ScrollbarAxis['scrollbar'];
}

/**
 * All possible axis types.
 */
export type AxisType = (
    Axis|
    BrokenAxis|
    HiddenAxis|
    OrdinalAxis|
    RadialAxis|
    ScrollbarAxis
);
