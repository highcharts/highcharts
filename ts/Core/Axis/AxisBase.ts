/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type AxisOptions from './AxisOptions';
import type Chart from '../Chart/Chart';
import type { DeepPartial } from '../../Shared/Types';
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
export interface AxisBase {
    categories?: Array<string>;
    chart: Chart;
    coll: string;
    isXAxis?: boolean;
    max?: number;
    min?: number;
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

export default AxisBase;
