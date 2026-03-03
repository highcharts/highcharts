/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
