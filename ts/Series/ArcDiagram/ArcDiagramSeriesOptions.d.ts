/* *
 *
 *  Arc diagram module
 *
 *  (c) 2021 Piotr Madej, Grzegorz Blachliński
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

import type DependencyWheelSeries from './../DependencyWheel/DependencyWheelSeries';
import type SankeySeriesOptions from '../Sankey/SankeySeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ArcDiagramSeriesOptions extends SankeySeriesOptions {
    center?: Array<(number|string|null)>;
    startAngle?: number;
    states?: SeriesStatesOptions<DependencyWheelSeries>;
}

export default ArcDiagramSeriesOptions;
