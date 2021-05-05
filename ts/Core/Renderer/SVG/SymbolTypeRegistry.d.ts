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
import type SymbolOptions from './SymbolOptions';

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

export interface SymbolTypeRegistry {
    [key: string]: SymbolFunction;
}

/* *
 *
 *  Default Export
 *
 * */

export default SymbolTypeRegistry;
