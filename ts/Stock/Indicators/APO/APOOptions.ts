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
 * Absolute Price Oscillator. This series requires the `linkedTo` option to
 * be set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/apo
 *         Absolute Price Oscillator
 *
 * @extends      plotOptions.ema
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/apo
 * @interface Highcharts.APOOptions
 */
export interface APOOptions extends EMAOptions {
    /**
     * Parameters used in calculation of Absolute Price Oscillator
     * series points.
     */
    params?: APOParamsOptions;
}

export interface APOParamsOptions extends EMAParamsOptions {
    /**
     * Periods for Absolute Price Oscillator calculations.
     *
     * @default [10, 20]
     * @since   7.0.0
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

export default APOOptions;
