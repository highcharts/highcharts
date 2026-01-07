/* *
 *
 *  Parallel coordinates module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Pawel Fus
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

import type AxisOptions from '../../Core/Axis/AxisOptions';
import type { DeepPartial } from '../../Shared/Types';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartOptions' {
    interface ChartOptions extends ParallelCoordinatesOptions {
        // Nothing to add
    }
}

interface ParallelCoordinatesOptions {
    parallelAxes?: DeepPartial<AxisOptions>;
    parallelCoordinates?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default ParallelCoordinatesOptions;
