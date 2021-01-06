/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Daniel Studencki
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

import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TimelineDataLabelOptions from './TimelineDataLabelOptions';
import type TimelinePointOptions from './TimelinePointOptions';
import type TimelineSeries from './TimelineSeries';

/* *
 *
 *  Declarations
 *
 * */

export interface TimelineSeriesOptions extends LineSeriesOptions {
    data?: Array<TimelinePointOptions>;
    dataLabels?: TimelineDataLabelOptions;
    ignoreHiddenPoint?: boolean;
    radius?: number;
    radiusPlus?: number;
    states?: SeriesStatesOptions<TimelineSeries>;
}

export default TimelineSeriesOptions;
