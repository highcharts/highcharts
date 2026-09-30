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

import type AreaSplinePoint from '../AreaSpline/AreaSplinePoint.js';
import type BellcurvePointOptions from './BellcurvePointOptions.js';
import type BellcurveSeries from './BellcurveSeries.js';

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
