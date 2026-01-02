/* *
 *
 *  (c) 2010-2025 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
 * This is a placeholder type of the possible series options for
 * [Highcharts](../highcharts/series), [Highcharts Stock](../highstock/series),
 * [Highmaps](../highmaps/series), and [Gantt](../gantt/series).
 *
 * In TypeScript is this dynamically generated to reference all possible types
 * of series options.
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
