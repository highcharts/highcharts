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

import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type ScatterPointOptions from '../Scatter/ScatterPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface BubblePointMarkerOptions extends PointMarkerOptions {
    /**
     * The fill opacity of the bubble markers.
     */
    fillOpacity?: number;
}

export interface BubblePointOptions extends ScatterPointOptions {
    /**
     * The size value for each bubble. The bubbles' diameters are computed
     * based on the `z`, and controlled by series options like `minSize`,
     * `maxSize`, `sizeBy`, `zMin` and `zMax`.
     *
     * @product highcharts
     */
    z?: (number|null);
}

/* *
 *
 *  Default Export
 *
 * */

export default BubblePointOptions;
