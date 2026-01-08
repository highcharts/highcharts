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

import type PositionObject from './PositionObject';
import type SizeObject from './SizeObject';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Bounding box of an element.
 */
export interface BBoxObject extends PositionObject, SizeObject {
    /**
     * Height of the bounding box.
     */
    height: number;
    /**
     * Width of the bounding box.
     */
    width: number;
    /**
     * Horizontal position of the bounding box.
     */
    x: number;
    /**
     * Vertical position of the bounding box.
     */
    y: number;
    /**
     * The polygon of the bounding box, used for more accurate collision
     * detection.
     */
    polygon?: Array<[number, number]>;
}

/* *
 *
 *  Default Export
 *
 * */

export default BBoxObject;
