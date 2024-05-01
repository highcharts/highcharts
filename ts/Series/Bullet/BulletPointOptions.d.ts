/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type { BulletTargetOptions } from './BulletSeriesOptions';
import type ColumnPointOptions from '../Column/ColumnPointOptions';
import type ColorType from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

export interface BulletPointOptions extends ColumnPointOptions {

    borderColor?: ColorType;

    /**
     * The target value of a point.
     *
     * @product highcharts
     */
    target?: number;

    /**
     * Individual target options for each point.
     *
     * @since 6.0.0
     */
    targetOptions?: BulletTargetOptions;

}

/* *
 *
 *  Default Export
 *
 * */

export default BulletPointOptions;
