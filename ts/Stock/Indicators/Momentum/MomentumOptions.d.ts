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

export interface MomentumOptions extends SMAOptions {
    params?: MomentumParamsOptions;
    period: number;
}

export interface MomentumParamsOptions extends SMAParamsOptions {
    // for inheritance
}

export default MomentumOptions;
