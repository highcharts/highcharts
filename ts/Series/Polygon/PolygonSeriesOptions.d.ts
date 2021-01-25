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
 * Imports
 *
 * */
import type ColorType from '../../Core/Color/ColorType';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import PolygonSeries from './PolygonSeries';
import ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions.js';

/* *
 *
 * Declarations
 *
 * */
interface PolygonSeriesOptions extends ScatterSeriesOptions {
    fillColor?: ColorType;
    states?: SeriesStatesOptions<PolygonSeries>;
    trackByArea?: boolean;
}

/* *
 *
 * Export
 *
 * */
export default PolygonSeriesOptions;
