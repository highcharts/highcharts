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

import type AreaPoint from '../Area/AreaPoint';
import type AreaSplinePointOptions from './AreaSplinePointOptions';
import type AreaSplineSeries from './AreaSplineSeries';
import type SplinePoint from '../Spline/SplinePoint';

/* *
 *
 *  Declarations
 *
 * */

declare class AreaSplinePoint extends SplinePoint {
    public isCliff?: AreaPoint['isCliff'];
    public options: AreaSplinePointOptions;
    public series: AreaSplineSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaSplinePoint;
