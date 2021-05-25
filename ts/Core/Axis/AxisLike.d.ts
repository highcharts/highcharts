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

import type AxisOptions from './AxisOptions';
import type Chart from '../Chart/Chart';
import type Series from '../Series/Series';
import type Tick from './Tick';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Helper interface for axis types to add optional members to all axis
 * instances.
 *
 * Use the `declare module 'Types'` pattern to overload the interface in this
 * definition file.
 */
export interface AxisLike {
    categories?: Array<string>;
    chart: Chart;
    coll: string;
    isXAxis?: boolean;
    max: (null|number);
    min: (null|number);
    options: AxisOptions;
    reversed?: boolean;
    series: Array<Series>;
    side: number;
    ticks: Record<string, Tick>;
    userOptions: DeepPartial<AxisOptions>;
    visible: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default AxisLike;
