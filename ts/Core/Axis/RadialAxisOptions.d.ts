/* *
 *
 *  (c) 2010-2024 Torstein Honsi
 *
 *  Extension for radial axes
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

import type { YAxisOptions } from './AxisOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface RadialAxisOptions extends YAxisOptions {
    // Nothing to add yet
}

interface RadialAxis {
    defaultCircularOptions: RadialAxisOptions,
    defaultRadialGaugeOptions: RadialAxisOptions,
    defaultRadialOptions: RadialAxisOptions
}

declare module '../Options' {
    interface Options {
        radialAxis?: RadialAxis
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default RadialAxisOptions;
