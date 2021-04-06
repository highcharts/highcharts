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

import CSSObject from '../../../Core/Renderer/CSSObject';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface KlingerOptions extends SMAOptions {
    params?: KlingerParamsOptions;
    signalLine?: KlingerSignalOptions;
}

export interface KlingerSignalOptions {
    styles?: CSSObject;
}

export interface KlingerParamsOptions extends SMAParamsOptions {
    fastAvgPeriod: number;
    slowAvgPeriod: number;
    signalPeriod: number;
}

export default KlingerOptions;
