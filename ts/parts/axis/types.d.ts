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
import type DateTimeAxis from '../DateTimeAxis';
import type HiddenAxis from '../../parts-more/HiddenAxis';
import type LogarithmicAxis from '../LogarithmicAxis';
import type OrdinalAxis from '../OrdinalAxis';
import type RadialAxis from '../../parts-more/RadialAxis';
import type ScrollbarAxis from '../ScrollbarAxis';

export interface AxisComposition {
    dateTime?: DateTimeAxis['dateTime'];
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
    LogarithmicAxis|
    OrdinalAxis|
    RadialAxis|
    ScrollbarAxis
);
