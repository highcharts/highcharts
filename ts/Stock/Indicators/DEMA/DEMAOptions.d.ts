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

export interface DEMAOptions extends EMAOptions {
    params?: EMAParamsOptions;
}

export interface DEMAParamsOptions extends EMAParamsOptions {
    // For inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default DEMAOptions;
