/* *
 *
 *  Dependency wheel module
 *
 *  (c) 2018-2021 Torstein Honsi
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

import type DependencyWheelSeries from './DependencyWheelSeries';
import type SankeySeriesOptions from '../Sankey/SankeySeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface DependencyWheelSeriesOptions extends SankeySeriesOptions {
    center?: Array<(number|string|null)>;
    startAngle?: number;
    states?: SeriesStatesOptions<DependencyWheelSeries>;
}

export default DependencyWheelSeriesOptions;
