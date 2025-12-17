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
 * Normalized average true range indicator (NATR). This series requires
 * `linkedTo` option to be set and should be loaded after the
 * `stock/indicators/indicators.js` and `stock/indicators/atr.js`.
 *
 * @sample {highstock} stock/indicators/natr
 *         NATR indicator
 *
 * @extends      plotOptions.atr
 * @since        7.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/natr
 * @optionparent plotOptions.natr
 * @interface Highcharts.NATROptions
 */
export interface NATROptions extends SMAOptions {
    params?: NATRParamsOptions;
}

export interface NATRParamsOptions extends SMAParamsOptions {
    index?: undefined;
}

/* *
 *
 *  Default Export
 *
 * */

export default NATROptions;
