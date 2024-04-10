/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type Point from './Series/Point';
import type Pointer from './Pointer';
import type SVGAttributes from './Renderer/SVG/SVGAttributes';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Extended DOM event for pointer interaction.
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
