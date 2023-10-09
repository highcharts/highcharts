/* *
 *
 *  (c) 2009-2021 Highsoft AS
 *
 *  Authors: Øystein Moseng, Torstein Hønsi, Jon A. Nygård
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    DragDropGuideBoxOptions,
    DragDropHandleOptions,
    DragDropOptions
} from './DragDropOptions';

/* *
 *
 *  Declarations
 *
 * */

interface DragDropDefaults extends DragDropOptions {
    dragSensitivity: number;
    dragHandle: DragDropHandleOptions;
    guideBox: Record<string, DragDropGuideBoxOptions>;
}

/* *
 *
 *  API Options
 *
 * */

/**
 * The draggable-points module allows points to be moved around or modified in
 * the chart. In addition to the options mentioned under the `dragDrop` API
 * structure, the module fires three events,
 * [point.dragStart](plotOptions.series.point.events.dragStart),
 * [point.drag](plotOptions.series.point.events.drag) and
 * [point.drop](plotOptions.series.point.events.drop).
 *
 * @sample {highcharts|highstock}
 *         highcharts/dragdrop/resize-column
 *         Draggable column and line series
 * @sample {highcharts|highstock}
 *         highcharts/dragdrop/bar-series
 *         Draggable bar
 * @sample {highcharts|highstock}
 *         highcharts/dragdrop/drag-bubble
 *         Draggable bubbles
 * @sample {highcharts|highstock}
 *         highcharts/dragdrop/drag-xrange
 *         Draggable X range series
 * @sample {highcharts|highstock}
 *         highcharts/dragdrop/undraggable-points
 *         Dragging disabled for specific points
 * @sample {highmaps}
 *         maps/series/draggable-mappoint
 *         Draggable Map Point series
 *
 * @declare      Highcharts.SeriesDragDropOptionsObject
 * @since        6.2.0
 * @requires     modules/draggable-points
 * @optionparent plotOptions.series.dragDrop
 */
