/* *
 *
 *  (c) 2019-2025 Torstein Honsi
 *
 *  Item series type for Highcharts
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
