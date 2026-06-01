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

import type SVGPath from './SVGPath';
import type SVGPath3D from './SVGPath3D';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
export interface SVGCuboid extends SVGPath3D {
    front: SVGPath;
    isFront: number;
    isTop: number;
    side: SVGPath;
    top: SVGPath;
    zIndexes: Record<string, number>;
    forcedSides?: Array<string>;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default SVGCuboid;
