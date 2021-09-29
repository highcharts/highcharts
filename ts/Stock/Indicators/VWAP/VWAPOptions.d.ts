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

export interface VWAPOptions extends SMAOptions {
    params?: VWAPParamsOptions;
}

export interface VWAPParamsOptions extends SMAParamsOptions {
    // for inheritance
    volumeSeriesID?: string;
}

export default VWAPOptions;
