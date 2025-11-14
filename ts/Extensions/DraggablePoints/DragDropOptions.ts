/* *
 *
 *  Imports
 *
 * */

import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';
import type { CursorValue } from '../../Core/Renderer/CSSObject';
import type {
    PointDragCallbackFunction,
    PointDragStartCallbackFunction,
    PointDropCallbackFunction
} from './DraggablePoints';

/* *
 *
 *  Declarations
 *
 * */

export interface DragDropGuideBoxOptions {
    className?: string;
    color?: ColorType;
    cursor?: string;
    lineColor?: ColorString;
    lineWidth?: number;
    zIndex?: number;
}

export interface DragDropGuideBoxDefaultOptions extends DragDropGuideBoxOptions {
    /**
     * CSS class name of the guide box in this state. Defaults to
     * `highcharts-drag-box-default`.
     *
     * @since 6.2.0
     */
    className?: DragDropGuideBoxOptions['className'];

    /**
     * Guide box fill color.
     *
     * @type  {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @default 'rgba(0, 0, 0, 0.1)'
     * @since 6.2.0
     */
    color?: DragDropGuideBoxOptions['color'];

    /**
     * Guide box cursor.
     *
     * @default 'move'
     * @since 6.2.0
     */
    cursor?: DragDropGuideBoxOptions['cursor'];

    /**
     * Color of the border around the guide box.
     *
     * @type  {Highcharts.ColorString}
     * @default '#888'
     * @since 6.2.0
     */
    lineColor?: DragDropGuideBoxOptions['lineColor'];

    /**
     * Width of the line around the guide box.
     *
     * @default 1
     * @since 6.2.0
     */
    lineWidth?: DragDropGuideBoxOptions['lineWidth'];

    /**
     * Guide box zIndex.
     *
     * @default 900
     * @since 6.2.0
     */
    zIndex?: DragDropGuideBoxOptions['zIndex'];
}

export interface DragDropOptions {
    /**
     * Enable dragging in the X dimension.
     *
     * @type      {boolean}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.draggableX
     */
    draggableX?: boolean;

    /**
     * Enable dragging in the Y dimension. Note that this is not supported for
     * TreeGrid axes (the default axis type in Gantt charts).
     *
     * @type      {boolean}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.draggableY
     */
    draggableY?: boolean;

    /**
     * Options for the drag handles available in column series.
     *
     * @declare      Highcharts.DragDropHandleOptionsObject
     * @since        6.2.0
     * @optionparent plotOptions.column.dragDrop.dragHandle
     */
    dragHandle?: DragDropHandleOptions;

    /**
     * Set the maximum X value the points can be moved to.
     *
     * @sample {gantt} gantt/dragdrop/drag-gantt
     *         Limit dragging
     * @sample {highcharts} highcharts/dragdrop/drag-xrange
     *         Limit dragging
     *
     * @type      {number|string}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.dragMaxX
     */
    dragMaxX?: number;

    /**
     * Set the maximum Y value the points can be moved to.
     *
     * @sample {gantt} gantt/dragdrop/drag-gantt
     *         Limit dragging
     * @sample {highcharts} highcharts/dragdrop/drag-xrange
     *         Limit dragging
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.dragMaxY
     */
    dragMaxY?: number;

    /**
     * Set the minimum X value the points can be moved to.
     *
     * @sample {gantt} gantt/dragdrop/drag-gantt
     *         Limit dragging
     * @sample {highcharts} highcharts/dragdrop/drag-xrange
     *         Limit dragging
     *
     * @type      {number|string}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.dragMinX
     */
    dragMinX?: number;

    /**
     * Set the minimum Y value the points can be moved to.
     *
     * @sample {gantt} gantt/dragdrop/drag-gantt
     *         Limit dragging
     * @sample {highcharts} highcharts/dragdrop/drag-xrange
     *         Limit dragging
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.dragMinY
     */
    dragMinY?: number;

    /**
     * The X precision value to drag to for this series. Set to 0 to disable. By
     * default this is disabled, except for category axes, where the default is
     * `1`.
     *
     * @type      {number}
     * @default   0
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.dragPrecisionX
     */
    dragPrecisionX?: number;

    /**
     * The Y precision value to drag to for this series. Set to 0 to disable. By
     * default this is disabled, except for category axes, where the default is
     * `1`.
     *
     * @type      {number}
     * @default   0
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.dragPrecisionY
     */
    dragPrecisionY?: number;

    /**
     * The amount of pixels to drag the pointer before it counts as a drag
     * operation. This prevents drag/drop to fire when just clicking or
     * selecting points.
     *
     * @type      {number}
     * @default   2
     * @since     6.2.0
     */
    dragSensitivity?: number;

    /**
     * Group the points by a property. Points with the same property value will
     * be grouped together when moving.
     *
     * @sample {gantt} gantt/dragdrop/drag-gantt
     *         Drag grouped points
     * @sample {highcharts} highcharts/dragdrop/drag-xrange
     *         Drag grouped points
     *
     * @type      {string}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.groupBy
     */
    groupBy?: string;

