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
