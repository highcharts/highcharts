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
import type { SeriesStatesOptions } from '../../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Weighted moving average indicator (WMA). This series requires `linkedTo`
 * option to be set.
 *
 * @sample {highstock} stock/indicators/wma
 *         Weighted moving average indicator
 *
 * @extends      plotOptions.sma
 * @since        6.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/wma
 * @optionparent plotOptions.wma
 * @interface Highcharts.WMAOptions
 */
export interface WMAOptions extends SMAOptions {
    params?: WMAParamsOptions;
    states?: SeriesStatesOptions<WMAOptions>;
}

export interface WMAParamsOptions extends SMAParamsOptions {
    // For inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default WMAOptions;
