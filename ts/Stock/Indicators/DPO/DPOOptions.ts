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
 * Detrended Price Oscillator. This series requires the `linkedTo` option to
 * be set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/dpo
 *         Detrended Price Oscillator
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/dpo
 * @optionparent plotOptions.dpo
 * @interface Highcharts.DPOOptions
 */
export interface DPOOptions extends SMAOptions {
    /**
     * Parameters used in calculation of Detrended Price Oscillator series
     * points.
     */
    params?: DPOParamsOptions;
}

export interface DPOParamsOptions extends SMAParamsOptions {
    /**
     * Period for Detrended Price Oscillator
     */
    period?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default DPOOptions;
