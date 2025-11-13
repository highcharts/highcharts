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
 * Options for the CMO indicator.
 *
 * @interface Highcharts.CMOOptions
 * @extends Highcharts.SMAOptions
 */
export interface CMOOptions extends SMAOptions {
    /**
     * Parameters used in calculation of CMO values.
     */
    params?: CMOParamsOptions;
}

/**
 * Parameters used in calculation of CMO values.
 *
 * @interface Highcharts.CMOParamsOptions
 * @extends Highcharts.SMAParamsOptions
 */
export interface CMOParamsOptions extends SMAParamsOptions {
    // For inheritance
}

export default CMOOptions;
