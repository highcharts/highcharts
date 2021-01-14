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

import type Point from './Point';
import type PointOptions from './PointOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * All possible series point types.
 */
export type PointType = PointTypeRegistry[keyof PointTypeRegistry]['prototype'];

/**
 * All possible options of series types.
 */
export type PointTypeOptions = (PointOptions&PointType['options']);

/**
 * Helper interface to add series point types to `PointType`.
 *
 * Use the `declare module './PointType'` pattern to overload the interface in
 * this definition file.
 */
export interface PointTypeRegistry {
    [key: string]: typeof Point;
}

/* *
 *
 *  Export
 *
 * */

export default PointType;
