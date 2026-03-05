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
