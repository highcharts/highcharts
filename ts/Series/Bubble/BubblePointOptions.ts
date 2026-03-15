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
