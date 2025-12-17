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
    EMAOptions,
    EMAParamsOptions
} from '../EMA/EMAOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Percentage Price Oscillator. This series requires the
 * `linkedTo` option to be set and should be loaded after the
 * `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/ppo
 *         Percentage Price Oscillator
 *
 * @extends      plotOptions.ema
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/ppo
 * @optionparent plotOptions.ppo
 * @interface Highcharts.PPOOptions
 */
export interface PPOOptions extends EMAOptions {
    /**
     * @excluding period
     */
    params?: PPOParamsOptions;
}

export interface PPOParamsOptions extends EMAParamsOptions {
    period?: undefined;
    /**
     * Periods for Percentage Price Oscillator calculations.
     *
     * @type    {Array<number>}
     * @default [12, 26]
     */
    periods?: Array<number>;
}
/* *
 *
 *  Default Export
 *
 * */

export default PPOOptions;
