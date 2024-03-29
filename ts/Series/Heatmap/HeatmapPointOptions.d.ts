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

import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type ScatterPointOptions from '../Scatter/ScatterPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface HeatmapPointMarkerOptions extends PointMarkerOptions {
    r?: number;
}

export interface HeatmapPointOptions extends ScatterPointOptions {
    borderWidth?: number;
    marker?: HeatmapPointMarkerOptions;
    pointPadding?: number;
    value?: (number|null);
}

/* *
 *
 *  Default Export
 *
 * */

export default HeatmapPointOptions;
