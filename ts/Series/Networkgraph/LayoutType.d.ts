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

import type RFLayout from './ReingoldFruchtermanLayout';

/* *
 *
 *  Declarations
 *
 * */

/**
 * All possible layout types.
 */
export type LayoutType = (
    LayoutTypeRegistry[keyof LayoutTypeRegistry]['prototype']
);

/**
 * Helper interface to add series types to `SeriesOptionsType` and `SeriesType`.
 *
 * Use the `declare module 'SeriesType'` pattern to overload the interface in
 * this definition file.
 */
export interface LayoutTypeRegistry {
    [key: string]: typeof RFLayout;
}

/* *
 *
 *  Default Export
 *
 * */

export default LayoutType;
