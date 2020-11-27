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
import type CSSObject from '../../../Core/Renderer/CSSObject';
import type { PointMarkerOptions } from '../../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface StochasticOptions extends SMAOptions, Highcharts.MultipleLinesIndicatorOptions{
    dataGrouping?: Highcharts.DataGroupingOptionsObject;
    marker?: PointMarkerOptions;
    params?: StochasticParamsOptions;
    smoothedLine?: Record<string, CSSObject>;
    tooltip?: Highcharts.TooltipOptions;
}

export interface StochasticParamsOptions extends SMAParamsOptions {
    periods?: Array<number>;
    // for inheritance
}

export default StochasticOptions;
