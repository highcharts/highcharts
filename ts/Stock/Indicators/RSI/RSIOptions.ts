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
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options for the RSI indicator.
 *
 * @interface Highcharts.RSIOptions
 * @extends Highcharts.SMAOptions
 */
export interface RSIOptions extends SMAOptions {
    /**
     * Parameters used in calculation of the RSI values.
     */
    params?: RSIParamsOptions;
}

/**
 * Parameters used in calculation of the RSI values.
 *
 * @interface Highcharts.RSIParamsOptions
 * @extends Highcharts.SMAParamsOptions
 */
export interface RSIParamsOptions extends SMAParamsOptions {
    /**
     * Number of decimal places to which the RSI should be rounded.
     */
    decimals?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default RSIOptions;
