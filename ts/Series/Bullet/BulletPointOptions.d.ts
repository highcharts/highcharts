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

import type BulletTargetOptions from './BulletTargetOptions';
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
    targetOptions?: BulletTargetOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default BulletPointOptions;
