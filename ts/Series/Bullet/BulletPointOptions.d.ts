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

import type BulletSeriesTargetOptions from './BulletSeriesTargetOptions';
import type ColumnPointOptions from '../Column/ColumnPointOptions';
import type ColorType from '../../Core/Color/ColorType';


/* *
 *
 *  Declarations
 *
 * */

export interface BulletPointOptions extends ColumnPointOptions {
    borderColor?: ColorType;
    target?: number;
    targetOptions?: BulletSeriesTargetOptions;
}

/* *
 *
 *  Export
 *
 * */
export default BulletPointOptions;
