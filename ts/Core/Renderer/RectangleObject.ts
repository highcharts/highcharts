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
