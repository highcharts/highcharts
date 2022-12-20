/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type ColorType from '../../Core/Color/ColorType';
import type HeatmapSeries from './HeatmapSeries';
import type { HeatmapPointMarkerOptions } from './HeatmapPointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface HeatmapSeriesOptions extends ScatterSeriesOptions {
    colsize?: number;
    marker?: HeatmapPointMarkerOptions;
    nullColor?: ColorType;
    pointPadding?: number;
    rowsize?: number;
    states?: SeriesStatesOptions<HeatmapSeries>;
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesStateHoverOptions {
        brightness?: number;
    }
}

export default HeatmapSeriesOptions;
