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

/* *
 *
 *  Declarations
 *
 * */

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

export default SVGArc3D;
