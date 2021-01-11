/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type SVGPath from './SVGPath';
import type SVGPath3D from './SVGPath3D';

/* *
 *
 *  Declarations
 *
 * */

export interface SVGCuboid extends SVGPath3D {
    front: SVGPath;
    isFront: number;
    isTop: number;
    side: SVGPath;
    top: SVGPath;
    zIndexes: Record<string, number>;
    forcedSides?: Array<string>;
}

export default SVGCuboid;
