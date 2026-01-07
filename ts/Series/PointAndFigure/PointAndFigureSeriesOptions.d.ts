/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kamil Musialowski
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */


interface PointAndFigureSeriesOptions extends ScatterSeriesOptions {
    boxSize: number|string;
    reversalAmount: number;
    pointPadding: number;
    marker: PointMarkerOptions;
    markerUp: PointMarkerOptions;
}


/* *
 *
 *  Default Export
 *
 * */

export default PointAndFigureSeriesOptions;
