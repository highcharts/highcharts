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

import type AxisType from '../../Core/Axis/AxisType';
import type {
    ControllableLabelOptions
} from './Controllables/ControllableOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface MockPointOptions {
    label?: ControllableLabelOptions;
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
