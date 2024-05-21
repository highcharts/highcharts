/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

export interface KeyboardEvent extends globalThis.KeyboardEvent {
    chartX: number;
    chartY: number;
    point?: Point;
}

export default KeyboardEvent;
