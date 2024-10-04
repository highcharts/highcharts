/* *
 *
 *  (c) 2010-2024 Kamil Musialowski
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import { PointMarkerOptions } from '../../Core/Series/PointOptions';
import ScatterPoint from '../Scatter/ScatterPoint';

/* *
 *
 *  Imports
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

interface PointAndFigurePoint extends ScatterPoint {
    x: number;
    y: number;
    marker?: PointMarkerOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default PointAndFigurePoint;
