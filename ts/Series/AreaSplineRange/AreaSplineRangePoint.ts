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

import type AreaSplineRangePointOptions from './AreaSplineRangePointOptions';
import type AreaSplineRangeSeries from './AreaSplineRangeSeries';
import AreaRangePoint from '../AreaRange/AreaRangePoint.js';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare class AreaSplineRangePoint extends AreaRangePoint {
    public option: AreaSplineRangePointOptions;
    public series: AreaSplineRangeSeries;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default AreaSplineRangePoint;
