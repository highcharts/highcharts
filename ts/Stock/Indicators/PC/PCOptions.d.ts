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
import type MultipleLinesComposition from '../MultipleLinesComposition';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface PCOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    params?: PCParamsOptions;
    bottomLine: Record<string, CSSObject>;
    topLine: Record<string, CSSObject>;
}

export interface PCParamsOptions extends SMAParamsOptions {
    // for inheritance
}

/* *
 *
 *  Default Export
 *
 * */

export default PCOptions;
