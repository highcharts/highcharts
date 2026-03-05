/* *
 *
 *  (c) 2010-2025 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  Extension for radial axes
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
