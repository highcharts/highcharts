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
import type LogarithmicAxis from '../LogarithmicAxis';
import type OrdinalAxis from '../OrdinalAxis';
import type ScrollbarAxis from '../ScrollbarAxis';

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
    OrdinalAxis|
    ScrollbarAxis
);
