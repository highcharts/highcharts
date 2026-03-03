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
 * Chaikin Oscillator. This series requires the `linkedTo` option to
 * be set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/chaikin
 *         Chaikin Oscillator
 *
 * @extends      plotOptions.ema
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/chaikin
 * @interface Highcharts.ChaikinOptions
 */
export interface ChaikinOptions extends EMAOptions {
    /**
     * Parameters used in calculation of Chaikin Oscillator
     * series points.
     */
    params?: ChaikinParamsOptions;
}

export interface ChaikinParamsOptions extends EMAParamsOptions {
    /**
     * The id of volume series which is mandatory.
     * For example using OHLC data, volumeSeriesID='volume' means
     * the indicator will be calculated using OHLC and volume values.
     */
    volumeSeriesID?: string;

    /**
     * Parameter used indirectly for calculating the `AD` indicator.
     * Decides about the number of data points that are taken
     * into account for the indicator calculations.
     */
    period?: number;

    /**
     * Periods for Chaikin Oscillator calculations.
     *
     * @default [3, 10]
     */
    periods?: Array<number>;

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

export default ChaikinOptions;
