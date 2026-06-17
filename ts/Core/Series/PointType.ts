/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type Point from './Point';

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
export type PointTypeOptions = PointType['options']; /* @todo
    (PointOptions&PointType['options']); */

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
 *  Default Export
 *
 * */

export default PointType;
