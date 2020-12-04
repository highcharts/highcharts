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
    StochasticOptions,
    StochasticParamsOptions
} from '../Stochastic/StochasticOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface SlowStochasticOptions extends StochasticOptions, Highcharts.MultipleLinesIndicatorOptions {
    params?: SlowStochasticParamsOptions;
}

export interface SlowStochasticParamsOptions extends StochasticParamsOptions {
    // for inheritance
}

export default SlowStochasticOptions;
