/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

export interface SlowStochasticOptions extends StochasticOptions, MultipleLinesComposition.IndicatorOptions {
    params?: SlowStochasticParamsOptions;
}

export interface SlowStochasticParamsOptions extends StochasticParamsOptions {
    // For inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default SlowStochasticOptions;
