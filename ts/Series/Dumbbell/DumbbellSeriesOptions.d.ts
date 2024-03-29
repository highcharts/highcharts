/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type AreaRangeSeriesOptions from '../AreaRange/AreaRangeSeriesOptions';
import type DumbbellSeries from './DumbbellSeries';
import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

interface DumbbellSeriesOptions extends AreaRangeSeriesOptions {
    states?: SeriesStatesOptions<DumbbellSeries>;
    connectorColor?: ColorString;
    connectorWidth?: number;
    groupPadding?: number;
    pointPadding?: number;
    lowColor?: ColorType;
}

/* *
 *
 *  Default Export
 *
 * */

export default DumbbellSeriesOptions;
