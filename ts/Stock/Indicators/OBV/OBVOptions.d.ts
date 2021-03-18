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

export interface OBVOptions extends SMAOptions {
    params?: OBVParamsOptions;
}

export interface OBVParamsOptions extends SMAParamsOptions {
    // for inheritance
    volumeSeriesID?: string;
}

export default OBVOptions;
