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
 *  Imports
 *
 * */

import type { NonPlotOptions } from './SeriesOptions';
import type Series from './Series';

/* *
 *
 *  Declarations
 *
 * */

/**
 * All possible series types.
 */
export type SeriesType = (
    SeriesTypeRegistry[keyof SeriesTypeRegistry]['prototype']
);

/**
 * All possible series options.
 */
export type SeriesTypeOptions = SeriesType['options'];

/**
 * All possible series plotOptions.
 */
export type SeriesTypePlotOptions = {
    [K in keyof SeriesTypeRegistry]?: Omit<
    SeriesTypeRegistry[K]['prototype']['options'],
    NonPlotOptions
    >;
};

/**
 * Helper interface to add series types to `SeriesOptionsType` and `SeriesType`.
 *
 * Use the `declare module 'SeriesType'` pattern to overload the interface in
 * this definition file.
 */
export interface SeriesTypeRegistry {
    [key: string]: typeof Series;
}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesType;
