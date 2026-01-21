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

import type LinearRegressionIndicator from './LinearRegressionIndicator';
import type SMAPoint from '../SMA/SMAPoint';

/* *
 *
 *  Class
 *
 * */

declare class LinearRegressionPoint extends SMAPoint {
    public series: LinearRegressionIndicator;
}

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionPoint;
