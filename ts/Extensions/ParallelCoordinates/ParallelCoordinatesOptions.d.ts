/* *
 *
 *  Parallel coordinates module
 *
 *  (c) 2010-2024 Pawel Fus
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

import type AxisOptions from '../../Core/Axis/AxisOptions';

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
