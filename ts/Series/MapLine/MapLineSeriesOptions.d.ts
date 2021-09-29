/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type MapLineSeries from './MapLineSeries';
import type MapSeriesOptions from '../Map/MapSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface MapLineSeriesOptions extends MapSeriesOptions {
    fillColor?: ColorType;
    states?: SeriesStatesOptions<MapLineSeries>;
}

export default MapLineSeriesOptions;
