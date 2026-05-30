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

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
export interface SVGArc3D {
    out: SVGPath;
    inn: SVGPath;
    side1: SVGPath;
    side2: SVGPath;
    top: SVGPath;
    zInn: number;
    zOut: number;
    zSide1: number;
    zSide2: number;
    zTop: number;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default SVGArc3D;
