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

import type AreaPointOptions from './AreaPointOptions';
import type AreaSeries from './AreaSeries';
import LinePoint from '../Line/LinePoint.js';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../../Core/Series/PointBase' {
    interface PointBase {
        // Kept in PointBase so non-area point classes used by spline logic
        // (for example SplinePoint in getPointSpline) can safely read it.
        /** @internal */
        isCliff?: boolean;
    }
}

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class AreaPoint extends LinePoint {
    public leftNull?: boolean;
    public options: AreaPointOptions;
    public rightNull?: boolean;
    public series: AreaSeries;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default AreaPoint;
