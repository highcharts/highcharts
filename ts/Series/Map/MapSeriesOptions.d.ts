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

import type ColorAxisComposition from '../../Core/Axis/Color/ColorAxisComposition';
import type ColorType from '../../Core/Color/ColorType';
import type MapPointOptions from './MapPointOptions';
import type MapSeries from './MapSeries';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type {
    SeriesDataOptionsObject,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';


/* *
 *
 *  Declarations
 *
 * */

export interface MapSeriesOptions
    extends ColorAxisComposition.SeriesCompositionOptions,
    ScatterSeriesOptions {
    affectsMapView?: boolean;
    data?: (
        Array<(PointOptions|PointShortOptions|MapPointOptions)>|
        SeriesDataOptionsObject
    );
    nullColor?: ColorType;
    nullInteraction?: boolean;
    states?: SeriesStatesOptions<MapSeries>;
}

/* *
 *
 *  Default Export
 *
 * */

export default MapSeriesOptions;
