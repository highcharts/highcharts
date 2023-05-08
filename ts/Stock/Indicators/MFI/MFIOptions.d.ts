/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
