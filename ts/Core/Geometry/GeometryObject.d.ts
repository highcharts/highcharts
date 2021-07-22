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
