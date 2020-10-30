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

import type SeriesLike from './SeriesLike';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Helper interface for point types to add optional members to all point
 * instances.
 *
 * Use the `declare module './PointLike'` pattern to overload the interface in
 * this definition file.
 */
export interface PointLike {
    options: PointLikeOptions;
    series: SeriesLike;
}

/**
 * Helper interface for point types to add event options to all point options.
 *
 * Use the `declare module './PointLike'` pattern to overload the interface in
 * this definition file.
 */
export interface PointLikeEventOptions {

}

/**
 * Helper interface for point types to add options to all point options.
 *
 * Use the `declare module './PointLike'` pattern to overload the interface in
 * this definition file.
 */
export interface PointLikeOptions {
    events?: PointLikeEventOptions;
}

/* *
 *
 *  Exports
 *
 * */

export default PointLike;
