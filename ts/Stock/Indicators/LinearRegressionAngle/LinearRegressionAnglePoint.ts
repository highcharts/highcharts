/* *
 *
 *  License: www.highcharts.com/license
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
    public series: LinearRegressionAngleIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionAnglePoint;
