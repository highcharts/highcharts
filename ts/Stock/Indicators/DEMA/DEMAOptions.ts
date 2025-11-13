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
 * Options for the DEMA indicator.
 *
 * @interface Highcharts.DEMAOptions
 * @extends Highcharts.EMAOptions
 */
export interface DEMAOptions extends EMAOptions {
    /**
     * Parameters used in calculation of the DEMA values.
     */
    params?: DEMAParamsOptions;
}

/**
 * Parameters used in calculation of the DEMA values.
 *
 * @interface Highcharts.DEMAParamsOptions
 * @extends Highcharts.EMAParamsOptions
 */
export interface DEMAParamsOptions extends EMAParamsOptions {
    // For inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default DEMAOptions;
