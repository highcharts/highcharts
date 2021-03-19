/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
