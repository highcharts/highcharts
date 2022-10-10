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

import type AreaSeries from './AreaSeries';
import type ColorType from '../../Core/Color/ColorType';
import type { LineSeriesPlotOptions } from '../Line/LineSeriesOptions';
import type {
    SeriesOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface AreaSeriesOptions
    extends SeriesOptions, AreaSeriesPlotOptions
{
    // nothing to add
}

export interface AreaSeriesPlotOptions extends LineSeriesPlotOptions {
    fillColor?: ColorType;
    fillOpacity?: number;
    negativeFillColor?: ColorType;
    states?: SeriesStatesOptions<AreaSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaSeriesOptions;
