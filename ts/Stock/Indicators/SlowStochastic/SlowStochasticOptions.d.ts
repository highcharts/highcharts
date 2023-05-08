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
    // for inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default SlowStochasticOptions;
