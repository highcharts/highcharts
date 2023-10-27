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
import type PiePointOptions from '../Pie/PiePointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface FunnelPointOptions extends PiePointOptions {
    dataLabels?: FunnelDataLabelOptions;
}

export default FunnelPointOptions;
