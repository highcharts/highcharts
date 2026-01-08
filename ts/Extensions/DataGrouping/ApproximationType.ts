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
