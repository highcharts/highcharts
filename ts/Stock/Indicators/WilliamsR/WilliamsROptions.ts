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
 * Williams %R. This series requires the `linkedTo` option to be
 * set and should be loaded after the `stock/indicators/indicators.js`.
 *
 * @sample {highstock} stock/indicators/williams-r
 *         Williams %R
 *
 * @extends      plotOptions.sma
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/williams-r
 * @optionparent plotOptions.williamsr
 * @interface Highcharts.WilliamsROptions
 */
export interface WilliamsROptions extends SMAOptions {
    params?: WilliamsRParamsOptions;
}

export interface WilliamsRParamsOptions extends SMAParamsOptions {
    /**
     * Period for Williams %R oscillator
     *
     * @default 14
     */
    period?: number;

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

export default WilliamsROptions;
