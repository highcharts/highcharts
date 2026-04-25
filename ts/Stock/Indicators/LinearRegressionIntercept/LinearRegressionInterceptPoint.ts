/* *
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
