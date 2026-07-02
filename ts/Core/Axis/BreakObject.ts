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
