/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type Point from './Series/Point';
import type Pointer from './Pointer';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Extended DOM event for pointer interaction.
 */
export interface PointerEvent extends globalThis.PointerEvent {
    accumulate?: boolean;
    chartX: number;
    chartY: number;
    point?: Point;
    touches?: Array<Touch>;
    xAxis?: Array<Pointer.AxisCoordinateObject>;
    yAxis?: Array<Pointer.AxisCoordinateObject>;
}

/* *
 *
 *  Export
 *
 * */

export default PointerEvent;
