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

export interface BBOptions extends SMAOptions, Highcharts.MultipleLinesIndicatorOptions{
    params?: BBParamsOptions;
}

export interface BBParamsOptions extends SMAParamsOptions {
    standardDeviation: number;
    // for inheritance
}

export default BBOptions;
