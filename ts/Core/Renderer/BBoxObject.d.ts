/* *
 *
 *  (c) 2010-2025 Highsoft AS
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

export interface BBoxObject extends PositionObject, SizeObject {
    height: number;
    width: number;
    x: number;
    y: number;
    polygon?: [number, number][]
}

/* *
 *
 *  Default Export
 *
 * */

export default BBoxObject;
