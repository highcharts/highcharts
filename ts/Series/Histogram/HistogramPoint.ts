/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Sebastian Domas
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

import type ColumnPointType from '../Column/ColumnPoint.js';
import type HistogramPointOptions from './HistogramPointOptions.js';
import type HistogramSeries from './HistogramSeries.js';

/* *
 *
 *  Class
 *
 * */

declare class HistogramPoint extends ColumnPointType {
    public options: HistogramPointOptions;
    /** @internal */
    public series: HistogramSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default HistogramPoint;
