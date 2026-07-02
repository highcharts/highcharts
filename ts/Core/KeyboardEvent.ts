/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
