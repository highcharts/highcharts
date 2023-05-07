/* *
 *
 *  Plugin for resizing axes / panes in a chart.
 *
 *  (c) 2010-2023 Highsoft AS
 *
 *  Author: Kacper Madej
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
