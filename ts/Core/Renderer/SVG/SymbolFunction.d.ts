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

export interface SymbolFunction {
    (
        x: number,
        y: number,
        width: number,
        height: number,
        options?: SymbolOptions
    ): SVGPath;
}

export interface SymbolOptions {
    anchorX?: number;
    anchorY?: number;
    backgroundSize?: ('contain'|'cover'|'within');
    clockwise?: (0|1);
    end?: number;
    height?: number;
    innerR?: number;
    longArc?: (0|1);
    open?: boolean;
    r?: number;
    start?: number;
    width?: number;
    x?: number;
    y?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default SymbolFunction;
