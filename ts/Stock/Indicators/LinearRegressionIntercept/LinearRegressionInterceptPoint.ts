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
    './LinearRegressionInterceptIndicator.js';
import type LinearRegressionPoint from
    '../LinearRegression/LinearRegressionPoint.js';

/* *
 *
 *  Class
 *
 * */

declare class LinearRegressionInterceptPoint extends LinearRegressionPoint {
    /** @internal */
    public series: LinearRegressionInterceptIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionInterceptPoint;
