/* *
 *
 *  Imports
 *
 * */

import type MapPointSeries from './MapPointSeries';
import type MapPointPointOptions from './MapPointPointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface MapPointSeriesOptions extends ScatterSeriesOptions {
    data?: MapPointPointOptions[];
    states?: SeriesStatesOptions<MapPointSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default MapPointSeriesOptions;
