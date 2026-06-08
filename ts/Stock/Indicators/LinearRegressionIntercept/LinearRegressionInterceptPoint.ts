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

import type LinearRegressionInterceptIndicator from
    './LinearRegressionInterceptIndicator';
import type LinearRegressionPoint from
    '../LinearRegression/LinearRegressionPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class LinearRegressionInterceptPoint extends LinearRegressionPoint {
    public series: LinearRegressionInterceptIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default LinearRegressionInterceptPoint;
