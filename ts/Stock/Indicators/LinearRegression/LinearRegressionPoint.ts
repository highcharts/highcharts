/* *
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

import type LinearRegressionIndicator from './LinearRegressionIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class LinearRegressionPoint extends SMAPoint {
    /** @internal */
    public series: LinearRegressionIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionPoint;
