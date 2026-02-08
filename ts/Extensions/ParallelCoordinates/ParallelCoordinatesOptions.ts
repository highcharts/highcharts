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
    /**
     * Common options for all yAxes rendered in a parallel coordinates plot.
     *
     * @since    6.0.0
     * @requires modules/parallel-coordinates
     */
    parallelAxes?: DeepPartial<AxisOptions>;

    /**
     * Flag to render charts as a parallel coordinates plot.
     *
     * @since    6.0.0
     * @requires modules/parallel-coordinates
     */
    parallelCoordinates?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default ParallelCoordinatesOptions;
