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
 * Options for the DPO indicator.
 *
 * @interface Highcharts.DPOOptions
 * @extends Highcharts.SMAOptions
 */
export interface DPOOptions extends SMAOptions {
    /**
     * Parameters used in calculation of DPO values.
     */
    params?: DPOParamsOptions;
}

/**
 * Parameters used in calculation of DPO values.
 *
 * @interface Highcharts.DPOParamsOptions
 * @extends Highcharts.SMAParamsOptions
 */
export interface DPOParamsOptions extends SMAParamsOptions {
    // For inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default DPOOptions;
