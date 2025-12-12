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
