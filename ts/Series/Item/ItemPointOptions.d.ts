/* *
 *
 *  (c) 2019-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  Item series type for Highcharts
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

import type PiePointOptions from '../Pie/PiePointOptions';
import type { PointMarkerOptions } from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ItemPointOptions extends PiePointOptions {
    marker?: ItemPointMarkerOptions;
}

export interface ItemPointMarkerOptions extends PointMarkerOptions {
    radius?: undefined;
}

/* *
 *
 *  Default Export
 *
 * */

export default ItemPointOptions;
