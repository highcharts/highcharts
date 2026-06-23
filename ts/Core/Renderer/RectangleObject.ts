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
 *  Import
 *
 * */

import type BBoxObject from './BBoxObject';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A rectangle.
 */
export interface RectangleObject extends BBoxObject {
    /**
     * The stroke width of the rectangle.
     */
    strokeWidth?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default RectangleObject;
