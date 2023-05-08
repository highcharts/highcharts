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
