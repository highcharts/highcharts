/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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

export interface ADOptions extends SMAOptions {
    params?: ADParamsOptions;
}

export interface ADParamsOptions extends SMAParamsOptions {
    volumeSeriesID?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default ADOptions;
