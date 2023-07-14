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

import type LollipopSeries from './LollipopSeries';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

export interface LollipopSeriesOptions extends ScatterSeriesOptions {
    connectorColor?: ColorString;
    connectorWidth?: number;
    groupPadding?: number;
    /** @deprecated */
    lowColor?: ColorType;
    pointPadding?: number;
    states?: SeriesStatesOptions<LollipopSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default LollipopSeriesOptions;
