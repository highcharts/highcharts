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

import type AreaPoint from '../Area/AreaPoint.js';
import type AreaSplinePointOptions from './AreaSplinePointOptions.js';
import type AreaSplineSeries from './AreaSplineSeries.js';
import SplinePoint from '../Spline/SplinePoint.js';

/* *
 *
 *  Declarations
 *
 * */

declare class AreaSplinePoint extends SplinePoint {
    /** @internal */
    public isCliff?: AreaPoint['isCliff'];
    public options: AreaSplinePointOptions;
    /** @internal */
    public series: AreaSplineSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaSplinePoint;
