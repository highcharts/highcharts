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

import type LinearRegressionSlopesIndicator from
    './LinearRegressionSlopesIndicator';
import type LinearRegressionPoint from
    '../LinearRegression/LinearRegressionPoint';

/* *
 *
 *  Class
 *
 * */

declare class LinearRegressionSlopesPoint extends LinearRegressionPoint {
    public series: LinearRegressionSlopesIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionSlopesPoint;
