/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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

import type Series from './Series';

/* *
 *
 *  Declarations
 *
 * */

/**
 * All possible series types.
 */
export type SeriesType = SeriesTypeRegistry[keyof SeriesTypeRegistry]['prototype'];

/**
 * Helper interface to add series types to `SeriesType`.
 *
 * Use the `declare module './SeriesType'` pattern to overload the interface in
 * this definition file.
 */
export interface SeriesTypeRegistry {
    [key: string]: typeof Series;
}

/* *
 *
 *  Export
 *
 * */

export default SeriesType;
