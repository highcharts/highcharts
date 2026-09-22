/* *
 *
 *  (c) 2019-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Item series type for Highcharts
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
