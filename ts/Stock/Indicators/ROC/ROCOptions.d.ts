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

/* *
 *
 *  Declarations
 *
 * */

export interface ROCOptions extends SMAOptions {
    params?: ROCParamsOptions;
}

export interface ROCParamsOptions extends SMAParamsOptions {
    // For inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default ROCOptions;
