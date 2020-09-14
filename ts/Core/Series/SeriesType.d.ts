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
import type { SeriesLikeOptions } from './SeriesLike';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Non-generic options for series.
 */
export type NonGenericOptions = (
    'data'|'id'|'index'|'legendIndex'|'mapData'|'name'|'stack'|'treemap'|'type'|
    'xAxis'|'yAxis'|'zIndex'
);

/**
 * All possible series types.
 */
export type SeriesType = SeriesTypeRegistry[keyof SeriesTypeRegistry]['prototype'];

/**
 * All possible options of series types.
 *
 * @name SeriesTypeOptions
 * @todo Renamte to `SeriesTypeOptions`
 */
export type SeriesOptionsType = SeriesLikeOptions&SeriesType['options'];

/**
 * All possible plot options of series types.
 */
export type SeriesTypePlotOptions = {
    [K in keyof SeriesOptionsType]?: DeepPartial<Omit<SeriesOptionsType, NonGenericOptions>>
};

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
