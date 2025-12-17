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
 * Accumulation Distribution (AD). This series requires `linkedTo` option to
 * be set.
 *
 * @sample stock/indicators/accumulation-distribution
 *         Accumulation/Distribution indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/accumulation-distribution
 * @optionparent plotOptions.ad
 * @interface Highcharts.ADOptions
 */
export interface ADOptions extends SMAOptions {
    /**
     * @excluding index
     */
    params?: ADParamsOptions;
}

export interface ADParamsOptions extends SMAParamsOptions {
    index?: undefined;

    /**
     * The id of volume series which is mandatory.
     * For example using OHLC data, volumeSeriesID='volume' means
     * the indicator will be calculated using OHLC and volume values.
     *
     * @since 6.0.0
     */
    volumeSeriesID?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default ADOptions;
