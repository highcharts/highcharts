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
 * Chande Momentum Oscilator (CMO) technical indicator. This series
 * requires the `linkedTo` option to be set and should be loaded after
 * the `stock/indicators/indicators.js` file.
 *
 * @sample {highstock} stock/indicators/cmo
 *         CMO indicator
 *
 * @extends      plotOptions.sma
 * @since 9.1.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/cmo
 * @optionparent plotOptions.cmo
 * @interface Highcharts.CMOOptions
 */
export interface CMOOptions extends SMAOptions {
    params?: CMOParamsOptions;
}

export interface CMOParamsOptions extends SMAParamsOptions {
    // For inheritance
}

export default CMOOptions;
