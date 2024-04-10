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

export interface ZigzagOptions extends SMAOptions {
    params?: ZigzagParamsOptions;
}

export interface ZigzagParamsOptions extends SMAParamsOptions {
    lowIndex?: number;
    highIndex?: number;
    deviation?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default ZigzagOptions;
