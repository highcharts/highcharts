/* *
 *
 *  (c) 2016-2021 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
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

import type { GanttDependencyOptions } from './GanttSeriesOptions';
import type {
    XRangePointOptions,
    XRangePointPartialFillOptions
} from '../../Series/XRange/XRangePointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface GanttPointOptions extends XRangePointOptions {
    completed?: (number|XRangePointPartialFillOptions);
    dependency?: GanttDependencyOptions;
    end?: number;
    milestone?: boolean;
    parent?: string;
    start?: number;
}

export default GanttPointOptions;
