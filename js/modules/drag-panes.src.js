/**
 * Plugin for resizing axes / panes in a chart.
 *
 * (c) 2010-2017 Highsoft AS
 * Author: Kacper Madej
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Axis.js';
import '../parts/Pointer.js';

var hasTouch = H.hasTouch,
    merge = H.merge,
    wrap = H.wrap,
    each = H.each,
    isNumber = H.isNumber,
    addEvent = H.addEvent,
    relativeLength = H.relativeLength,
    objectEach = H.objectEach,
    Axis = H.Axis,
    Pointer = H.Pointer,

    /**
     * Default options for AxisResizer.
     */
    resizerOptions = {
        /**
         * Minimal size of a resizable axis. Could be set as a percent
         * of plot area or pixel size.
         *
         * This feature requires the `drag-panes.js` module.
         *
         * @type      {Number|String}
         * @product   highstock
         * @sample    {highstock} stock/yaxis/resize-min-max-length
         *            minLength and maxLength
         * @apioption yAxis.minLength
         */
        minLength: '10%',

        /**
         * Maximal size of a resizable axis. Could be set as a percent
         * of plot area or pixel size.
         *
         * This feature requires the `drag-panes.js` module.
         *
         * @type      {String|Number}
         * @product   highstock
         * @sample    {highstock} stock/yaxis/resize-min-max-length
         *            minLength and maxLength
         * @apioption yAxis.maxLength
         */
        maxLength: '100%',

        /**
         * Options for axis resizing. This feature requires the
         * `drag-panes.js` -
         * [classic](http://code.highcharts.com/stock/modules/drag-panes.js) or
         * [styled](http://code.highcharts.com/stock/js/modules/drag-panes.js)
         * mode - module.
         *
         * @product highstock
         * @sample    {highstock} stock/demo/candlestick-and-volume
         *          Axis resizing enabled
         * @optionparent yAxis.resize
         */
        resize: {

            /**
             * Contains two arrays of axes that are controlled by control line
             * of the axis.
             *
             * This feature requires the `drag-panes.js` module.
             */
            controlledAxis: {

                /**
                 * Array of axes that should move out of the way of resizing
                 * being done for the current axis. If not set, the next axis
                 * will be used.
                 *
                 * This feature requires the `drag-panes.js` module.
                 *
                 * @type    {Array<String|Number>}
                 * @default []
                 * @sample  {highstock} stock/yaxis/multiple-resizers
                 *          Three panes with resizers
                 * @sample  {highstock} stock/yaxis/resize-multiple-axes
                 *          One resizer controlling multiple axes
                 */
                next: [],

                /**
                 * Array of axes that should move with the current axis
                 * while resizing.
                 *
                 * This feature requires the `drag-panes.js` module.
                 *
                 * @type    {Array<String|Number>}
                 * @sample  {highstock} stock/yaxis/multiple-resizers
                 *          Three panes with resizers
                 * @sample  {highstock} stock/yaxis/resize-multiple-axes
                 *          One resizer controlling multiple axes
                 */
                prev: []
            },

            /**
             * Enable or disable resize by drag for the axis.
             *
             * This feature requires the `drag-panes.js` module.
             *
             * @sample {highstock} stock/demo/candlestick-and-volume
             *         Enabled resizer
             */
            enabled: false,

            /*= if (build.classic) { =*/

            /**
             * Cursor style for the control line.
             *
             * In styled mode use class `highcharts-axis-resizer` instead.
             *
             * This feature requires the `drag-panes.js` module.
             */
            cursor: 'ns-resize',

            /**
             * Color of the control line.
             *
             * In styled mode use class `highcharts-axis-resizer` instead.
             *
             * This feature requires the `drag-panes.js` module.
             *
             * @type   {Color}
             * @sample {highstock} stock/yaxis/styled-resizer Styled resizer
             */
            lineColor: '${palette.neutralColor20}',

            /**
             * Dash style of the control line.
             *
             * In styled mode use class `highcharts-axis-resizer` instead.
             *
             * This feature requires the `drag-panes.js` module.
             *
             * @sample {highstock} stock/yaxis/styled-resizer Styled resizer
             * @see    For supported options check
             *         [dashStyle](#plotOptions.series.dashStyle)
             */
            lineDashStyle: 'Solid',

            /**
             * Width of the control line.
             *
             * In styled mode use class `highcharts-axis-resizer` instead.
             *
             * This feature requires the `drag-panes.js` module.
             *
             * @sample {highstock} stock/yaxis/styled-resizer Styled resizer
             */
            lineWidth: 4,

            /*= } =*/

            /**
             * Horizontal offset of the control line.
             *
             * This feature requires the `drag-panes.js` module.
             *
             * @sample {highstock} stock/yaxis/styled-resizer Styled resizer
             */
            x: 0,

            /**
             * Vertical offset of the control line.
             *
             * This feature requires the `drag-panes.js` module.
             *
             * @sample {highstock} stock/yaxis/styled-resizer Styled resizer
             */
            y: 0
        }
    };
