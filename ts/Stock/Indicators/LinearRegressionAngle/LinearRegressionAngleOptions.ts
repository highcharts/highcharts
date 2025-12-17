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
import type TooltipOptions from '../../../Core/TooltipOptions';

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
 * @optionparent plotOptions.linearregressionangle
 * @interface Highcharts.LinearRegressionAngleOptions
 */
export interface LinearRegressionAngleOptions extends LinearRegressionOptions {
    tooltip?: Partial<TooltipOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionAngleOptions;
