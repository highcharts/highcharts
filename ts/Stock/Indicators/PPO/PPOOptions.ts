/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
 * @interface Highcharts.PPOOptions
 */
export interface PPOOptions extends EMAOptions {
    params?: PPOParamsOptions;
}

export interface PPOParamsOptions extends EMAParamsOptions {
    /**
     * Periods for Percentage Price Oscillator calculations.
     *
     * @default [12, 26]
     */
    periods?: Array<number>;

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

export default PPOOptions;
