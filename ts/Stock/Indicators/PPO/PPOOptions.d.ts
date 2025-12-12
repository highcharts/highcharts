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
