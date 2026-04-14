/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
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
import SplinePoint from '../Spline/SplinePoint.js';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
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

/** @internal */
export default AreaSplinePoint;
