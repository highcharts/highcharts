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
}

/* *
 *
 *  Export
 *
 * */

export default PointerEvent;
