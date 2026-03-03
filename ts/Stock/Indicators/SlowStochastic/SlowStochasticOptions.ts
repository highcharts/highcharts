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

import type MultipleLinesComposition from '../MultipleLinesComposition';
import type {
    StochasticOptions,
    StochasticParamsOptions
} from '../Stochastic/StochasticOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Slow Stochastic oscillator. This series requires the `linkedTo` option
 * to be set and should be loaded after `stock/indicators/indicators.js`
 * and `stock/indicators/stochastic.js` files.
 *
 * @sample {highstock} stock/indicators/slow-stochastic
 *         Slow Stochastic oscillator
 *
 * @extends      plotOptions.stochastic
 * @since        8.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/stochastic
 * @requires     stock/indicators/slow-stochastic
 * @interface Highcharts.SlowStochasticOptions
 */
export interface SlowStochasticOptions extends StochasticOptions, MultipleLinesComposition.IndicatorOptions {
    params?: SlowStochasticParamsOptions;
}

export interface SlowStochasticParamsOptions extends StochasticParamsOptions {
    /**
     * Periods for Slow Stochastic oscillator: [%K, %D, SMA(%D)].
     *
     * @default [14, 3, 3]
     */
    periods?: Array<number>;
}

/* *
 *
 *  Default Export
 *
 * */

export default SlowStochasticOptions;
