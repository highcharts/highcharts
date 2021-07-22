/* *
 *
 *  Imports
 *
 * */

import type PositionObject from '../Renderer/PositionObject';
import type SVGPath from '../Renderer/SVG/SVGPath';

/* *
 *
 *  Declarations
 *
 * */

export interface IntersectionObject {
    center: PositionObject;
    d: SVGPath;
}

/* *
 *
 *  Default Export
 *
 * */

export default IntersectionObject;
