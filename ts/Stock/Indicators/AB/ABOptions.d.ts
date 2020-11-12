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

import type CSSObject from '../../../Core/Renderer/CSSObject';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ABOptions extends SMAOptions, Highcharts.MultipleLinesIndicatorOptions {
    bottomLine?: Record<string, CSSObject>;
    lineWidth?: number;
    params?: ABParamsOptions;
    topLine?: Record<string, CSSObject>;
}

export interface ABParamsOptions extends SMAParamsOptions {
    factor?: number;
}

export default ABOptions;
