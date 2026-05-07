/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
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

import type AreaSplinePoint from '../AreaSpline/AreaSplinePoint';
import type BellcurvePointOptions from './BellcurvePointOptions';
import type BellcurveSeries from './BellcurveSeries';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class BellcurvePoint extends AreaSplinePoint {
    public option: BellcurvePointOptions;
    public series: BellcurveSeries;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default BellcurvePoint;
