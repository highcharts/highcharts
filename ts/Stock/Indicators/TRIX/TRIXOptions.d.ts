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

export interface TRIXOptions extends SMAOptions {
    params?: TRIXParamsOptions;
}

export interface TRIXParamsOptions extends SMAParamsOptions {
    // For inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default TRIXOptions;
