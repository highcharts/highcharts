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

import type AreaRangePoint from '../AreaRange/AreaRangePoint';
import type AreaSplineRangePointOptions from './AreaSplineRangePointOptions';
import type AreaSplineRangeSeries from './AreaSplineRangeSeries';

/* *
 *
 *  Declarations
 *
 * */

declare class AreaSplineRangePoint extends AreaRangePoint {
    public option: AreaSplineRangePointOptions;
    public series: AreaSplineRangeSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaSplineRangePoint;
