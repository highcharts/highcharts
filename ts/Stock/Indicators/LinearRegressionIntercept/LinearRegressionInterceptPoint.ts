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

import type LinearRegressionInterceptIndicator from
    './LinearRegressionInterceptIndicator';
import type LinearRegressionPoint from
    '../LinearRegression/LinearRegressionPoint';

/* *
 *
 *  Class
 *
 * */

declare class LinearRegressionInterceptPoint extends LinearRegressionPoint {
    public series: LinearRegressionInterceptIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionInterceptPoint;
