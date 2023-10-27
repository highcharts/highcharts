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
    interpolation?: boolean;
    marker?: HeatmapPointMarkerOptions;
    nullColor?: ColorType;
    pointPadding?: number;
    rowsize?: number;
    states?: SeriesStatesOptions<HeatmapSeries>;
}

declare module '../../Core/Series/StatesOptions' {
    interface StateHoverOptions {
        height?: number;
        heightPlus?: number;
        width?: number;
        widthPlus?: number;
    }
    interface StateInactiveOptions {
        height?: number;
        heightPlus?: number;
        width?: number;
        widthPlus?: number;
    }
    interface StateSelectOptions {
        height?: number;
        heightPlus?: number;
        width?: number;
        widthPlus?: number;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesStateHoverOptions {
        brightness?: number;
    }
    interface SeriesStateInactiveOptions {
        brightness?: number;
    }
    interface SeriesStateSelectOptions {
        brightness?: number;
    }
}

export default HeatmapSeriesOptions;
