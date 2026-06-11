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

import type { BulletTargetOptions } from './BulletSeriesOptions';
import type ColumnPointOptions from '../Column/ColumnPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface BulletPointOptions extends ColumnPointOptions {

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