merge(true, Axis.prototype.defaultYAxisOptions, resizerOptions);

/**
 * The AxisResizer class.
 * @param {Object} axis - main axis for the AxisResizer.
 * @class
 */
H.AxisResizer = function (axis) {
    this.init(axis);
};

H.AxisResizer.prototype = {
    /**
     * Initiate the AxisResizer object.
     * @param {Object} axis - main axis for the AxisResizer.
     */
    init: function (axis, update) {
        this.axis = axis;
        this.options = axis.options.resize;
        this.render();

        if (!update) {
            // Add mouse events.
            this.addMouseEvents();
        }
    },

    /**
     * Render the AxisResizer
     */
    render: function () {
        var resizer = this,
            axis = resizer.axis,
            chart = axis.chart,
            options = resizer.options,
            x = options.x,
            y = options.y,
            // Normalize control line position according to the plot area
            pos = Math.min(
                Math.max(
                    axis.top + axis.height + y,
                    chart.plotTop
                ),
                chart.plotTop + chart.plotHeight
            ),
            attr = {},
            lineWidth;

        /*= if (build.classic) { =*/
        attr = {
            cursor: options.cursor,
            stroke: options.lineColor,
            'stroke-width': options.lineWidth,
            dashstyle: options.lineDashStyle
        };
        /*= } =*/

        // Register current position for future reference.
        resizer.lastPos = pos - y;

        if (!resizer.controlLine) {
            resizer.controlLine = chart.renderer.path()
                .addClass('highcharts-axis-resizer');
        }

        // Add to axisGroup after axis update, because the group is recreated
        /*= if (!build.classic) { =*/
        // Do .add() before path is calculated because strokeWidth() needs it.
        /*= } =*/
        resizer.controlLine.add(axis.axisGroup);

        /*= if (build.classic) { =*/
        lineWidth = options.lineWidth;
        /*= } else { =*/
        lineWidth = resizer.controlLine.strokeWidth();
        /*= } =*/
        attr.d = chart.renderer.crispLine(
            [
                'M', axis.left + x, pos,
                'L', axis.left + axis.width + x, pos
            ],
            lineWidth
        );

        resizer.controlLine.attr(attr);
    },

    /**
     * Set up the mouse and touch events for the control line.
     */
    addMouseEvents: function () {
        var resizer = this,
            ctrlLineElem = resizer.controlLine.element,
            container = resizer.axis.chart.container,
            eventsToUnbind = [],
            mouseMoveHandler,
            mouseUpHandler,
            mouseDownHandler;

        /**
         * Create mouse events' handlers.
         * Make them as separate functions to enable wrapping them:
         */
        resizer.mouseMoveHandler = mouseMoveHandler = function (e) {
            resizer.onMouseMove(e);
        };
        resizer.mouseUpHandler = mouseUpHandler = function (e) {
            resizer.onMouseUp(e);
        };
        resizer.mouseDownHandler = mouseDownHandler = function (e) {
            resizer.onMouseDown(e);
        };

        /**
         * Add mouse move and mouseup events. These are bind to doc/container,
         * because resizer.grabbed flag is stored in mousedown events.
        */
        eventsToUnbind.push(
            addEvent(container, 'mousemove', mouseMoveHandler),
            addEvent(container.ownerDocument, 'mouseup', mouseUpHandler),
            addEvent(ctrlLineElem, 'mousedown', mouseDownHandler)
        );

        // Touch events.
        if (hasTouch) {
            eventsToUnbind.push(
                addEvent(container, 'touchmove', mouseMoveHandler),
                addEvent(container.ownerDocument, 'touchend', mouseUpHandler),
                addEvent(ctrlLineElem, 'touchstart', mouseDownHandler)
            );
        }

        resizer.eventsToUnbind = eventsToUnbind;
    },

    /**
     * Mouse move event based on x/y mouse position.
     * @param {Object} e  - mouse event.
     */
    onMouseMove: function (e) {
        /*
         * In iOS, a mousemove event with e.pageX === 0 is fired when holding
         * the finger down in the center of the scrollbar. This should
         * be ignored. Borrowed from Navigator.
        */
        if (!e.touches || e.touches[0].pageX !== 0) {
            // Drag the control line
            if (this.grabbed) {
                this.hasDragged = true;
                this.updateAxes(this.axis.chart.pointer.normalize(e).chartY -
                    this.options.y);
            }
        }
    },

    /**
     * Mouse up event based on x/y mouse position.
     * @param {Object} e - mouse event.
     */
    onMouseUp: function (e) {
        if (this.hasDragged) {
            this.updateAxes(this.axis.chart.pointer.normalize(e).chartY -
                this.options.y);
        }

        // Restore runPointActions.
        this.grabbed = this.hasDragged = this.axis.chart.activeResizer = null;
    },

    /**
     * Mousedown on a control line.
     * Will store necessary information for drag&drop.
     */
    onMouseDown: function () {
        // Clear all hover effects.
        this.axis.chart.pointer.reset(false, 0);

        // Disable runPointActions.
        this.grabbed = this.axis.chart.activeResizer = true;
    },

    /**
     * Update all connected axes after a change of control line position
     */
    updateAxes: function (chartY) {
        var resizer = this,
            chart = resizer.axis.chart,
            axes = resizer.options.controlledAxis,
            nextAxes = axes.next.length === 0 ?
                [H.inArray(resizer.axis, chart.yAxis) + 1] : axes.next,
            // Main axis is included in the prev array by default
            prevAxes = [resizer.axis].concat(axes.prev),
            axesConfigs = [], // prev and next configs
            stopDrag = false,
            plotTop = chart.plotTop,
            plotHeight = chart.plotHeight,
            plotBottom = plotTop + plotHeight,
            yDelta,
            normalize = function (val, min, max) {
                return Math.round(Math.min(Math.max(val, min), max));
            };

        // Normalize chartY to plot area limits
        chartY = Math.max(Math.min(chartY, plotBottom), plotTop);

        yDelta = chartY - resizer.lastPos;

        // Update on changes of at least 1 pixel in the desired direction
        if (yDelta * yDelta < 1) {
            return;
        }

        // First gather info how axes should behave
        each([prevAxes, nextAxes], function (axesGroup, isNext) {
            each(axesGroup, function (axisInfo, i) {
                // Axes given as array index, axis object or axis id
                var axis = isNumber(axisInfo) ?
                        // If it's a number - it's an index
                        chart.yAxis[axisInfo] :
                        (
                            // If it's first elem. in first group
                            (!isNext && !i) ?
                                // then it's an Axis object
                                axisInfo :
                                // else it should be an id
                                chart.get(axisInfo)
                        ),
                    axisOptions = axis && axis.options,
                    optionsToUpdate = {},
                    hDelta = 0,
                    height, top,
                    minLength, maxLength;

                // Skip if axis is not found
                // or it is navigator's yAxis (#7732)
                if (
                    !axisOptions ||
                    axisOptions.id === 'navigator-y-axis'
                ) {
                    return;
                }

                top = axis.top;

                minLength = Math.round(
                    relativeLength(
                        axisOptions.minLength,
                        plotHeight
                    )
                );
                maxLength = Math.round(
                    relativeLength(
                        axisOptions.maxLength,
                        plotHeight
                    )
                );

                if (isNext) {
                    // Try to change height first. yDelta could had changed
                    yDelta = chartY - resizer.lastPos;

                    // Normalize height to option limits
                    height = normalize(axis.len - yDelta, minLength, maxLength);

                    // Adjust top, so the axis looks like shrinked from top
                    top = axis.top + yDelta;

                    // Check for plot area limits
                    if (top + height > plotBottom) {
                        hDelta = plotBottom - height - top;
                        chartY += hDelta;
                        top += hDelta;
                    }

                    // Fit to plot - when overflowing on top
                    if (top < plotTop) {
                        top = plotTop;
                        if (top + height > plotBottom) {
                            height = plotHeight;
                        }
                    }

                    // If next axis meets min length, stop dragging:
                    if (height === minLength) {
                        stopDrag = true;
                    }

                    axesConfigs.push({
                        axis: axis,
                        options: {
                            top: Math.round(top),
                            height: height
                        }
                    });
                } else {
                    // Normalize height to option limits
                    height = normalize(chartY - top, minLength, maxLength);

                    // If prev axis meets max length, stop dragging:
                    if (height === maxLength) {
                        stopDrag = true;
                    }

                    // Check axis size limits
                    chartY = top + height;
                    axesConfigs.push({
                        axis: axis,
                        options: {
                            height: height
                        }
                    });
                }

                optionsToUpdate.height = height;
            });
        });

        // If we hit the min/maxLength with dragging, don't do anything:
        if (!stopDrag) {
            // Now update axes:
            each(axesConfigs, function (config) {
                config.axis.update(config.options, false);
            });

            chart.redraw(false);
        }
    },

    /**
     * Destroy AxisResizer. Clear outside references, clear events,
     * destroy elements, nullify properties.
     */
    destroy: function () {
        var resizer = this,
            axis = resizer.axis;

        // Clear resizer in axis
        delete axis.resizer;

        // Clear control line events
        if (this.eventsToUnbind) {
            each(this.eventsToUnbind, function (unbind) {
                unbind();
            });
        }

        // Destroy AxisResizer elements
        resizer.controlLine.destroy();

        // Nullify properties
        objectEach(resizer, function (val, key) {
            resizer[key] = null;
        });
    }
};

