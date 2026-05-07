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

import type BarPointOptions from './BarPointOptions';
import type BarSeries from './BarSeries';
import type ColumnPoint from '../Column/ColumnPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class BarPoint extends ColumnPoint {
    public options: BarPointOptions;
    public series: BarSeries;
}

/* *
 *
 *  Export Default
 *
 * */

/** @internal */
export default BarPoint;