const DragDropDefaults: DragDropDefaults = {

    /**
     * Set the minimum X value the points can be moved to.
     *
     * @sample {gantt} gantt/dragdrop/drag-gantt
     *         Limit dragging
     * @sample {highcharts} highcharts/dragdrop/drag-xrange
     *         Limit dragging
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.dragMinX
     */

    /**
     * Set the maximum X value the points can be moved to.
     *
     * @sample {gantt} gantt/dragdrop/drag-gantt
     *         Limit dragging
     * @sample {highcharts} highcharts/dragdrop/drag-xrange
     *         Limit dragging
     *
     * @type      {number}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.dragMaxX
     */

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

    /**
     * Enable dragging in the X dimension.
     *
     * @type      {boolean}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.draggableX
     */

    /**
     * Enable dragging in the Y dimension. Note that this is not supported for
     * TreeGrid axes (the default axis type in Gantt charts).
     *
     * @type      {boolean}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.draggableY
     */

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

    /**
     * Set a key to hold when dragging to zoom the chart. This is useful to
     * avoid zooming while moving points. Should be set different than
     * [chart.panKey](#chart.panKey).
     *
     * @type       {string}
     * @since      6.2.0
     * @validvalue ["alt", "ctrl", "meta", "shift"]
     * @deprecated
     * @requires  modules/draggable-points
     * @apioption  chart.zoomKey
     */

    /**
     * Callback that fires when starting to drag a point. The mouse event object
     * is passed in as an argument. If a drag handle is used, `e.updateProp` is
     * set to the data property being dragged. The `this` context is the point.
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

    /**
     * Callback that fires while dragging a point. The mouse event is passed in
     * as parameter. The original data can be accessed from `e.origin`, and the
     * new point values can be accessed from `e.newPoints`. If there is only a
     * single point being updated, it can be accessed from `e.newPoint` for
     * simplicity, and its ID can be accessed from `e.newPointId`. The `this`
     * context is the point being dragged. To stop the default drag action,
     * return false. See [drag and drop options](plotOptions.series.dragDrop).
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

    /**
     * Callback that fires when the point is dropped. The parameters passed are
     * the same as for [drag](#plotOptions.series.point.events.drag). To stop
     * the default drop action, return false. See
     * [drag and drop options](plotOptions.series.dragDrop).
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

    /**
     * Point specific options for the draggable-points module. Overrides options
     * on `series.dragDrop`.
     *
     * @declare   Highcharts.SeriesLineDataDragDropOptions
     * @extends   plotOptions.series.dragDrop
     * @since     6.2.0
     * @requires  modules/draggable-points
     * @apioption series.line.data.dragDrop
     */

    /**
     * The amount of pixels to drag the pointer before it counts as a drag
     * operation. This prevents drag/drop to fire when just clicking or
     * selecting points.
     *
     * @type      {number}
     * @default   2
     * @since     6.2.0
     */
    dragSensitivity: 2,

    /**
     * Options for the drag handles available in column series.
     *
     * @declare      Highcharts.DragDropHandleOptionsObject
     * @since        6.2.0
     * @optionparent plotOptions.column.dragDrop.dragHandle
     */
    dragHandle: {

        /**
         * Function to define the SVG path to use for the drag handles. Takes
         * the point as argument. Should return an SVG path in array format. The
         * SVG path is automatically positioned on the point.
         *
         * @type      {Function}
         * @since     6.2.0
         * @apioption plotOptions.column.dragDrop.dragHandle.pathFormatter
         */
        // pathFormatter: null,

        /**
         * The mouse cursor to use for the drag handles. By default this is
         * intelligently switching between `ew-resize` and `ns-resize` depending on
         * the direction the point is being dragged.
         *
         * @type      {string}
         * @since     6.2.0
         * @apioption plotOptions.column.dragDrop.dragHandle.cursor
         */
        // cursor: null,

        /**
         * The class name of the drag handles. Defaults to `highcharts-drag-handle`.
         *
         * @since 6.2.0
         */
        className: 'highcharts-drag-handle',

        /**
         * The fill color of the drag handles.
         *
         * @type  {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since 6.2.0
         */
        color: '#fff',

        /**
         * The line color of the drag handles.
         *
         * @type  {Highcharts.ColorString}
         * @since 6.2.0
         */
        lineColor: 'rgba(0, 0, 0, 0.6)',

        /**
         * The line width for the drag handles.
         *
         * @since 6.2.0
         */
        lineWidth: 1,

        /**
         * The z index for the drag handles.
         *
         * @since 6.2.0
         */
        zIndex: 901
    },

    /**
     * Style options for the guide box. The guide box has one state by default,
     * the `default` state.
     *
     * @type  {Highcharts.Dictionary<Highcharts.DragDropGuideBoxOptionsObject>}
     * @since 6.2.0
     */
    guideBox: {

        /**
         * Style options for the guide box default state.
         *
         * @declare Highcharts.DragDropGuideBoxOptionsObject
         * @since   6.2.0
         */
        'default': {

            /**
             * CSS class name of the guide box in this state. Defaults to
             * `highcharts-drag-box-default`.
             *
             * @since 6.2.0
             */
            className: 'highcharts-drag-box-default',

            /**
             * Width of the line around the guide box.
             *
             * @since 6.2.0
             */
            lineWidth: 1,

            /**
             * Color of the border around the guide box.
             *
             * @type  {Highcharts.ColorString}
             * @since 6.2.0
             */
            lineColor: '#888',

            /**
             * Guide box fill color.
             *
             * @type  {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @since 6.2.0
             */
            color: 'rgba(0, 0, 0, 0.1)',

            /**
             * Guide box cursor.
             *
             * @since 6.2.0
             */
            cursor: 'move',

            /**
             * Guide box zIndex.
             *
             * @since 6.2.0
             */
            zIndex: 900
        }
    }

};

/* *
 *
 *  Default Export
 *
 * */

export default DragDropDefaults;
