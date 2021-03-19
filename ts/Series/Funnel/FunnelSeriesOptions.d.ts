/* *
 *
 *  Highcharts funnel module
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

import type FunnelDataLabelOptions from './FunnelDataLabelOptions';
import type FunnelSeries from './FunnelSeries';
import type PieSeriesOptions from '../Pie/PieSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface FunnelSeriesOptions extends PieSeriesOptions {
    width?: (number|string);
    neckWidth?: (number|string);
    height?: (number|string);
    neckHeight?: (number|string);
    reversed?: boolean;
    size?: undefined;
    dataLabels?: FunnelDataLabelOptions;
    states?: SeriesStatesOptions<FunnelSeries>;
}

export default FunnelSeriesOptions;
