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

export interface CMOOptions extends SMAOptions {
    params?: CMOParamsOptions;
}

export interface CMOParamsOptions extends SMAParamsOptions {
    // For inheritance
}

export default CMOOptions;
