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
 * @optionparent plotOptions.apo
 * @interface Highcharts.APOOptions
 */
export interface APOOptions extends EMAOptions {
    /**
     * Parameters used in calculation of Absolute Price Oscillator
     * series points.
     *
     * @excluding period
     */
    params?: APOParamsOptions;
}

export interface APOParamsOptions extends EMAParamsOptions {
    /**
     * Periods for Absolute Price Oscillator calculations.
     *
     * @type    {Array<number>}
     * @default [10, 20]
     * @since   7.0.0
     */
    periods?: Array<number>;
}

/* *
 *
 *  Default Export
 *
 * */

export default APOOptions;
