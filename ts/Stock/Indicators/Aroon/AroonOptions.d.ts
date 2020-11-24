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

import type CSSObject from '../../../Core/Renderer/CSSObject';
import type { PointMarkerOptions } from '../../../Core/Series/PointOptions';
import type {
    SMAOptions,
    SMAParamsOptions
} from '../SMA/SMAOptions';

/* *
*
*  Declarations
*
* */

export interface AroonOptions extends SMAOptions, Highcharts.MultipleLinesIndicatorOptions {
    aroonDown?: Record<string, CSSObject>;
    marker?: PointMarkerOptions;
    params?: AroonParamsOptions;
    tooltip?: Highcharts.TooltipOptions;
}

export interface AroonParamsOptions extends SMAParamsOptions {
    period?: number;
}

export default AroonOptions;
