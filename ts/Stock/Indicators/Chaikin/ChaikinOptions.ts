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
    EMAOptions,
    EMAParamsOptions
} from '../EMA/EMAOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options for the Chaikin oscillator indicator.
 *
 * @interface Highcharts.ChaikinOptions
 * @extends Highcharts.EMAOptions
 */
export interface ChaikinOptions extends EMAOptions {
    /**
     * Parameters used in calculation of the Chaikin oscillator values.
     */
    params?: ChaikinParamsOptions;
}

/**
 * Parameters used in calculation of the Chaikin oscillator values.
 *
 * @interface Highcharts.ChaikinParamsOptions
 * @extends Highcharts.EMAParamsOptions
 */
export interface ChaikinParamsOptions extends EMAParamsOptions {
    /**
     * Short and long-periods for the Chaikin oscillator.
     */
    periods?: Array<number>;

    /**
     * The id of volume series which is mandatory.
     */
    volumeSeriesID?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default ChaikinOptions;
