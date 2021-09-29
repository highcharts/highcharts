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

export interface RSIOptions extends SMAOptions {
    params?: RSIParamsOptions;
}

export interface RSIParamsOptions extends SMAParamsOptions {
    // for inheritance
    decimals?: number;
}

export default RSIOptions;
