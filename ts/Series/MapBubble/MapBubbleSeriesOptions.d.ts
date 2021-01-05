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
import type MapBubbleSeries from './MapBubbleSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface MapBubbleSeriesOptions extends BubbleSeriesOptions {
    states?: SeriesStatesOptions<MapBubbleSeries>;
}

export default MapBubbleSeriesOptions;
