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

import type GaugeSeries from './GaugeSeries';
import type GaugeSeriesDialOptions from './GaugeSeriesDialOptions';
import type ColorType from '../../Core/Color/ColorType';
import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface GaugeSeriesPivotOptions {
    backgroundColor?: ColorType;
    borderColor?: ColorType;
    borderWidth?: number;
    radius?: number;
}

export interface GaugeSeriesOptions extends LineSeriesOptions {
    dial?: GaugeSeriesDialOptions;
    overshoot?: number;
    pivot?: GaugeSeriesPivotOptions;
    states?: SeriesStatesOptions<GaugeSeries>;
    wrap?: boolean;
}

/* *
 *
 *  Default export
 *
 * */

export default GaugeSeriesOptions;
