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

export interface KlingerOptions extends SMAOptions {
    params?: KlingerParamsOptions;
}

export interface KlingerParamsOptions extends SMAParamsOptions {
    // for inheritance
    fastAvgPeriod: number;
    slowAvgPeriod: number;
    signal: number;
}

export default KlingerOptions;
