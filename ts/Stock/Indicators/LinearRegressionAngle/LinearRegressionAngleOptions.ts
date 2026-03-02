/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type LinearRegressionOptions from
    '../LinearRegression/LinearRegressionOptions';
import type { SeriesTooltipOptions } from '../../../Core/TooltipOptions';

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
    tooltip?: Partial<SeriesTooltipOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default LinearRegressionAngleOptions;
