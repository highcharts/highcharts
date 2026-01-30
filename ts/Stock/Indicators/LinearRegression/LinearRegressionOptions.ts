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

import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Linear regression indicator. This series requires `linkedTo` option to be
 * set.
 *
 * @sample {highstock} stock/indicators/linear-regression
 *         Linear regression indicator
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/regressions
 * @optionparent plotOptions.linearregression
 * @interface Highcharts.LinearRegressionOptions
 */
export interface LinearRegressionOptions extends SMAOptions {
    params?: LinearRegressionParamsOptions;
}

export interface LinearRegressionParamsOptions extends SMAParamsOptions {
    /**
     * Unit (in milliseconds) for the x axis distances used to
     * compute the regression line parameters (slope & intercept)
     * for every range. In Highcharts Stock the x axis values are
     * always represented in milliseconds which may cause that
     * distances between points are "big" integer numbers.
     *
     * Highcharts Stock's linear regression algorithm (least squares
     * method) will utilize these "big" integers for finding the
     * slope and the intercept of the regression line for each
     * period. In consequence, this value may be a very "small"
     * decimal number that's hard to interpret by a human.
     *
     * For instance: `xAxisUnit` equaled to `86400000` ms (1 day)
     * forces the algorithm to treat `86400000` as `1` while
     * computing the slope and the intercept. This may enhance the
     * legibility of the indicator's values.
     *
     * Default value is the closest distance between two data
     * points.
     *
     * In `v9.0.2`, the default value has been changed
     * from `undefined` to `null`.
     *
     * @sample {highstock} stock/plotoptions/linear-regression-xaxisunit
     *         xAxisUnit set to 1 minute
     *
     * @example
     * // In Linear Regression Slope Indicator series `xAxisUnit` is
     * // `86400000` (1 day) and period is `3`. There're 3 points in
     * // the base series:
     *
     * data: [
     *   [Date.UTC(2020, 0, 1), 1],
     *   [Date.UTC(2020, 0, 2), 3],
     *   [Date.UTC(2020, 0, 3), 5]
     * ]
     *
     * // This will produce one point in the indicator series that
     * // has a `y` value of `2` (slope of the regression line). If
     * // we change the `xAxisUnit` to `1` (ms) the value of the
     * // indicator's point will be `2.3148148148148148e-8` which is
     * // harder to interpret for a human.
     *
     * @type    {null|number}
     * @product highstock
     */
    xAxisUnit?: null|number;
}

/** @internal */
export interface RegressionLineParametersObject {
    slope: number;
    intercept: number;
}

/* *
 *
 * Default Export
 *
 * */

export default LinearRegressionOptions;
