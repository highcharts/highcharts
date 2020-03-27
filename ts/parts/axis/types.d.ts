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
import type HiddenAxis from '../../parts-more/HiddenAxis';
import type NavigatorAxis from '../NavigatorAxis';
import type OrdinalAxis from '../OrdinalAxis';
import type RadialAxis from '../../parts-more/RadialAxis';
import type ScrollbarAxis from '../ScrollbarAxis';

export interface AxisComposition {
    navigatorAxis?: NavigatorAxis['navigatorAxis'];
    ordinal?: OrdinalAxis['ordinal'];
    scrollbar?: ScrollbarAxis['scrollbar'];
}

/**
 * All possible axis types.
 */
export type AxisType = (
    Axis|
    HiddenAxis|
    NavigatorAxis|
    OrdinalAxis|
    RadialAxis|
    ScrollbarAxis
);
