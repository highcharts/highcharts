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

import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface LinearRegressionOptions extends SMAOptions {
    params?: LinearRegressionParamsOptions;
}

export interface LinearRegressionParamsOptions extends SMAParamsOptions {
    xAxisUnit?: null|number;
}

export interface RegressionLineParametersObject {
    slope: number;
    intercept: number;
}

/* *
 *
 * Default Export
 *
 * */

export default LinearRegressionOptions;
