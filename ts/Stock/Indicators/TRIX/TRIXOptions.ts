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
 * Triple exponential average (TRIX) oscillator. This series requires
 * `linkedTo` option to be set.
 *
 * @sample {highstock} stock/indicators/trix
 *         TRIX indicator
 *
 * @extends      plotOptions.tema
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
 *               navigatorOptions, pointInterval, pointIntervalUnit,
 *               pointPlacement, pointRange, pointStart, showInNavigator,
 *               stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/tema
 * @requires     stock/indicators/trix
 * @optionparent plotOptions.trix
 * @interface Highcharts.TRIXOptions
 */
export interface TRIXOptions extends SMAOptions {
    params?: TRIXParamsOptions;
}

export interface TRIXParamsOptions extends SMAParamsOptions {
    // For inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default TRIXOptions;
