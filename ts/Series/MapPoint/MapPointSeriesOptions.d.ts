/* *
 *
 *  Imports
 *
 * */

import type MapPointSeries from './MapPointSeries';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface MapPointSeriesOptions extends ScatterSeriesOptions {
    states?: SeriesStatesOptions<MapPointSeries>;
}

export default MapPointSeriesOptions;
