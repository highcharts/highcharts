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

import type Position3DObject from '../../Renderer/Position3DObject';
import type SVGAttributes from './SVGAttributes';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
interface SVGAttributes3D extends SVGAttributes {
    alpha?: number;
    beta?: number;
    center?: number;
    enabled?: (boolean|'auto'|'default');
    faces?: Array<SVGAttributes3D>;
    insidePlotArea?: boolean;
    vertexes?: Array<Position3DObject>;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default SVGAttributes3D;
