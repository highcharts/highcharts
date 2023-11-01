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
import type ColorType from '../../Core/Color/ColorType';
import type PolygonSeries from './PolygonSeries';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */
interface PolygonSeriesOptions extends ScatterSeriesOptions {
    fillColor?: ColorType;
    states?: SeriesStatesOptions<PolygonSeries>;
    trackByArea?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default PolygonSeriesOptions;
