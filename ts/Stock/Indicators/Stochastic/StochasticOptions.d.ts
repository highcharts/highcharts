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
import type DataGroupingOptions from
    '../../../Extensions/DataGrouping/DataGroupingOptions';
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
    dataGrouping?: DataGroupingOptions;
    marker?: PointMarkerOptions;
    params?: StochasticParamsOptions;
    smoothedLine?: Record<string, CSSObject>;
}

export interface StochasticParamsOptions extends SMAParamsOptions {
    periods?: Array<number>;
}

/* *
 *
 *  Default Export
 *
 * */

export default StochasticOptions;
