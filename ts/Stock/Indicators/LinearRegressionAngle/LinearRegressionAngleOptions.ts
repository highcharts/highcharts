/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type LinearRegressionOptions from
    '../LinearRegression/LinearRegressionOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Linear regression angle indicator. This series requires `linkedTo`
 * option to be set.
 *
 * @sample {highstock} stock/indicators/linear-regression-angle
 *         Linear regression angle indicator
 *
 * @extends      plotOptions.linearregression
 * @since        7.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/regressions
 * @interface Highcharts.LinearRegressionAngleOptions
 */
export interface LinearRegressionAngleOptions extends LinearRegressionOptions {
}

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionAngleOptions;
