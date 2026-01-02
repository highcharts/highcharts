/* *
 *
 *  Plugin for resizing axes / panes in a chart.
 *
 *  (c) 2010-2025 Highsoft AS
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
import type { CursorValue } from '../../Core/Renderer/CSSObject';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';

/* *
 *
 *  Declarations
 *
 * */

export interface AxisResizeControlledAxisOptions {
    /**
     * Array of axes that should move out of the way of resizing
     * being done for the current axis. If not set, the next axis
     * will be used.
     *
     * @sample {highstock} stock/yaxis/multiple-resizers
     *         Three panes with resizers
     * @sample {highstock} stock/yaxis/resize-multiple-axes
     *         One resizer controlling multiple axes
     *
     * @type     {Array<number|string>}
     * @default  []
     * @requires modules/drag-panes
     */
    next?: Array<number|string>;

    /**
     * Array of axes that should move with the current axis
     * while resizing.
     *
     * @sample {highstock} stock/yaxis/multiple-resizers
     *         Three panes with resizers
     * @sample {highstock} stock/yaxis/resize-multiple-axes
     *         One resizer controlling multiple axes
     *
     * @type     {Array<number|string>}
     * @default  []
     * @requires modules/drag-panes
     */
    prev?: Array<number|string>;
}

export interface AxisResizeOptions {
    /**
     * Contains two arrays of axes that are controlled by control line
     * of the axis.
     *
     * @requires modules/drag-panes
     */
    controlledAxis?: AxisResizeControlledAxisOptions;

    /**
     * Cursor style for the control line.
     *
     * In styled mode use class `highcharts-axis-resizer` instead.
     *
     * @requires modules/drag-panes
     */
    cursor?: CursorValue;

    /**
     * Enable or disable resize by drag for the axis.
     *
     * @sample {highstock} stock/demo/candlestick-and-volume
     *         Enabled resizer
     *
     * @requires modules/drag-panes
     */
    enabled?: boolean;

    /**
     * Color of the control line.
     *
     * In styled mode use class `highcharts-axis-resizer` instead.
     *
     * @sample {highstock} stock/yaxis/styled-resizer
     *         Styled resizer
     *
     * @type     {Highcharts.ColorString}
     * @requires modules/drag-panes
     */
    lineColor?: ColorType;

    /**
     * Dash style of the control line.
     *
     * In styled mode use class `highcharts-axis-resizer` instead.
     *
     * @see For supported options check [dashStyle](#plotOptions.series.dashStyle)
     *
     * @sample {highstock} stock/yaxis/styled-resizer
     *         Styled resizer
     *
     * @requires modules/drag-panes
     */
    lineDashStyle?: DashStyleValue;

    /**
     * Width of the control line.
     *
     * In styled mode use class `highcharts-axis-resizer` instead.
     *
     * @sample {highstock} stock/yaxis/styled-resizer
     *         Styled resizer
     *
     * @requires modules/drag-panes
     */
    lineWidth?: number;

    /**
     * Horizontal offset of the control line.
     *
     * @sample {highstock} stock/yaxis/styled-resizer
     *         Styled resizer
     *
     * @requires modules/drag-panes
     */
    x?: number;

    /**
     * Vertical offset of the control line.
     *
     * @sample {highstock} stock/yaxis/styled-resizer
     *         Styled resizer
     *
     * @requires modules/drag-panes
     */
    y?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default AxisResizeOptions;
