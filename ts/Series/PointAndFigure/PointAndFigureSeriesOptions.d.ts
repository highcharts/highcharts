/* *
 *
 *  (c) 2010-2024
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

import { PointMarkerOptions } from '../../Core/Series/PointOptions';
import ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */


interface PointAndFigureSeriesOptions extends ScatterSeriesOptions {
    boxSize?: number|string;
    reversalAmount?: number;
    pointPadding?: number;
    markerUp?: PnfPointMarkerOptions;
}

interface PnfPointMarkerOptions extends PointMarkerOptions {
    markerUp?: PointMarkerOptions;
}


/* *
 *
 *  Default Export
 *
 * */

export default PointAndFigureSeriesOptions;
