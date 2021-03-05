/* *
 *
 *  Plugin for resizing axes / panes in a chart.
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Kacper Madej
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ColorType from '../Core/Color/ColorType';
import type {
    CursorValue
} from '../Core/Renderer/CSSObject';
import type DashStyleValue from '../Core/Renderer/DashStyleValue';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import H from '../Core/Globals.js';
const {
    hasTouch
} = H;
import Axis from '../Core/Axis/Axis.js';
import palette from '../Core/Color/Palette.js';
import Pointer from '../Core/Pointer.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    clamp,
    isNumber,
    merge,
    objectEach,
    relativeLength,
    wrap
} = U;

declare module '../Core/Chart/ChartLike' {
    interface ChartLike {
        activeResizer?: boolean;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Axis {
            resizer?: AxisResizer;
        }
        interface XAxisOptions {
            maxLength?: (number|string);
            minLength?: (number|string);
            resize?: YAxisResizeOptions;
        }
        interface YAxisResizeControlledAxisOptions {
            next?: Array<number|string>;
            prev?: Array<number|string>;
        }
        interface YAxisResizeOptions {
            controlledAxis?: YAxisResizeControlledAxisOptions;
            cursor?: CursorValue;
            enabled?: boolean;
            lineColor?: ColorType;
            lineDashStyle?: DashStyleValue;
            lineWidth?: number;
            x?: number;
            y?: number;
        }
        class AxisResizer {
            public constructor(axis: Axis);
            public axis: Axis;
            public controlLine: SVGElement;
            public eventsToUnbind?: Array<Function>;
            public grabbed?: boolean;
            public hasDragged?: boolean;
            public lastPos: number;
            public mouseDownHandler?: Function;
            public mouseMoveHandler?: Function;
            public mouseUpHandler?: Function;
            public options: YAxisResizeOptions;
            public addMouseEvents(): void;
            public destroy(): void;
            public init(axis: Axis, update?: boolean): void;
            public onMouseDown(e: PointerEvent): void;
            public onMouseMove(e: PointerEvent): void;
            public onMouseUp(e: PointerEvent): void;
            public render(): void;
            public updateAxes(chartY: number): void;
        }
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * The AxisResizer class.
 *
 * @private
 * @class
 * @name Highcharts.AxisResizer
 *
 * @param {Highcharts.Axis} axis
 *        Main axis for the AxisResizer.
 */
class AxisResizer {

    // Default options for AxisResizer.
    public static resizerOptions: Highcharts.YAxisOptions = {
        /**
         * Minimal size of a resizable axis. Could be set as a percent
         * of plot area or pixel size.
         *
         * @sample {highstock} stock/yaxis/resize-min-max-length
         *         minLength and maxLength
         *
         * @type      {number|string}
         * @product   highstock
         * @requires  modules/drag-panes
         * @apioption yAxis.minLength
         */
        minLength: '10%',

        /**
         * Maximal size of a resizable axis. Could be set as a percent
         * of plot area or pixel size.
         *
         * @sample {highstock} stock/yaxis/resize-min-max-length
         *         minLength and maxLength
         *
         * @type      {number|string}
         * @product   highstock
         * @requires  modules/drag-panes
         * @apioption yAxis.maxLength
         */
        maxLength: '100%',

        /**
         * Options for axis resizing. It adds a thick line between panes which
         * the user can drag in order to resize the panes.
         *
         * @sample {highstock} stock/demo/candlestick-and-volume
         *         Axis resizing enabled
         *
         * @product      highstock
         * @requires     modules/drag-panes
         * @optionparent yAxis.resize
         */
        resize: {

            /**
             * Contains two arrays of axes that are controlled by control line
             * of the axis.
             *
             * @requires modules/drag-panes
             */
            controlledAxis: {

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
                next: [],

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
                prev: []
            },

            /**
             * Enable or disable resize by drag for the axis.
             *
             * @sample {highstock} stock/demo/candlestick-and-volume
             *         Enabled resizer
             *
             * @requires modules/drag-panes
             */
            enabled: false,

            /**
             * Cursor style for the control line.
             *
             * In styled mode use class `highcharts-axis-resizer` instead.
             *
             * @requires modules/drag-panes
             */
            cursor: 'ns-resize',

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
            lineColor: palette.neutralColor20,

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
            lineDashStyle: 'Solid',

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
            lineWidth: 4,

            /**
             * Horizontal offset of the control line.
             *
             * @sample {highstock} stock/yaxis/styled-resizer
             *         Styled resizer
             *
             * @requires modules/drag-panes
             */
            x: 0,

            /**
             * Vertical offset of the control line.
             *
             * @sample {highstock} stock/yaxis/styled-resizer
             *         Styled resizer
             *
             * @requires modules/drag-panes
             */
            y: 0
        }
    }

    public constructor(
        axis: Highcharts.Axis
    ) {
        this.init(axis);
    }
    /* eslint-enable no-invalid-this */

