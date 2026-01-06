/* *
 *
 *  (c) 2010-2026 Highsoft AS
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

import type PositionObject from '../Renderer/PositionObject';

/* *
 *
 *  Declarations
 *
 * */

export interface GeometryObject extends PositionObject {
    angle?: number;
    r?: number;
    indexes?: [number, number];
}

/* *
 *
 *  Default Export
 *
 * */

export default GeometryObject;
