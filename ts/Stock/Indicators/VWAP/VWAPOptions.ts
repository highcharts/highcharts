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
 * Volume Weighted Average Price indicator.
 *
 * This series requires `linkedTo` option to be set.
 *
 * @sample {highstock} stock/indicators/vwap
 *         Volume Weighted Average Price indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/vwap
 * @optionparent plotOptions.vwap
 * @interface Highcharts.VWAPOptions
 */
export interface VWAPOptions extends SMAOptions {
    /**
     * @excluding index
     */
    params?: VWAPParamsOptions;
}

export interface VWAPParamsOptions extends SMAParamsOptions {
    index?: undefined;
    /**
     * The id of volume series which is mandatory. For example using
     * OHLC data, volumeSeriesID='volume' means the indicator will be
     * calculated using OHLC and volume values.
     *
     * @default volume
     */
    volumeSeriesID?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default VWAPOptions;