    /**
     * Style options for the guide box. The guide box has one state by default,
     * the `default` state.
     *
     * @declare Highcharts.PlotOptionsSeriesDragDropGuideBoxOptions
     * @since 6.2.0
     * @type  {Highcharts.Dictionary<Highcharts.DragDropGuideBoxOptionsObject>}
     */
    guideBox?: Record<string, DragDropGuideBoxOptions> & {
        /**
         * Style options for the guide box default state.
         *
         * @declare Highcharts.DragDropGuideBoxOptionsObject
         * @since   6.2.0
         */
        'default'?: DragDropGuideBoxDefaultOptions;
    };

    /**
     * Update points as they are dragged. If false, a guide box is drawn to
     * illustrate the new point size.
     *
     * @sample {gantt} gantt/dragdrop/drag-gantt
     *         liveRedraw disabled
     * @sample {highcharts} highcharts/dragdrop/drag-xrange
     *         liveRedraw disabled
     *
     * @type      {boolean}
     * @default   true
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.liveRedraw
     */
    liveRedraw?: boolean;
}

export interface DragDropHandleOptions {
    /**
     * The class name of the drag handles. Defaults to `highcharts-drag-handle`.
     *
     * @since 6.2.0
     */
    className?: string;

    /**
     * The fill color of the drag handles.
     *
     * @type  {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @since 6.2.0
     */
    color?: ColorType;

    /**
     * The mouse cursor to use for the drag handles. By default this is
     * intelligently switching between `ew-resize` and `ns-resize` depending on
     * the direction the point is being dragged.
     *
     * @type      {string}
     * @since     6.2.0
     * @apioption plotOptions.column.dragDrop.dragHandle.cursor
     */
    cursor?: CursorValue;

    /**
     * The line color of the drag handles.
     *
     * @type  {Highcharts.ColorString}
     * @since 6.2.0
     */
    lineColor?: ColorString;

    /**
     * The line width for the drag handles.
     *
     * @since 6.2.0
     */
    lineWidth?: number;

    /**
     * Function to define the SVG path to use for the drag handles. Takes
     * the point as argument. Should return an SVG path in array format. The
     * SVG path is automatically positioned on the point.
     *
     * @type      {Function}
     * @since     6.2.0
     * @apioption plotOptions.column.dragDrop.dragHandle.pathFormatter
     */
    pathFormatter?: Function;

    /**
     * The z index for the drag handles.
     *
     * @since 6.2.0
     */
    zIndex?: number;
}

declare module '../../Core/Series/PointOptions' {
    interface PointEventsOptions {
        /**
         * Callback that fires while dragging a point. The mouse event is
         * passed in as parameter. The original data can be accessed from
         * `e.origin`, and the new point values can be accessed from
         * `e.newPoints`. If there is only a single point being updated,
         * it can be accessed from `e.newPoint` for simplicity, and its ID
         * can be accessed from `e.newPointId`. The `this` context is the
         * point being dragged. To stop the default drag action, return false.
         * See [drag and drop options](plotOptions.series.dragDrop).
         *
         * @sample {highcharts} highcharts/dragdrop/drag-xrange
         *         Drag events
         * @sample {highcharts|highstock} highcharts/dragdrop/undraggable-points
         *         Dragging disabled for specific points
         *
         * @type      {Highcharts.PointDragCallbackFunction}
         * @since     6.2.0
         * @requires  modules/draggable-points
         * @apioption plotOptions.series.point.events.drag
         */
        drag?: PointDragCallbackFunction;

        /**
         * Callback that fires when starting to drag a point. The mouse event
         * object is passed in as an argument. If a drag handle is used,
         * `e.updateProp` is set to the data property being dragged. The `this`
         * context is the point.
         * See [drag and drop options](plotOptions.series.dragDrop).
         *
         * @sample {highcharts} highcharts/dragdrop/drag-xrange
         *         Drag events
         *
         * @type      {Highcharts.PointDragStartCallbackFunction}
         * @since     6.2.0
         * @requires  modules/draggable-points
         * @apioption plotOptions.series.point.events.dragStart
         */
        dragStart?: PointDragStartCallbackFunction;

        /**
         * Callback that fires when the point is dropped. The parameters passed
         * are the same as for [drag](#plotOptions.series.point.events.drag).
         * To stop the default drop action, return false.
         * See [drag and drop options](plotOptions.series.dragDrop).
         *
         * @sample {highcharts} highcharts/dragdrop/drag-xrange
         *         Drag events
         * @sample {highcharts|highstock} highcharts/dragdrop/undraggable-points
         *         Dragging disabled for specific points
         *
         * @type      {Highcharts.PointDropCallbackFunction}
         * @since     6.2.0
         * @requires  modules/draggable-points
         * @apioption plotOptions.series.point.events.drop
         */
        drop?: PointDropCallbackFunction;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default DragDropOptions;