    public axis: Highcharts.Axis = void 0 as any;
    public controlLine: SVGElement = void 0 as any;
    public eventsToUnbind?: Array<Function>;
    public grabbed?: boolean;
    public hasDragged?: boolean;
    public lastPos: number = void 0 as any;
    public mouseDownHandler?: Function;
    public mouseMoveHandler?: Function;
    public mouseUpHandler?: Function;
    public options: Highcharts.YAxisResizeOptions = void 0 as any;

    /**
     * Initialize the AxisResizer object.
     *
     * @function Highcharts.AxisResizer#init
     *
     * @param {Highcharts.Axis} axis
     *        Main axis for the AxisResizer.
     */
    public init(
        axis: Highcharts.Axis,
        update?: boolean
    ): void {
        this.axis = axis;
        this.options = axis.options.resize as any;
        this.render();

        if (!update) {
            // Add mouse events.
            this.addMouseEvents();
        }
    }

    /**
     * Render the AxisResizer
     *
     * @function Highcharts.AxisResizer#render
     */
    public render(): void {
        var resizer = this,
            axis = resizer.axis,
            chart = axis.chart,
            options = resizer.options,
            x = options.x || 0,
            y = options.y,
            // Normalize control line position according to the plot area
            pos = clamp(
                axis.top + axis.height + (y as any),
                chart.plotTop,
                chart.plotTop + chart.plotHeight
            ),
            attr: SVGAttributes = {},
            lineWidth: number;

        if (!chart.styledMode) {
            attr = {
                cursor: options.cursor,
                stroke: options.lineColor,
                'stroke-width': options.lineWidth,
                dashstyle: options.lineDashStyle
            };
        }

        // Register current position for future reference.
        resizer.lastPos = pos - (y as any);

        if (!resizer.controlLine) {
            resizer.controlLine = chart.renderer.path()
                .addClass('highcharts-axis-resizer');
        }

        // Add to axisGroup after axis update, because the group is recreated
        // Do .add() before path is calculated because strokeWidth() needs it.
        resizer.controlLine.add(axis.axisGroup);

        lineWidth = chart.styledMode ?
            resizer.controlLine.strokeWidth() :
            (options.lineWidth as any);

        attr.d = chart.renderer.crispLine(
            [
                ['M', axis.left + x, pos],
                ['L', axis.left + axis.width + x, pos]
            ],
            lineWidth
        );

        resizer.controlLine.attr(attr);
    }

    /**
     * Set up the mouse and touch events for the control line.
     *
     * @function Highcharts.AxisResizer#addMouseEvents
     */
    public addMouseEvents(): void {
        var resizer = this,
            ctrlLineElem = resizer.controlLine.element,
            container = resizer.axis.chart.container,
            eventsToUnbind: Array<Function> = [],
            mouseMoveHandler: Function,
            mouseUpHandler: Function,
            mouseDownHandler: Function;

        // Create mouse events' handlers.
        // Make them as separate functions to enable wrapping them:

        resizer.mouseMoveHandler = mouseMoveHandler = function (
            e: PointerEvent
        ): void {
            resizer.onMouseMove(e);
        };
        resizer.mouseUpHandler = mouseUpHandler = function (
            e: PointerEvent
        ): void {
            resizer.onMouseUp(e);
        };
        resizer.mouseDownHandler = mouseDownHandler = function (
            e: PointerEvent
        ): void {
            resizer.onMouseDown(e);
        };

        // Add mouse move and mouseup events. These are bind to doc/container,
        // because resizer.grabbed flag is stored in mousedown events.
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
    }

    /**
     * Mouse move event based on x/y mouse position.
     *
     * @function Highcharts.AxisResizer#onMouseMove
     *
     * @param {Highcharts.PointerEventObject} e
     *        Mouse event.
     */
    public onMouseMove(e: PointerEvent): void {
        /*
         * In iOS, a mousemove event with e.pageX === 0 is fired when holding
         * the finger down in the center of the scrollbar. This should
         * be ignored. Borrowed from Navigator.
         */
        if (!(e as any).touches || (e as any).touches[0].pageX !== 0) {
            // Drag the control line
            if (this.grabbed) {
                this.hasDragged = true;
                this.updateAxes(
                    this.axis.chart.pointer.normalize(e).chartY -
                    (this.options.y as any)
                );
            }
        }
    }

    /**
     * Mouse up event based on x/y mouse position.
     *
     * @function Highcharts.AxisResizer#onMouseUp
     *
     * @param {Highcharts.PointerEventObject} e
     *        Mouse event.
     */
    public onMouseUp(e: PointerEvent): void {
        if (this.hasDragged) {
            this.updateAxes(
                this.axis.chart.pointer.normalize(e).chartY -
                (this.options.y as any)
            );
        }

        // Restore runPointActions.
        this.grabbed = this.hasDragged = this.axis.chart.activeResizer =
            null as any;
    }

