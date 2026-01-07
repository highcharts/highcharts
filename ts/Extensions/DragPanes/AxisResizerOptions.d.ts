/* *
 *
 *  Plugin for resizing axes / panes in a chart.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Kacper Madej
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

import type ColorType from '../../Core/Color/ColorType';
import type {
    CursorValue
} from '../../Core/Renderer/CSSObject';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';

/* *
 *
 *  Declarations
 *
 * */

export interface AxisResizeControlledAxisOptions {
    next?: Array<number|string>;
    prev?: Array<number|string>;
}

export interface AxisResizeOptions {
    controlledAxis?: AxisResizeControlledAxisOptions;
    cursor?: CursorValue;
    enabled?: boolean;
    lineColor?: ColorType;
    lineDashStyle?: DashStyleValue;
    lineWidth?: number;
    x?: number;
    y?: number;
}

export interface AxisResizerOptions {
    maxLength?: (number|string);
    minLength?: (number|string);
    resize?: AxisResizeOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default AxisResizerOptions;
