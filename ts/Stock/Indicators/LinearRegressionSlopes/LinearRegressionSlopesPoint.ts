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
    /** @internal */
    public series: LinearRegressionSlopesIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionSlopesPoint;
