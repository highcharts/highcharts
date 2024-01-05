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

import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type ScatterPointOptions from '../Scatter/ScatterPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface BubblePointMarkerOptions extends PointMarkerOptions {
    fillOpacity?: number;
}

export interface BubblePointOptions extends ScatterPointOptions {
    z?: (number|null);
}

/* *
 *
 *  Default Export
 *
 * */

export default BubblePointOptions;
