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

export interface ABandsOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    bottomLine?: Record<string, CSSObject>;
    lineWidth?: number;
    params?: ABandsParamsOptions;
    topLine?: Record<string, CSSObject>;
}

export interface ABandsParamsOptions extends SMAParamsOptions {
    factor?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default ABandsOptions;
