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

import type LinearRegressionAngleIndicator from
    './LinearRegressionAngleIndicator';
import type LinearRegressionPoint from
    '../LinearRegression/LinearRegressionPoint';

/* *
 *
 *  Class
 *
 * */

/** @internal */
declare class LinearRegressionAnglePoint extends LinearRegressionPoint {
    public series: LinearRegressionAngleIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default LinearRegressionAnglePoint;
