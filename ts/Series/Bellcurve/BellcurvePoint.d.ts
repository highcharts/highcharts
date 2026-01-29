/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Sebastian Domas
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

import type AreaSplinePoint from '../AreaSpline/AreaSplinePoint';
import type BellcurvePointOptions from './BellcurvePointOptions';
import type BellcurveSeries from './BellcurveSeries';

/* *
 *
 *  Class
 *
 * */

export class BellcurvePoint extends AreaSplinePoint {
    public option: BellcurvePointOptions;
    public series: BellcurveSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default BellcurvePoint;
