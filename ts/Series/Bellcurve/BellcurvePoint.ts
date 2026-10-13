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

declare class BellcurvePoint extends AreaSplinePoint {
    /** @internal */
    public option: BellcurvePointOptions;
    /** @internal */
    public series: BellcurveSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default BellcurvePoint;
