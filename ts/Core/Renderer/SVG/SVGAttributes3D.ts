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
