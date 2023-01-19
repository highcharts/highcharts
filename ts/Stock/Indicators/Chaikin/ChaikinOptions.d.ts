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
    EMAOptions,
    EMAParamsOptions
} from '../EMA/EMAOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ChaikinOptions extends EMAOptions {
    params?: ChaikinParamsOptions;
}

export interface ChaikinParamsOptions extends EMAParamsOptions {
    periods?: Array<number>;
    volumeSeriesID?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default ChaikinOptions;
