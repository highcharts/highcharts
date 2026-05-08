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
