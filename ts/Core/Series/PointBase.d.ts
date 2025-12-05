/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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
import type SeriesBase from './SeriesBase';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Helper interface for point types to add optional members to all point
 * instances.
 *
 * Use the `declare module './PointBase'` pattern to overload the interface in
 * this definition file.
 */
export interface PointBase {
    options: PointOptions;
    series: SeriesBase;
}

/* *
 *
 *  Default Export
 *
 * */

export default PointBase;
