/* *
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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

export interface PivotPointsOptions extends SMAOptions {
    params?: PivotPointsParamsOptions;
}

export interface PivotPointsParamsOptions extends SMAParamsOptions {
    algorithm?: string;
}

/* *
 *
 *  Default Export
 *
 * */

export default PivotPointsOptions;
