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
 *  Declarations
 *
 * */

export interface SymbolOptions {
    anchorX?: number;
    anchorY?: number;
    backgroundSize?: ('contain'|'cover'|'within');
    context?: 'legend';
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

export default SymbolOptions;
