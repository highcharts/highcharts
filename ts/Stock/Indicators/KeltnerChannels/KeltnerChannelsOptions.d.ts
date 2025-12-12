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

export interface KeltnerChannelsOptions extends SMAOptions {
    params?: KeltnerChannelsParamsOptions;
}

export interface KeltnerChannelsParamsOptions extends SMAParamsOptions {
    periodATR: number;
    multiplierATR: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default KeltnerChannelsOptions;
