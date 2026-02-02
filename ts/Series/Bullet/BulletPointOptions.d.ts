/* *
 *
 *  (c) 2010-2026 Highsoft AS
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
