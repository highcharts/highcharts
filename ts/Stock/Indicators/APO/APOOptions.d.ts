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
export interface APOOptions extends EMAOptions {
    params?: APOParamsOptions;
}

export interface APOParamsOptions extends EMAParamsOptions {
    periods?: Array<number>;
}

/* *
 *
 *  Default Export
 *
 * */

export default APOOptions;
