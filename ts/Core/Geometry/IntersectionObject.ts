/* *
 *
 *  (c) 2010-2026 Highsoft AS
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
