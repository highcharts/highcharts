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