    /**
     * Mousedown on a control line.
     * Will store necessary information for drag&drop.
     *
     * @function Highcharts.AxisResizer#onMouseDown
     */
    public onMouseDown(e: PointerEvent): void {
        // Clear all hover effects.
        this.axis.chart.pointer.reset(false, 0);

        // Disable runPointActions.
        this.grabbed = this.axis.chart.activeResizer = true;
    }

    /**
     * Update all connected axes after a change of control line position
     *
     * @function Highcharts.AxisResizer#updateAxes
     *
     * @param {number} chartY
     */
    public updateAxes(chartY: number): void {
        var resizer = this,
            chart = resizer.axis.chart,
            axes = resizer.options.controlledAxis,
            nextAxes: Array<(number|string)> = (axes as any).next.length === 0 ?
                [chart.yAxis.indexOf(resizer.axis) + 1] : (axes as any).next,
            // Main axis is included in the prev array by default
            prevAxes: Array<(number|string)> =
                [resizer.axis as any].concat((axes as any).prev),
            // prev and next configs
            axesConfigs: Array<Record<string, any>> = [],
            stopDrag = false,
            plotTop = chart.plotTop,
            plotHeight = chart.plotHeight,
            plotBottom = plotTop + plotHeight,
            yDelta,
            calculatePercent = function (value: number): string {
                return value * 100 / plotHeight + '%';
            },
            normalize = function (
                val: number,
                min: number,
                max: number
            ): number {
                return Math.round(clamp(val, min, max));
            };

        // Normalize chartY to plot area limits
        chartY = clamp(chartY, plotTop, plotBottom);

        yDelta = chartY - resizer.lastPos;

        // Update on changes of at least 1 pixel in the desired direction
        if (yDelta * yDelta < 1) {
            return;
        }

        // First gather info how axes should behave
        [prevAxes, nextAxes].forEach(function (
            axesGroup: Array<(number|string)>,
            isNext: number
        ): void {
            axesGroup.forEach(function (
                axisInfo: (number|string),
                i: number
            ): void {
                // Axes given as array index, axis object or axis id
                var axis: Highcharts.Axis = isNumber(axisInfo) ?
                        // If it's a number - it's an index
                        chart.yAxis[axisInfo] :
                        (
                            // If it's first elem. in first group
                            (!isNext && !i) ?
                                // then it's an Axis object
                                axisInfo as any :
                                // else it should be an id
                                chart.get(axisInfo)
                        ),
                    axisOptions = axis && axis.options,
                    optionsToUpdate: Highcharts.YAxisOptions = {},
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
                        axisOptions.minLength as any,
                        plotHeight
                    )
                );
                maxLength = Math.round(
                    relativeLength(
                        axisOptions.maxLength as any,
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
                            top: calculatePercent(top - plotTop),
                            height: calculatePercent(height)
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
                            height: calculatePercent(height)
                        }
                    });
                }

                optionsToUpdate.height = height;
            });
        });

        // If we hit the min/maxLength with dragging, don't do anything:
        if (!stopDrag) {
            // Now update axes:
            axesConfigs.forEach(function (
                config: Record<string, any>
            ): void {
                config.axis.update(config.options, false);
            });

            chart.redraw(false);
        }
    }

    /**
     * Destroy AxisResizer. Clear outside references, clear events,
     * destroy elements, nullify properties.
     *
     * @function Highcharts.AxisResizer#destroy
     */
    public destroy(): void {
        var resizer = this,
            axis = resizer.axis;

        // Clear resizer in axis
        delete axis.resizer;

        // Clear control line events
        if (this.eventsToUnbind) {
            this.eventsToUnbind.forEach(function (unbind: Function): void {
                unbind();
            });
        }

        // Destroy AxisResizer elements
        resizer.controlLine.destroy();

        // Nullify properties
        objectEach(resizer, function (val: unknown, key: string): void {
            (resizer as any)[key] = null;
        });
    }
}

// Keep resizer reference on axis update
Axis.keepProps.push('resizer');

/* eslint-disable no-invalid-this */
// Add new AxisResizer, update or remove it
addEvent(Axis, 'afterRender', function (): void {
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
                axis.resizer = new AxisResizer(axis);
            }
            // Resizer not present and disabled, so do nothing
        }
    }
});

// Clear resizer on axis remove.
addEvent(Axis, 'destroy', function (e: Event): void {
    if (!(e as any).keepEvents && this.resizer) {
        this.resizer.destroy();
    }
});

// Prevent any hover effects while dragging a control line of AxisResizer.
wrap(Pointer.prototype, 'runPointActions', function (
    this: Pointer,
    proceed: Function
): void {
    if (!this.chart.activeResizer) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});

// Prevent default drag action detection while dragging a control line of
// AxisResizer. (#7563)
wrap(Pointer.prototype, 'drag', function (
    this: Pointer,
    proceed: Function
): void {
    if (!this.chart.activeResizer) {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});

merge(true, Axis.defaultYAxisOptions, AxisResizer.resizerOptions);

H.AxisResizer = AxisResizer as any;
export default H.AxisResizer;
