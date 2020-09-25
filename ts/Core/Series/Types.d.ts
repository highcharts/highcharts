/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type Series from './Series';

/**
 * All possible series options.
 */
export type SeriesOptionsType = SeriesType['options'];

/**
 * All possible series plotOptions.
 */
export type SeriesPlotOptionsType = {
    [K in keyof SeriesTypeRegistry]?: (
        Omit<SeriesTypeRegistry[K]['prototype']['options'],
        (
            'data'|'id'|'index'|'legendIndex'|'mapData'|'name'|'stack'|
            'treemap'|'type'|'xAxis'|'yAxis'|'zIndex'
        )>
    )
};

/**
 * All possible series types.
 */
export type SeriesType = SeriesTypeRegistry[keyof SeriesTypeRegistry]['prototype'];

/**
 * Helper interface for series types to add optional members to all series
 * instances.
 *
 * Use the `declare module 'Types'` pattern to overload the interface in this
 * definition file.
 */
export interface SeriesLike {
    options: SeriesLikeOptions;
    userOptions: DeepPartial<SeriesLikeOptions>;
    drawGraph(): void;
    translate(): void;
    update(options: DeepPartial<SeriesLikeOptions>): void;
}

/**
 * Helper interface for series types to add options to all series options.
 *
 * Use the `declare module 'Types'` pattern to overload the interface in this
 * definition file.
 */
export interface SeriesLikeOptions /* @todo */ extends Highcharts.SeriesOptions {
    data?: Array<Highcharts.PointOptionsType>;
    type?: string;
}

/**
 * Helper interface to add series types to `SeriesOptionsType` and `SeriesType`.
 *
 * Use the `declare module 'Types'` pattern to overload the interface in this
 * definition file.
 */
export interface SeriesTypeRegistry {
    [key: string]: typeof Series;
}
