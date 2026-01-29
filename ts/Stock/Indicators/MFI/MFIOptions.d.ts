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

export interface MFIOptions extends SMAOptions {
    params?: MFIParamsOptions;
}

export interface MFIParamsOptions extends SMAParamsOptions {
    volumeSeriesID?: string;
    decimals?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default MFIOptions;
