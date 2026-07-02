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

export interface ApproximationArray extends Array<number> {
    hasNulls?: boolean;
}

export type ApproximationKeyValue = keyof ApproximationTypeRegistry;

export interface ApproximationTypeRegistry extends Record<string, Function> {

}

/* *
 *
 *  Default Export
 *
 * */

export default ApproximationKeyValue;
