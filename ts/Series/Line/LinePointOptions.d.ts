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

import type PointOptions from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/PointOptions' {
    interface PointOptions {
        keys?: Array<string>;
    }
    interface PointMarkerStateHoverOptions {
        radius?: number;
        radiusPlus?: number;
    }
}

export interface LinePointOptions extends PointOptions {
    // Nothing here yet
}

/* *
 *
 *  Default Export
 *
 * */

export default LinePointOptions;
