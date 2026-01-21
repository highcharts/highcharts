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
 * Trendline (linear regression) fits a straight line to the selected data
 * using a method called the Sum Of Least Squares. This series requires the
 * `linkedTo` option to be set.
 *
 * @sample {highstock} stock/indicators/trendline
 *         Trendline indicator
 *
 * @extends      plotOptions.sma
 * @since        7.1.3
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/trendline
 * @optionparent plotOptions.trendline
 * @interface Highcharts.TrendLineOptions
 */
export interface TrendLineOptions extends SMAOptions {
    params?: TrendLineParamsOptions;
}

export interface TrendLineParamsOptions extends SMAParamsOptions {
    /**
     * The point index which indicator calculations will base. For
     * example using OHLC data, index=2 means the indicator will be
     * calculated using Low values.
     *
     * @default 3
     */
    index: number;

    /* *
     *
     *  Excluded
     *
     * */

    period?: undefined;
}

/* *
 *
 *  Default Export
 *
 * */

export default TrendLineOptions;
