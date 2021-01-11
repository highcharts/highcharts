/* *
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

import type LinePointOptions from '../Line/LinePointOptions';
import type PieDataLabelOptions from './PieDataLabelOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface PiePointOptions extends LinePointOptions {
    dataLabels?: PieDataLabelOptions;
    sliced?: boolean;
    visible?: boolean;
}

export default PiePointOptions;