// Keep resizer reference on axis update
Axis.prototype.keepProps.push('resizer');

// Add new AxisResizer, update or remove it
addEvent(Axis, 'afterRender', function () {
    var axis = this,
        resizer = axis.resizer,
        resizerOptions = axis.options.resize,
        enabled;

    if (resizerOptions) {
        enabled = resizerOptions.enabled !== false;

        if (resizer) {
            // Resizer present and enabled
            if (enabled) {
                // Update options
                resizer.init(axis, true);

            // Resizer present, but disabled
            } else {
                // Destroy the resizer
                resizer.destroy();
            }
        } else {
            // Resizer not present and enabled
            if (enabled) {
                // Add new resizer
                axis.resizer = new H.AxisResizer(axis);
            }
            // Resizer not present and disabled, so do nothing
        }
    }
});

// Clear resizer on axis remove.
addEvent(Axis, 'destroy', function (e) {
    if (!e.keepEvents && this.resizer) {
        this.resizer.destroy();
    }
});

// Prevent any hover effects while dragging a control line of AxisResizer.
wrap(Pointer.prototype, 'runPointActions', function (proceed) {
    if (!this.chart.activeResizer) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});

// Prevent default drag action detection while dragging a control line
// of AxisResizer. (#7563)
wrap(Pointer.prototype, 'drag', function (proceed) {
    if (!this.chart.activeResizer) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});
