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

export type SymbolKey = keyof SymbolTypeRegistry;

export type SymbolType = SymbolTypeRegistry[SymbolKey];

export interface SymbolTypeRegistry {
    // Add with declare module pattern
}

/* *
 *
 *  Default Export
 *
 * */

export default SymbolType;
