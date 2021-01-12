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
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';
import type { SeriesStatesOptions } from '../../../Core/Series/SeriesOptions';
import type WMAIndicator from './WMAIndicator';

/* *
 *
 *  Declarations
 *
 * */

export interface WMAOptions extends SMAOptions {
    params?: WMAParamsOptions;
    states?: SeriesStatesOptions<WMAIndicator>;
}

export interface WMAParamsOptions extends SMAParamsOptions {
    // for inheritance
}

export default WMAOptions;
