/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kamil Musiałowski
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
