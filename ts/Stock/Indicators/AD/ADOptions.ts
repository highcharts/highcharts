/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
 * Options for the AD indicator.
 *
 * @interface Highcharts.ADOptions
 * @extends Highcharts.SMAOptions
 */
export interface ADOptions extends SMAOptions {
    /**
     * Parameters used in calculation of accumulation/distribution values.
     */
    params?: ADParamsOptions;
}

/**
 * Parameters used in calculation of accumulation/distribution values.
 *
 * @interface Highcharts.ADParamsOptions
 * @extends Highcharts.SMAParamsOptions
 */
export interface ADParamsOptions extends SMAParamsOptions {
    /**
     * The id of volume series which is mandatory. For example, using OHLC data,
     * volumeSeriesID='volume' means the indicator will be calculated using OHLC
     * and volume values.
     */
    volumeSeriesID?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default ADOptions;
