/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type BBoxObject from '../../Core/Renderer/BBoxObject.js';
import type LinePointOptions from './LinePointOptions.js';
import type LineSeries from './LineSeries.js';
import type Point from '../../Core/Series/Point.js';
import type Series from '../../Core/Series/Series.js';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../../Core/Series/PointBase.js' {
    interface PointBase {
        clientX?: number;
        dist?: number;
        distX?: number;
        hasImage?: boolean;
        isInside?: boolean;
        negative?: boolean;
        stackBox?: BBoxObject;
        stackTotal?: number;
        stackY?: (number|null);
        yBottom?: number;
        zone?: Series.ZoneObject;
    }
}

declare class LinePoint extends Point {
    options: LinePointOptions;
    /** @internal */
    series: LineSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default LinePoint;
