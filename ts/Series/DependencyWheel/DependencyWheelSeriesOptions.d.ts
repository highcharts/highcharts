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
import SankeyDataLabelOptions from '../Sankey/SankeyDataLabelOptions';

/* *
 *
 *  Declarations
 *
 * */

interface DependencyWheelSeriesOptions extends SankeySeriesOptions {
    center?: Array<(number|string|null)>;
    dataLabels: DependencyWheelDataLabelOptions;
    startAngle?: number;
    states?: SeriesStatesOptions<DependencyWheelSeries>;
}

interface DependencyWheelDataLabelOptions extends SankeyDataLabelOptions {
    rotationMode?: 'circular';
}

export { DependencyWheelSeriesOptions, DependencyWheelDataLabelOptions };
