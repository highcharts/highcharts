/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
 * Exponential moving average indicator (EMA). This series requires the
 * `linkedTo` option to be set.
 *
 * @sample {highstock} stock/indicators/ema
 * Exponential moving average indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @interface Highcharts.EMAOptions
 */
export interface EMAOptions extends SMAOptions {
    params?: EMAParamsOptions;
}

export interface EMAParamsOptions extends SMAParamsOptions {
    /**
     * The point index which indicator calculations will base. For
     * example using OHLC data, index=2 means the indicator will be
     * calculated using Low values.
     *
     * By default index value used to be set to 0. Since
     * Highcharts Stock 7 by default index is set to 3
     * which means that the ema indicator will be
     * calculated using Close values.
     *
     * @default 3
     */
    index?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default EMAOptions;
