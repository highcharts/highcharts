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
 * Average true range indicator (ATR). This series requires `linkedTo`
 * option to be set.
 *
 * @sample {highstock} stock/indicators/atr
 *         ATR indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/atr
 * @optionparent plotOptions.atr
 * @interface Highcharts.ATROptions
 */
export interface ATROptions extends SMAOptions {
    params?: ATRParamsOptions;
}

export interface ATRParamsOptions extends SMAParamsOptions {
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

export default ATROptions;
