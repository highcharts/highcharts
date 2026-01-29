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
 * Commodity Channel Index (CCI). This series requires `linkedTo` option to
 * be set.
 *
 * @sample {highstock} stock/indicators/cci
 *         CCI indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/cci
 * @optionparent plotOptions.cci
 * @interface Highcharts.CCIOptions
 */
export interface CCIOptions extends SMAOptions {
    params?: CCIParamsOptions;
}

export interface CCIParamsOptions extends SMAParamsOptions {
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

export default CCIOptions;
