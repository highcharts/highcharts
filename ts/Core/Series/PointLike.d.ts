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

import type PointOptions from './PointOptions';
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
    options: PointOptions;
    series: SeriesLike;
}

/* *
 *
 *  Exports
 *
 * */

export default PointLike;
