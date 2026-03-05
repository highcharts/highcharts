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

import type Point from './Series/Point';
import type Pointer from './Pointer';
import type SVGAttributes from './Renderer/SVG/SVGAttributes';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A native browser mouse or touch event, extended with position information
 * relative to the `Highcharts.Chart.container`.
 */
export interface PointerEvent extends globalThis.PointerEvent {
    accumulate?: boolean;
    chartX: number;
    chartY: number;
    lat?: number;
    lon?: number;
    point?: Point;
    touches?: Array<Touch>;
    xAxis?: Array<Pointer.AxisCoordinateObject>;
    yAxis?: Array<Pointer.AxisCoordinateObject>;
}

/** @internal */
export interface GetSelectionMarkerAttrsEvent {
    args: Record<string, number>;
    attrs: SVGAttributes;
    shapeType: 'arc'|'rect'|'path';
}

/* *
 *
 *  Export
 *
 * */

export default PointerEvent;
