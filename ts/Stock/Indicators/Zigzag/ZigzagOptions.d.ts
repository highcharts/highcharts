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
