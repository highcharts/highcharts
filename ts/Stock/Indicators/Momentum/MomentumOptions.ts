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
 * Momentum. This series requires `linkedTo` option to be set.
 *
 * @sample {highstock} stock/indicators/momentum
 *         Momentum indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/momentum
 * @optionparent plotOptions.momentum
 * @interface Highcharts.MomentumOptions
 */
export interface MomentumOptions extends SMAOptions {
    params?: MomentumParamsOptions;
    period: number;
}

export interface MomentumParamsOptions extends SMAParamsOptions {
    // For inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default MomentumOptions;
