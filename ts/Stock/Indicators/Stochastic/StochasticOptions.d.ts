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

export interface StochasticOptions extends SMAOptions, MultipleLinesComposition.IndicatorOptions {
    dataGrouping?: Highcharts.DataGroupingOptionsObject;
    marker?: PointMarkerOptions;
    params?: StochasticParamsOptions;
    smoothedLine?: Record<string, CSSObject>;
}

export interface StochasticParamsOptions extends SMAParamsOptions {
    periods?: Array<number>;
    // for inheritance
}

export default StochasticOptions;
