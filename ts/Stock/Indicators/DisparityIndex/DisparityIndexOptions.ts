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
 * Disparity Index.
 * This series requires the `linkedTo` option to be set and should
 * be loaded after the `stock/indicators/indicators.js` file.
 *
 * @sample {highstock} stock/indicators/disparity-index
 *         Disparity Index indicator
 *
 * @extends      plotOptions.sma
 * @since 9.1.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/disparity-index
 * @optionparent plotOptions.disparityindex
 * @interface Highcharts.DisparityIndexOptions
 */
export interface DisparityIndexOptions extends SMAOptions {
    params?: DisparityIndexParamsOptions;
}

export interface DisparityIndexParamsOptions extends SMAParamsOptions {
    /**
     * The average used to calculate the Disparity Index indicator.
     * By default it uses SMA, with EMA as an option. To use other
     * averages, e.g. TEMA, the `stock/indicators/tema.js` file needs to
     * be loaded.
     *
     * If value is different than `ema`, `dema`, `tema` or `wma`,
     * then sma is used.
     */
    average: 'sma'|'ema'|'dema'|'tema'|'wma';
}

export default DisparityIndexOptions;
