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

import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type LinePointOptions from './LinePointOptions';
import type LineSeries from './LineSeries';
import type Point from '../../Core/Series/Point';
import type Series from '../../Core/Series/Series';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../../Core/Series/PointBase' {
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

/** @internal */
declare class LinePoint extends Point {
    options: LinePointOptions;
    series: LineSeries;
}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default LinePoint;
