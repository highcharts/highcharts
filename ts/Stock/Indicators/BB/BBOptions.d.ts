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

import type MultipleLinesComposition from '../MultipleLinesComposition';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface BBOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    params?: BBParamsOptions;
}

export interface BBParamsOptions extends SMAParamsOptions {
    standardDeviation: number;
    // for inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default BBOptions;
