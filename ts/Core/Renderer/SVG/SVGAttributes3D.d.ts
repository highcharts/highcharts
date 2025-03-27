/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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

export default SVGAttributes3D;
