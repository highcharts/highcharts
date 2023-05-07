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
import type MultipleLinesComposition from '../MultipleLinesComposition';
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

export interface AroonOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    aroonDown?: Record<string, CSSObject>;
    marker?: PointMarkerOptions;
    params?: AroonParamsOptions;
}

export interface AroonParamsOptions extends SMAParamsOptions {
    period?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default AroonOptions;
