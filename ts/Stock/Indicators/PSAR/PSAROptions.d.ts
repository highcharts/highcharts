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

export interface PSAROptions extends SMAOptions {
    params?: PSARParamsOptions;
}

export interface PSARParamsOptions extends SMAParamsOptions {
    // For inheritance
    initialAccelerationFactor?: number;
    maxAccelerationFactor?: number;
    increment?: number;
    decimals?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default PSAROptions;
