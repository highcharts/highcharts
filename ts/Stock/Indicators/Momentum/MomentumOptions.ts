/* *
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
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
