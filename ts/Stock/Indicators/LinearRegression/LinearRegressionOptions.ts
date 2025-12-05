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
     * compute the regression line parameters (slope & intercept) for
     * every range. In Highcharts Stock the x axis values are always
     * represented in milliseconds which may cause that distances
     * between points are "big" integer numbers.
     *
     * Highcharts Stock's linear regression algorithm (least squares
     * method) will utilize these "big" integers for finding the
     * slope and the intercept of the regression line for each
     * period. In consequence, this value may be a very "small"
     * decimal number that's hard to interpret by a human.
     *
     * For instance: `xAxisUnit` equals `86400000` ms (1 day)
     * and the `period` is `7` (7 days). There are 6 calculated
     * regression lines in total (based on points P0, P1, ...
     * P6 with dates being `7 days apart from each other).
     * The first regression line is fitted to: `{x:0, y: P0_Y}`
     * , `{x:1, y: P1_Y}`, `{x:2, y: P2_Y}`, `{x:3, y: P3_Y}`,
     * `{x:4, y: P4_Y}`, `{x:5, y: P5_Y}`, `{x:6, y: P6_Y}`. For
     * the first point in the series we also need to obtain the
     * parameters for the regression line by eliminating the oldest
     * point (P0): `{x:1, y: P1_Y}`, `{x:2, y: P2_Y}`, ..., `{x:7,
     * y: P7_Y}`. This approach is not good because for a big set of
     * points the calculations would not take into consideration all
     * of them.
     *
     * By default `xAxisUnit` is undefined. When this is the case
     * the distances between the points can be calculated correctly
     * and the slope and intercept values are scaled reasonably.
     *
     * @default undefined
     * @type    {number}
     * @product highstock
     */
    xAxisUnit?: null|number;
}

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
