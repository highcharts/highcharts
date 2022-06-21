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

import type { AnnotationsLabelOptions } from './AnnotationsOptions';
import type AxisType from '../../Core/Axis/AxisType';

/* *
 *
 *  Declarations
 *
 * */

export interface MockPointOptions {
    label?: AnnotationsLabelOptions;
    x: number;
    xAxis?: (number|AxisType|null);
    y: number;
    yAxis?: (number|AxisType|null);
}

/* *
 *
 *  Export
 *
 * */

export default MockPointOptions;
