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

export interface PPOOptions extends EMAOptions {
    params?: PPOParamsOptions;
}

export interface PPOParamsOptions extends EMAParamsOptions {
    periods?: Array<number>;
}
/* *
*
*  Default Export
*
* */

export default PPOOptions;
