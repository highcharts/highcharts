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

export interface VWAPOptions extends SMAOptions {
    params?: VWAPParamsOptions;
}

export interface VWAPParamsOptions extends SMAParamsOptions {
    volumeSeriesID?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default VWAPOptions;
