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
 * Money Flow Index. This series requires `linkedTo` option to be set and
 * should be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample {highstock} stock/indicators/mfi
 *         Money Flow Index Indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/mfi
 * @optionparent plotOptions.mfi
 * @interface Highcharts.MFIOptions
 */
export interface MFIOptions extends SMAOptions {
    params?: MFIParamsOptions;
}

export interface MFIParamsOptions extends SMAParamsOptions {
    /**
     * The id of volume series which is mandatory.
     * For example using OHLC data, volumeSeriesID='volume' means
     * the indicator will be calculated using OHLC and volume values.
     */
    volumeSeriesID?: string;
    /**
     * Number of maximum decimals that are used in MFI calculations.
     */
    decimals?: number;

    /* *
     *
     *  Excluded
     *
     * */

    index?: undefined;
}

/* *
 *
 *  Default Export
 *
 * */

export default MFIOptions;
