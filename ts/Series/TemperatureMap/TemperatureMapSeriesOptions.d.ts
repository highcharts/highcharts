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

import type BubbleSeriesOptions from '../Bubble/BubbleSeriesOptions';
import type TemperatureMapSeries from './TemperatureMapSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface TemperatureMapSeriesOptions extends BubbleSeriesOptions {
    states?: SeriesStatesOptions<TemperatureMapSeries>;
}

export default TemperatureMapSeriesOptions;
