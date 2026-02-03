/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

/** @internal */
export interface KeyboardEvent extends globalThis.KeyboardEvent {
    chartX: number;
    chartY: number;
    point?: Point;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default KeyboardEvent;
