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

import type LinearRegressionAngleIndicator from
    './LinearRegressionAngleIndicator';
import type LinearRegressionPoint from
    '../LinearRegression/LinearRegressionPoint';

/* *
 *
 *  Class
 *
 * */

declare class LinearRegressionAnglePoint extends LinearRegressionPoint {
    /** @internal */
    public series: LinearRegressionAngleIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionAnglePoint;
