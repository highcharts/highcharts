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
