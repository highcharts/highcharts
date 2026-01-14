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
import type { SeriesStatesOptions } from '../../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface WMAOptions extends SMAOptions {
    params?: WMAParamsOptions;
    states?: SeriesStatesOptions<WMAOptions>;
}

export interface WMAParamsOptions extends SMAParamsOptions {
    // For inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default WMAOptions;
