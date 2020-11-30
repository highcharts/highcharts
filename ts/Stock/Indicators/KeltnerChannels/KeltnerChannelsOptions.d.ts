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

export interface KeltnerChannelsOptions extends SMAOptions {
    params?: KeltnerChannelsParamsOptions;
}

export interface KeltnerChannelsParamsOptions extends SMAParamsOptions {
    periodATR: number;
    multiplierATR: number;
    // for inheritance
}

export default KeltnerChannelsOptions;
