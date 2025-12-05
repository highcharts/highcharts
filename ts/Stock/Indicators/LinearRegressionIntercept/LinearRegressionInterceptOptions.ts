/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
 * Linear regression intercept indicator. This series requires `linkedTo`
 * option to be set.
 *
 * @sample {highstock} stock/indicators/linear-regression-intercept
 *         Linear intercept slope indicator
 *
 * @extends      plotOptions.linearregression
 * @since        7.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires  stock/indicators/regressions
 * @optionparent plotOptions.linearregressionintercept
 * @interface Highcharts.LinearRegressionInterceptOptions
 */
export interface LinearRegressionInterceptOptions
    extends LinearRegressionOptions {
    // For inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionInterceptOptions;
