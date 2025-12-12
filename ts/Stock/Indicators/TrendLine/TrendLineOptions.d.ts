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
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface TrendLineParamsOptions extends SMAParamsOptions {
    // For inheritance
    index: number;
}

export interface TrendLineOptions extends SMAOptions {
    params?: TrendLineParamsOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default TrendLineOptions;
