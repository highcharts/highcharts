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

/** @internal */
export interface AxisBreakBorderObject {
    move: string;
    size?: number;
    value: number;
}

/** @internal */
export interface AxisBreakObject {
    from: number;
    len: number;
    to: number;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default AxisBreakBorderObject;
