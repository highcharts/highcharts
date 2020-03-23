/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type Axis from '../Axis.js';
import type HiddenAxis from '../../parts-more/HiddenAxis.js';
import type LogarithmicAxis from '../LogarithmicAxis.js';
import type OrdinalAxis from '../OrdinalAxis.js';
import type RadialAxis from '../../parts-more/RadialAxis.js';
import type ScrollbarAxis from '../ScrollbarAxis.js';

export interface AxisComposition {
    logarithmic?: LogarithmicAxis['logarithmic'];
    ordinal?: OrdinalAxis['ordinal'];
    scrollbar?: ScrollbarAxis['scrollbar'];
}

/**
 * All possible axis types.
 */
export type AxisType = (
    Axis|
    HiddenAxis|
    OrdinalAxis|
    RadialAxis|
    ScrollbarAxis
);
