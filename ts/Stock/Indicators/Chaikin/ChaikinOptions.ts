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
 * @optionparent plotOptions.chaikin
 * @interface Highcharts.ChaikinOptions
 */
export interface ChaikinOptions extends EMAOptions {
    /**
     * Parameters used in calculation of Chaikin Oscillator
     * series points.
     *
     * @excluding index
     */
    params?: ChaikinParamsOptions;
}

export interface ChaikinParamsOptions extends EMAParamsOptions {
    index?: undefined;

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
     * @type    {Array<number>}
     * @default [3, 10]
     */
    periods?: Array<number>;
}

/* *
 *
 *  Default Export
 *
 * */

export default ChaikinOptions;
