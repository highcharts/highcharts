/* *
 *
 *  (c) 2009-2019 Highsoft AS
 *
 *  Authors: Øystein Moseng, Torstein Hønsi, Jon A. Nygård
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Chart {
            /** @requires modules/draggable-points */
            dragDropData?: DragDropDataObject;
            /** @requires modules/draggable-points */
            dragHandles?: DragHandlesObject;
            /** @requires modules/draggable-points */
            dragGuideBox?: SVGElement;
            /** @requires modules/draggable-points */
            hasAddedDragDropEvents?: boolean;
            /** @requires modules/annotations */
            hasDraggedAnnotation?: boolean;
            /** @requires modules/draggable-points */
            isDragDropAnimating?: boolean;
            /** @requires modules/draggable-points */
            unbindDragDropMouseUp?: Function;
            /** @requires modules/draggable-points */
            setGuideBoxState(
                state: string,
                options?: Dictionary<DragDropGuideBoxOptionsObject>
            ): SVGElement;
            /** @requires modules/draggable-points */
            hideDragHandles(): void;
            /** @requires modules/draggable-points */
            zoomOrPanKeyPressed(e: Event): boolean;
        }
        interface ChartOptions {
            zoomKey?: string;
        }
        interface DragDropDataObject {
            draggedPastSensitivity?: boolean;
            groupedPoints: Array<Point>;
            isDragging: boolean;
            isHoveringHandle?: string;
            newPoints?: Dictionary<DragDropPointObject>;
            origin: DragDropPositionObject;
            point: Point;
            updateProp?: string;
        }
        interface DragDropGuideBoxOptionsObject {
            className?: string;
            color?: ColorType;
            cursor?: string;
            lineColor?: ColorString;
            lineWidth?: number;
            zIndex?: number;
        }
        interface DragDropHandleOptionsObject {
            className?: string;
            color?: ColorType;
            cursor?: string;
            lineColor?: ColorString;
            lineWidth?: number;
            pathFormatter?: Function;
            zIndex?: number;
        }
        interface DragDropOptionsObject {
            draggableX?: boolean;
            draggableY?: boolean;
            dragHandle?: DragDropHandleOptionsObject;
            dragMaxX?: number;
            dragMaxY?: number;
            dragMinX?: number;
            dragMinY?: number;
            dragPrecisionX?: number;
            dragPrecisionY?: number;
            dragSensitivity?: number;
            groupBy?: string;
            guideBox?: Dictionary<DragDropGuideBoxOptionsObject>;
            liveRedraw?: boolean;
        }
        interface DragDropPointObject {
            point: Point;
            newValues: Dictionary<number>;
        }
        interface DragDropPositionObject {
            chartX: number;
            chartY: number;
            guideBox?: BBoxObject;
            points: Dictionary<Dictionary<number>>;
            prevdX?: number;
            prevdY?: number;
        }
        interface DragHandlesObject {
            group: SVGElement;
            point: string;
        }
        interface Point {
            /** @requires modules/draggable-points */
            getDropValues(
                origin: DragDropPositionObject,
                newPos: PointerEventObject,
                updateProps: Dictionary<SeriesDragDropPropsObject>
            ): Dictionary<number>;
            /** @requires modules/draggable-points */
            showDragHandles(): void;
        }
        interface PointDragCallbackFunction {
            (this: Point, event: PointDragEventObject): void;
        }
        interface PointDragDropObject {
            newValues: Dictionary<number>;
            point: Point;
        }
        interface PointDragEventObject {
            newPoint?: PointDragDropObject;
            newPointId?: string;
            newPoints: Dictionary<PointDragDropObject>;
            origin: DragDropPositionObject;
            preventDefault: Function;
            target: Point;
            type: 'drag';
        }
        interface PointDragStartCallbackFunction {
            (this: Point, event: PointDragStartEventObject): void;
        }
        interface PointDragStartEventObject extends MouseEvent {
            updateProp?: string;
        }
        interface PointDropCallbackFunction {
            (this: Point, event: PointDropEventObject): void;
        }
        interface PointDropEventObject {
            newPoint?: PointDragDropObject;
            newPointId?: string;
            newPoints: Dictionary<PointDragDropObject>;
            numNewPoints: number;
            origin: DragDropPositionObject;
            preventDefault: Function;
            target: Point;
            type: 'drop';
        }
        interface PointOptionsObject {
            dragDrop?: DragDropOptionsObject;
        }
        interface PointEventsOptionsObject {
            drag?: PointDragCallbackFunction;
            dragDrop?: DragDropOptionsObject;
            dragStart?: PointDragStartCallbackFunction;
            drop?: PointDropCallbackFunction;
        }
        interface Series {
            /** @requires modules/draggable-points */
            dragDropProps?: (
                Dictionary<Partial<SeriesDragDropPropsObject>>|
                null
            );
            /** @requires modules/draggable-points */
            getGuideBox(points: Array<Point>): SVGElement;
        }
        interface SeriesDragDropPropsObject {
            axis: string;
            beforeResize?: Function;
            handleOptions?: DragDropHandleOptionsObject;
            move: boolean;
            optionName: string;
            resize: boolean;
            resizeSide: (string|SeriesDragDropPropsResizeSideFunction);
            validateIndividualDrag?: Function;
            handleFormatter(point: Point): (SVGPathArray|null);
            handlePositioner(point: Point): PositionObject;
            propValidate(val: number, point: Point): boolean;
        }
        interface SeriesDragDropPropsResizeSideFunction {
            (...args: Array<any>): string;
        }
        interface SeriesOptions {
            dragDrop?: DragDropOptionsObject;
        }
    }
}

/**
 * Current drag and drop position.
 *
 * @interface Highcharts.DragDropPositionObject
 *//**
 * Chart x position
 * @name Highcharts.DragDropPositionObject#chartX
 * @type {number}
 *//**
 * Chart y position
 * @name Highcharts.DragDropPositionObject#chartY
 * @type {number}
 *//**
 * Drag and drop guide box.
 * @name Highcharts.DragDropPositionObject#guideBox
 * @type {Highcharts.BBoxObject|undefined}
 *//**
 * Updated point data.
 * @name Highcharts.DragDropPositionObject#points
 * @type {Highcharts.Dictionary<Highcharts.Dictionary<number>>}
 *//**
 * Delta of previous x position.
 * @name Highcharts.DragDropPositionObject#prevdX
 * @type {number|undefined}
 *//**
 * Delta of previous y position.
 * @name Highcharts.DragDropPositionObject#prevdY
 * @type {number|undefined}
 */

/**
 * Function callback to execute while series points are dragged. Return false to
 * stop the default drag action.
 *
 * @callback Highcharts.PointDragCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {Highcharts.PointDragEventObject} event
 *        Event arguments.
 */

/**
 * Contains information about a points new values.
 *
 * @interface Highcharts.PointDragDropObject
 *//**
 * New values.
 * @name Highcharts.PointDragDropObject#newValues
 * @type {Highcharts.Dictionary<number>}
 *//**
 * Updated point.
 * @name Highcharts.PointDragDropObject#point
 * @type {Highcharts.Point}
 */

/**
 * Contains common information for a drag event on series points.
 *
 * @interface Highcharts.PointDragEventObject
 *//**
 * New point after drag if only a single one.
 * @name Highcharts.PointDropEventObject#newPoint
 * @type {Highcharts.PointDragDropObject|undefined}
 *//**
 * New point id after drag if only a single one.
 * @name Highcharts.PointDropEventObject#newPointId
 * @type {string|undefined}
 *//**
 * New points during drag.
 * @name Highcharts.PointDragEventObject#newPoints
 * @type {Highcharts.Dictionary<Highcharts.PointDragDropObject>}
 *//**
 * Original data.
 * @name Highcharts.PointDragEventObject#origin
 * @type {Highcharts.DragDropPositionObject}
 *//**
 * Prevent default drag action.
 * @name Highcharts.PointDragEventObject#preventDefault
 * @type {Function}
 *//**
 * Target point that caused the event.
 * @name Highcharts.PointDragEventObject#target
 * @type {Highcharts.Point}
 *//**
 * Event type.
 * @name Highcharts.PointDragEventObject#type
 * @type {"drag"}
 */

/**
 * Function callback to execute when a series point is dragged.
 *
 * @callback Highcharts.PointDragStartCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {Highcharts.PointDragStartEventObject} event
 *        Event arguments.
 */

/**
 * Contains common information for a drag event on series point.
 *
 * @interface Highcharts.PointDragStartEventObject
 * @extends global.MouseEvent
 *//**
 * Data property being dragged.
 * @name Highcharts.PointDragStartEventObject#updateProp
 * @type {string|undefined}
 */

/**
 * Function callback to execute when series points are dropped.
 *
 * @callback Highcharts.PointDropCallbackFunction
 *
 * @param {Highcharts.Point} this
 *        Point where the event occured.
 *
 * @param {Highcharts.PointDropEventObject} event
 *        Event arguments.
 */

/**
 * Contains common information for a drop event on series points.
 *
 * @interface Highcharts.PointDropEventObject
 *//**
 * New point after drop if only a single one.
 * @name Highcharts.PointDropEventObject#newPoint
 * @type {Highcharts.PointDragDropObject|undefined}
 *//**
 * New point id after drop if only a single one.
 * @name Highcharts.PointDropEventObject#newPointId
 * @type {string|undefined}
 *//**
 * New points after drop.
 * @name Highcharts.PointDropEventObject#newPoints
 * @type {Highcharts.Dictionary<Highcharts.PointDragDropObject>}
 *//**
 * Number of new points.
 * @name Highcharts.PointDropEventObject#numNewPoints
 * @type {number}
 *//**
 * Original data.
 * @name Highcharts.PointDropEventObject#origin
 * @type {Highcharts.DragDropPositionObject}
 *//**
 * Prevent default drop action.
 * @name Highcharts.PointDropEventObject#preventDefault
 * @type {Function}
 *//**
 * Target point that caused the event.
 * @name Highcharts.PointDropEventObject#target
 * @type {Highcharts.Point}
 *//**
 * Event type.
 * @name Highcharts.PointDropEventObject#type
 * @type {"drop"}
 */

import U from '../parts/Utilities.js';
const {
    clamp,
    objectEach,
    pick
} = U;

var addEvent = H.addEvent,
    merge = H.merge,
    seriesTypes = H.seriesTypes;

/**
 * Flip a side property, used with resizeRect. If input side is "left", return
 * "right" etc.
 *
 * @private
 * @function flipResizeSide
 *
 * @param {string} side
 *        Side prop to flip. Can be `left`, `right`, `top` or `bottom`.
 *
 * @return {"bottom"|"left"|"right"|"top"|undefined}
 *         The flipped side.
 */
function flipResizeSide(side: string): string {
    return ({
        left: 'right',
        right: 'left',
        top: 'bottom',
        bottom: 'top'
    } as Highcharts.Dictionary<string>)[side];
}

/* @todo
Add drag/drop support to specific data props for different series types.

The dragDrop.draggableX/Y user options on series enable/disable all of these per
irection unless they are specifically set in options using
dragDrop.{optionName}. If the prop does not specify an optionName here, it can
only be enabled/disabled by the user with draggableX/Y.

Supported options for each prop:
    optionName: User option in series.dragDrop that enables/disables
        dragging this prop.
    axis: Can be 'x' or 'y'. Whether this prop is linked to x or y axis.
    move: Whether or not this prop should be updated when moving points.
    resize: Whether or not to draw a drag handle and allow user to drag and
        update this prop by itself.
    beforeResize: Hook to perform tasks before a resize is made. Gets
        the guide box, the new points values, and the point as args.
    resizeSide: Which side of the guide box to resize when dragging the
        handle. Can be "left", "right", "top", "bottom". Chart.inverted is
        handled automatically. Can also be a function, taking the new point
        values as parameter, as well as the point, and returning a string
        with the side.
    propValidate: Function that takes the prop value and the point as
        arguments, and returns true if the prop value is valid, false if
        not. It is used to prevent e.g. resizing "low" above "high".
    handlePositioner: For resizeable props, return 0,0 in SVG plot coords of
        where to place the dragHandle. Gets point as argument. Should return
        object with x and y properties.
    handleFormatter: For resizeable props, return the path of the drag
        handle as an SVG path array. Gets the point as argument. The handle
        is translated according to handlePositioner.
    handleOptions: Options to merge with the default handle options.

    TODO:
    - It makes sense to have support for resizing the size of bubbles and
        e.g variwide columns. This requires us to support dragging along a
        z-axis, somehow computing a relative value from old to new pixel
        size.
    - Moving maps could be useful, although we would have to compute new
        point.path values in order to do it properly (using SVG translate
        is easier, but won't update the data).
*/

// 90deg rotated column handle path, used in multiple series types
var horizHandleFormatter = function (
    point: Highcharts.Point
): Highcharts.SVGPathArray {
    var shapeArgs = point.shapeArgs || (point.graphic as any).getBBox(),
        top = shapeArgs.r || 0, // Rounding of bar corners
        bottom = shapeArgs.height - top,
        centerY = shapeArgs.height / 2;

    return [
        // Top wick
        'M', 0, top,
        'L', 0, centerY - 5,
        // Circle
        'A', 1, 1, 0, 0, 0, 0, centerY + 5,
        'A', 1, 1, 0, 0, 0, 0, centerY - 5,
        // Bottom wick
        'M', 0, centerY + 5,
        'L', 0, bottom
    ];
};

// Line series - only draggableX/Y, no drag handles
var lineDragDropProps = seriesTypes.line.prototype.dragDropProps = {
    x: {
        axis: 'x',
        move: true
    },
    y: {
        axis: 'y',
        move: true
    }
};

// Flag series - same as line/scatter
if (seriesTypes.flags) {
    seriesTypes.flags.prototype.dragDropProps = lineDragDropProps;
}

// Column series - x can be moved, y can only be resized. Note extra
// functionality for handling upside down columns (below threshold).
var columnDragDropProps = seriesTypes.column.prototype.dragDropProps = {
    x: {
        axis: 'x',
        move: true
    },
    y: {
        axis: 'y',
        move: false,
        resize: true,
        // Force guideBox start coordinates
        beforeResize: function (
            guideBox: Highcharts.SVGElement,
            pointVals: Highcharts.Dictionary<number>,
            point: Highcharts.ColumnPoint
        ): void {
            // We need to ensure that guideBox always starts at threshold.
            // We flip whether or not we update the top or bottom of the guide
            // box at threshold, but if we drag the mouse fast, the top has not
            // reached threshold before we cross over and update the bottom.
            var threshold = point.series.translatedThreshold,
                y = guideBox.attr('y'),
                height,
                diff;

            if (pointVals.y >= (point.series.options.threshold as any) || 0) {
                // Above threshold - always set height to hit the threshold
                height = guideBox.attr('height');
                diff = threshold ?
                    threshold - ((y as any) + (height as any)) :
                    0;
                guideBox.attr({
                    height: Math.max(0, Math.round((height as any) + diff))
                });
            } else {
                // Below - always set y to start at threshold
                guideBox.attr({
                    y: Math.round((y as any) + (
                        threshold ? threshold - (y as any) : 0
                    ))
                });
            }
        },
        // Flip the side of the resize handle if column is below threshold.
        // Make sure we remove the handle on the other side.
        resizeSide: function (
            pointVals: Highcharts.Dictionary<number>,
            point: Highcharts.ColumnPoint
        ): string {
            var chart = point.series.chart,
                dragHandles = chart.dragHandles,
                side = pointVals.y >= (point.series.options.threshold || 0) ?
                    'top' : 'bottom',
                flipSide = flipResizeSide(side);

            // Force remove handle on other side
            if ((dragHandles as any)[flipSide]) {
                (dragHandles as any)[flipSide].destroy();
                delete (dragHandles as any)[flipSide];
            }
            return side;
        },
        // Position handle at bottom if column is below threshold
        handlePositioner: function (
            point: Highcharts.ColumnPoint
        ): Highcharts.PositionObject {
            var bBox: Highcharts.BBoxObject =
                (point.shapeArgs as any) || (point.graphic as any).getBBox();

            return {
                x: bBox.x,
                y: (point.y as any) >= (point.series.options.threshold || 0) ?
                    bBox.y : bBox.y + bBox.height
            };
        },
        // Horizontal handle
        handleFormatter: function (
            point: Highcharts.ColumnPoint
        ): Highcharts.SVGPathArray {
            var shapeArgs = point.shapeArgs,
                radius = (shapeArgs as any).r || 0, // Rounding of bar corners
                centerX = (shapeArgs as any).width / 2;

            return [
                // Left wick
                'M', radius, 0,
                'L', centerX - 5, 0,
                // Circle
                'A', 1, 1, 0, 0, 0, centerX + 5, 0,
                'A', 1, 1, 0, 0, 0, centerX - 5, 0,
                // Right wick
                'M', centerX + 5, 0,
                'L', (shapeArgs as any).width - radius, 0
            ];
        }
    }
};

// Bullet graph, x/y same as column, but also allow target to be dragged.
if (seriesTypes.bullet) {
    seriesTypes.bullet.prototype.dragDropProps = {
        x: columnDragDropProps.x,
        y: columnDragDropProps.y,
        /**
         * Allow target value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.bullet.dragDrop.draggableTarget
         */
        target: {
            optionName: 'draggableTarget',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'top',
            handlePositioner: function (
                point: Highcharts.BulletPoint
            ): Highcharts.PositionObject {
                var bBox: Highcharts.BBoxObject =
                    (point.targetGraphic as any).getBBox();

                return {
                    x: point.barX,
                    y: bBox.y + bBox.height / 2
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter
        }
    };
}

// Columnrange series - move x, resize or move low/high
if (seriesTypes.columnrange) {
    seriesTypes.columnrange.prototype.dragDropProps = {
        x: {
            axis: 'x',
            move: true
        },
        /**
         * Allow low value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.columnrange.dragDrop.draggableLow
         */
        low: {
            optionName: 'draggableLow',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'bottom',
            handlePositioner: function (
                point: Highcharts.ColumnRangePoint
            ): Highcharts.PositionObject {
                var bBox = point.shapeArgs || (point.graphic as any).getBBox();

                return {
                    x: bBox.x,
                    y: bBox.y + bBox.height
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: Highcharts.ColumnRangePoint
            ): boolean {
                return val <= point.high;
            }
        },
        /**
         * Allow high value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.columnrange.dragDrop.draggableHigh
         */
        high: {
            optionName: 'draggableHigh',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'top',
            handlePositioner: function (
                point: Highcharts.ColumnRangePoint
            ): Highcharts.PositionObject {
                var bBox = point.shapeArgs || (point.graphic as any).getBBox();

                return {
                    x: bBox.x,
                    y: bBox.y
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: Highcharts.ColumnRangePoint
            ): boolean {
                return val >= point.low;
            }
        }
    };
}

// Boxplot series - move x, resize or move low/q1/q3/high
if (seriesTypes.boxplot) {
    seriesTypes.boxplot.prototype.dragDropProps = {
        x: columnDragDropProps.x,
        /**
         * Allow low value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.boxplot.dragDrop.draggableLow
         */
        low: {
            optionName: 'draggableLow',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'bottom',
            handlePositioner: function (
                point: Highcharts.BoxPlotPoint
            ): Highcharts.PositionObject {
                return {
                    x: point.shapeArgs.x,
                    y: point.lowPlot
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: Highcharts.BoxPlotPoint
            ): boolean {
                return val <= point.q1;
            }
        },
        /**
         * Allow Q1 value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.boxplot.dragDrop.draggableQ1
         */
        q1: {
            optionName: 'draggableQ1',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'bottom',
            handlePositioner: function (
                point: Highcharts.BoxPlotPoint
            ): Highcharts.PositionObject {
                return {
                    x: point.shapeArgs.x,
                    y: point.q1Plot
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: Highcharts.BoxPlotPoint
            ): boolean {
                return val <= point.median && val >= point.low;
            }
        },
        median: {
            // Median can not be dragged individually, just move the whole
            // point for this.
            axis: 'y',
            move: true
        },
        /**
         * Allow Q3 value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.boxplot.dragDrop.draggableQ3
         */
        q3: {
            optionName: 'draggableQ3',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'top',
            handlePositioner: function (
                point: Highcharts.BoxPlotPoint
            ): Highcharts.PositionObject {
                return {
                    x: point.shapeArgs.x,
                    y: point.q3Plot
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: Highcharts.BoxPlotPoint
            ): boolean {
                return val <= point.high && val >= point.median;
            }
        },
        /**
         * Allow high value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.boxplot.dragDrop.draggableHigh
         */
        high: {
            optionName: 'draggableHigh',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'top',
            handlePositioner: function (
                point: Highcharts.BoxPlotPoint
            ): Highcharts.PositionObject {
                return {
                    x: point.shapeArgs.x,
                    y: point.highPlot
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: Highcharts.BoxPlotPoint
            ): boolean {
                return val >= point.q3;
            }
        }
    };
}


// OHLC series - move x, resize or move open/high/low/close
if (seriesTypes.ohlc) {
    seriesTypes.ohlc.prototype.dragDropProps = {
        x: columnDragDropProps.x,
        /**
         * Allow low value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.ohlc.dragDrop.draggableLow
         */
        low: {
            optionName: 'draggableLow',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'bottom',
            handlePositioner: function (
                point: Highcharts.OHLCPoint
            ): Highcharts.PositionObject {
                return {
                    x: (point.shapeArgs as any).x,
                    y: point.plotLow as any
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: Highcharts.OHLCPoint
            ): boolean {
                return val <= point.open && val <= point.close;
            }
        },
        /**
         * Allow high value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.ohlc.dragDrop.draggableHigh
         */
        high: {
            optionName: 'draggableHigh',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'top',
            handlePositioner: function (
                point: Highcharts.OHLCPoint
            ): Highcharts.PositionObject {
                return {
                    x: (point.shapeArgs as any).x,
                    y: point.plotHigh as any
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: Highcharts.OHLCPoint
            ): boolean {
                return val >= point.open && val >= point.close;
            }
        },
        /**
         * Allow open value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.ohlc.dragDrop.draggableOpen
         */
        open: {
            optionName: 'draggableOpen',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: function (point: Highcharts.OHLCPoint): string {
                return point.open >= point.close ? 'top' : 'bottom';
            },
            handlePositioner: function (
                point: Highcharts.OHLCPoint
            ): Highcharts.PositionObject {
                return {
                    x: (point.shapeArgs as any).x,
                    y: point.plotOpen
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: Highcharts.OHLCPoint
            ): boolean {
                return val <= point.high && val >= point.low;
            }
        },
        /**
         * Allow close value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.ohlc.dragDrop.draggableClose
         */
        close: {
            optionName: 'draggableClose',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: function (point: Highcharts.OHLCPoint): string {
                return point.open >= point.close ? 'bottom' : 'top';
            },
            handlePositioner: function (
                point: Highcharts.OHLCPoint
            ): Highcharts.PositionObject {
                return {
                    x: (point.shapeArgs as any).x,
                    y: point.plotClose
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: Highcharts.OHLCPoint
            ): boolean {
                return val <= point.high && val >= point.low;
            }
        }
    };
}

// Arearange series - move x, resize or move low/high
if (seriesTypes.arearange) {
    var columnrangeDragDropProps =
            seriesTypes.columnrange.prototype.dragDropProps,
        // Use a circle covering the marker as drag handle
        arearangeHandleFormatter = function (
            point: Highcharts.AreaRangePoint
        ): Highcharts.SVGPathArray {
            var radius = point.graphic ?
                point.graphic.getBBox().width / 2 + 1 :
                4;

            return [
                'M', 0 - radius, 0,
                'a', radius, radius, 0, 1, 0, radius * 2, 0,
                'a', radius, radius, 0, 1, 0, radius * -2, 0
            ];
        };

    seriesTypes.arearange.prototype.dragDropProps = {
        x: (columnrangeDragDropProps as any).x,
        /**
         * Allow low value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.arearange.dragDrop.draggableLow
         */
        low: {
            optionName: 'draggableLow',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'bottom',
            handlePositioner: function (
                point: Highcharts.AreaRangePoint
            ): Highcharts.PositionObject {
                var bBox = point.lowerGraphic && point.lowerGraphic.getBBox();

                return bBox ? {
                    x: bBox.x + bBox.width / 2,
                    y: bBox.y + bBox.height / 2
                } : { x: -999, y: -999 };
            },
            handleFormatter: arearangeHandleFormatter,
            propValidate: (columnrangeDragDropProps as any).low.propValidate
        },
        /**
         * Allow high value to be dragged individually.
         *
         * @type      {boolean}
         * @default   true
         * @requires  modules/draggable-points
         * @apioption plotOptions.arearange.dragDrop.draggableHigh
         */
        high: {
            optionName: 'draggableHigh',
            axis: 'y',
            move: true,
            resize: true,
            resizeSide: 'top',
            handlePositioner: function (
                point: Highcharts.AreaRangePoint
            ): Highcharts.PositionObject {
                var bBox = point.upperGraphic && point.upperGraphic.getBBox();

                return bBox ? {
                    x: bBox.x + bBox.width / 2,
                    y: bBox.y + bBox.height / 2
                } : { x: -999, y: -999 };
            },
            handleFormatter: arearangeHandleFormatter,
            propValidate: (columnrangeDragDropProps as any).high.propValidate
        }
    };
}

// Waterfall - mostly as column, but don't show drag handles for sum points
if (seriesTypes.waterfall) {
    seriesTypes.waterfall.prototype.dragDropProps = {
        x: columnDragDropProps.x,
        y: merge(columnDragDropProps.y, {
            handleFormatter: function (
                point: Highcharts.WaterfallPoint
            ): (Highcharts.SVGPathArray|null) {
                return point.isSum || point.isIntermediateSum ? null :
                    columnDragDropProps.y.handleFormatter(point);
            }
        })
    };
}

// Xrange - resize/move x/x2, and move y
if (seriesTypes.xrange) {
    // Handle positioner logic is the same for x and x2 apart from the
    // x value. shapeArgs does not take yAxis reversed etc into account, so we
    // use axis.toPixels to handle positioning.
    var xrangeHandlePositioner = function (
            point: Highcharts.XRangePoint,
            xProp: string
        ): Highcharts.PositionObject {
            var series = point.series,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                inverted = series.chart.inverted,
                // Using toPixels handles axis.reversed, but doesn't take
                // chart.inverted into account.
                newX = xAxis.toPixels((point as any)[xProp], true),
                newY = yAxis.toPixels(point.y as any, true);

            // Handle chart inverted
            if (inverted) {
                newX = xAxis.len - newX;
                newY = yAxis.len - newY - (point.shapeArgs as any).height / 2;
            } else {
                newY -= (point.shapeArgs as any).height / 2;
            }

            return {
                x: Math.round(newX),
                y: Math.round(newY)
            };
        },
        xrangeDragDropProps = seriesTypes.xrange.prototype.dragDropProps = {
            y: {
                axis: 'y',
                move: true
            },
            /**
             * Allow x value to be dragged individually.
             *
             * @type      {boolean}
             * @default   true
             * @requires  modules/draggable-points
             * @apioption plotOptions.xrange.dragDrop.draggableX1
             */
            x: {
                optionName: 'draggableX1',
                axis: 'x',
                move: true,
                resize: true,
                resizeSide: 'left',
                handlePositioner: function (
                    point: Highcharts.XRangePoint
                ): Highcharts.PositionObject {
                    return xrangeHandlePositioner(point, 'x');
                },
                handleFormatter: horizHandleFormatter,
                propValidate: function (
                    val: number,
                    point: Highcharts.XRangePoint
                ): boolean {
                    return val <= (point.x2 as any);
                }
            },
            /**
             * Allow x2 value to be dragged individually.
             *
             * @type      {boolean}
             * @default   true
             * @requires  modules/draggable-points
             * @apioption plotOptions.xrange.dragDrop.draggableX2
             */
            x2: {
                optionName: 'draggableX2',
                axis: 'x',
                move: true,
                resize: true,
                resizeSide: 'right',
                handlePositioner: function (
                    point: Highcharts.XRangePoint
                ): Highcharts.PositionObject {
                    return xrangeHandlePositioner(point, 'x2');
                },
                handleFormatter: horizHandleFormatter,
                propValidate: function (
                    val: number,
                    point: Highcharts.XRangePoint
                ): boolean {
                    return val >= (point.x as any);
                }
            }
        };

    // Gantt - same as xrange, but with aliases
    if (seriesTypes.gantt) {
        seriesTypes.gantt.prototype.dragDropProps = {
            y: xrangeDragDropProps.y,
            /**
             * Allow start value to be dragged individually.
             *
             * @type      {boolean}
             * @default   true
             * @requires  modules/draggable-points
             * @apioption plotOptions.gantt.dragDrop.draggableStart
             */
            start: merge(xrangeDragDropProps.x, {
                optionName: 'draggableStart',
                // Do not allow individual drag handles for milestones
                validateIndividualDrag: function (
                    point: Highcharts.GanttPoint
                ): boolean {
                    return !point.milestone;
                }
            }),
            /**
             * Allow end value to be dragged individually.
             *
             * @type      {boolean}
             * @default   true
             * @requires  modules/draggable-points
             * @apioption plotOptions.gantt.dragDrop.draggableEnd
             */
            end: merge(xrangeDragDropProps.x2, {
                optionName: 'draggableEnd',
                // Do not allow individual drag handles for milestones
                validateIndividualDrag: function (
                    point: Highcharts.GanttPoint
                ): boolean {
                    return !point.milestone;
                }
            })
        };
    }
}

// Don't support certain series types
[
    'gauge',
    'pie',
    'sunburst',
    'wordcloud',
    'sankey',
    'histogram',
    'pareto',
    'vector',
    'windbarb',
    'treemap',
    'bellcurve',
    'sma',
    'map',
    'mapline'
].forEach(
    /**
     * @private
     * @param {string} type
     *        Unsupported series type
     * @return {void}
     */
    function (type: string): void {
        if (seriesTypes[type]) {
            seriesTypes[type].prototype.dragDropProps = null;
        }
    }
);

/**
 * The draggable-points module allows points to be moved around or modified in
 * the chart. In addition to the options mentioned under the `dragDrop` API
 * structure, the module fires three events,
 * [point.dragStart](plotOptions.series.point.events.dragStart),
 * [point.drag](plotOptions.series.point.events.drag) and
 * [point.drop](plotOptions.series.point.events.drop).
 *
 * @sample highcharts/dragdrop/resize-column
 *         Draggable column and line series
 * @sample highcharts/dragdrop/bar-series
 *         Draggable bar
 * @sample highcharts/dragdrop/drag-bubble
 *         Draggable bubbles
 * @sample highcharts/dragdrop/drag-xrange
 *         Draggable X range series
 *
 * @declare   Highcharts.SeriesDragDropOptionsObject
 * @since     6.2.0
 * @requires  modules/draggable-points
 * @apioption plotOptions.series.dragDrop
 */

/**
 * The amount of pixels to drag the pointer before it counts as a drag
 * operation. This prevents drag/drop to fire when just clicking or selecting
 * points.
 *
 * @type      {number}
 * @default   2
 * @since     6.2.0
 * @apioption plotOptions.series.dragDrop.dragSensitivity
 *
 * @private
 */
var defaultDragSensitivity = 2;

/**
 * Style options for the guide box. The guide box has one state by default, the
 * `default` state.
 *
 * @type         {Highcharts.Dictionary<Highcharts.DragDropGuideBoxOptionsObject>}
 * @since        6.2.0
 * @optionparent plotOptions.series.dragDrop.guideBox
 *
 * @private
 */
var defaultGuideBoxOptions: (
    Highcharts.Dictionary<Highcharts.DragDropGuideBoxOptionsObject>
) = {
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
};


/**
 * Options for the drag handles.
 *
 * @declare      Highcharts.DragDropHandleOptionsObject
 * @since        6.2.0
 * @optionparent plotOptions.series.dragDrop.dragHandle
 *
 * @private
 */
var defaultDragHandleOptions: Highcharts.DragDropHandleOptionsObject = {

    /**
     * Function to define the SVG path to use for the drag handles. Takes the
     * point as argument. Should return an SVG path in array format. The SVG
     * path is automatically positioned on the point.
     *
     * @type      {Function}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.dragHandle.pathFormatter
     */
    // pathFormatter: null,

    /**
     * The mouse cursor to use for the drag handles. By default this is
     * intelligently switching between `ew-resize` and `ns-resize` depending on
     * the direction the point is being dragged.
     *
     * @type      {string}
     * @since     6.2.0
     * @apioption plotOptions.series.dragDrop.dragHandle.cursor
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
};

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
 * default this is disabled, except for category axes, where the default is 1.
 *
 * @type      {number}
 * @default   0
 * @since     6.2.0
 * @apioption plotOptions.series.dragDrop.dragPrecisionX
 */

/**
 * The Y precision value to drag to for this series. Set to 0 to disable. By
 * default this is disabled, except for category axes, where the default is 1.
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
 * Group the points by a property. Points with the same property value will be
 * grouped together when moving.
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
 * Set a key to hold when dragging to zoom the chart. This is useful to avoid
 * zooming while moving points. Should be set different than
 * [chart.panKey](#chart.panKey).
 *
 * @type       {string}
 * @since      6.2.0
 * @validvalue ["alt", "ctrl", "meta", "shift"]
 * @requires  modules/draggable-points
 * @apioption  chart.zoomKey
 */

/**
 * Callback that fires when starting to drag a point. The mouse event object is
 * passed in as an argument. If a drag handle is used, `e.updateProp` is set to
 * the data property being dragged. The `this` context is the point. See
 * [drag and drop options](plotOptions.series.dragDrop).
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
 * Callback that fires while dragging a point. The mouse event is passed in as
 * parameter. The original data can be accessed from `e.origin`, and the new
 * point values can be accessed from `e.newPoints`. If there is only a single
 * point being updated, it can be accessed from `e.newPoint` for simplicity, and
 * its ID can be accessed from `e.newPointId`. The `this` context is the point
 * being dragged. To stop the default drag action, return false. See
 * [drag and drop options](plotOptions.series.dragDrop).
 *
 * @sample {highcharts} highcharts/dragdrop/drag-xrange
 *         Drag events
 *
 * @type      {Highcharts.PointDragCallbackFunction}
 * @since     6.2.0
 * @requires  modules/draggable-points
 * @apioption plotOptions.series.point.events.drag
 */

/**
 * Callback that fires when the point is dropped. The parameters passed are the
 * same as for [drag](#plotOptions.series.point.events.drag). To stop the
 * default drop action, return false. See
 * [drag and drop options](plotOptions.series.dragDrop).
 *
 * @sample {highcharts} highcharts/dragdrop/drag-xrange
 *         Drag events
 *
 * @type      {Highcharts.PointDropCallbackFunction}
 * @since     6.2.0
 * @requires  modules/draggable-points
 * @apioption plotOptions.series.point.events.drop
 */

/**
 * Point specific options for the draggable-points module. Overrides options on
 * `series.dragDrop`.
 *
 * @declare   Highcharts.SeriesLineDataDragDropOptions
 * @extends   plotOptions.series.dragDrop
 * @since     6.2.0
 * @requires  modules/draggable-points
 * @apioption series.line.data.dragDrop
 */


/**
 * Utility function to test if a series is using drag/drop, looking at its
 * options.
 *
 * @private
 * @function isSeriesDraggable
 * @param {Highcharts.Series} series
 *        The series to test.
 * @return {boolean}
 *         True if the series is using drag/drop.
 */
function isSeriesDraggable(series: Highcharts.Series): (boolean|undefined) {
    var props = ['draggableX', 'draggableY'],
        i;

    // Add optionNames from dragDropProps to the array of props to check for
    objectEach(series.dragDropProps, function (
        val: Partial<Highcharts.SeriesDragDropPropsObject>
    ): void {
        if (val.optionName) {
            props.push(val.optionName);
        }
    });

    // Loop over all options we have that could enable dragDrop for this
    // series. If any of them are truthy, this series is draggable.
    i = props.length;
    while (i--) {
        if ((series.options.dragDrop as any)[props[i]]) {
            return true;
        }
    }
}


/**
 * Utility function to test if a chart should have drag/drop enabled, looking at
 * its options.
 *
 * @private
 * @function isChartDraggable
 * @param {Highcharts.Chart} chart
 *        The chart to test.
 * @return {boolean}
 *         True if the chart is drag/droppable.
 */
function isChartDraggable(chart: Highcharts.Chart): (boolean|undefined) {
    var i = chart.series ? chart.series.length : 0;

    if (chart.hasCartesianSeries && !chart.polar) {
        while (i--) {
            if (
                chart.series[i].options.dragDrop &&
                isSeriesDraggable(chart.series[i])
            ) {
                return true;
            }
        }
    }
}


/**
 * Utility function to test if a point is movable (any of its props can be
 * dragged by a move, not just individually).
 *
 * @private
 * @function isPointMovable
 * @param {Highcharts.Point} point
 *        The point to test.
 * @return {boolean}
 *         True if the point is movable.
 */
function isPointMovable(point: Highcharts.Point): (boolean|undefined) {
    var series = point.series,
        seriesDragDropOptions = series.options.dragDrop || {},
        pointDragDropOptions = point.options && point.options.dragDrop,
        updateProps = series.dragDropProps,
        hasMovableX,
        hasMovableY;

    objectEach(updateProps, function (
        p: Highcharts.SeriesDragDropPropsObject
    ): void {
        if (p.axis === 'x' && p.move) {
            hasMovableX = true;
        } else if (p.axis === 'y' && p.move) {
            hasMovableY = true;
        }
    });

    // We can only move the point if draggableX/Y is set, even if all the
    // individual prop options are set.
    return (
        (
            seriesDragDropOptions.draggableX && hasMovableX ||
                seriesDragDropOptions.draggableY && hasMovableY
        ) &&
        !(
            pointDragDropOptions &&
            pointDragDropOptions.draggableX === false &&
            pointDragDropOptions.draggableY === false
        ) &&
        series.yAxis &&
        series.xAxis
    );
}


/**
 * Take a mouse/touch event and return the event object with chartX/chartY.
 *
 * @private
 * @function getNormalizedEvent
 * @param {global.PointerEvent} e
 *        The event to normalize.
 * @param {Highcharts.Chart} chart
 *        The related chart.
 * @return {Highcharts.PointerEventLObject}
 *         The normalized event.
 */
function getNormalizedEvent<T extends Highcharts.PointerEventObject>(
    e: (T|PointerEvent),
    chart: Highcharts.Chart
): Highcharts.PointerEventObject {
    return (
        typeof (e as Highcharts.PointerEventObject).chartX === 'undefined' ||
        typeof (e as Highcharts.PointerEventObject).chartY === 'undefined' ?
            chart.pointer.normalize(e) :
            e as Highcharts.PointerEventObject
    );
}


/**
 * Add multiple event listeners with the same handler to the same element.
 *
 * @private
 * @function addEvents
 * @param {T} el
 *        The element or object to add listeners to.
 * @param {Array<string>} types
 *        Array with the event types this handler should apply to.
 * @param {Function|Highcharts.EventCallbackFunction<T>} fn
 *        The function callback to execute when the events are fired.
 * @param {Highcharts.EventOptionsObject} [options]
 *        Event options:
 *        - `order`: The order the event handler should be called. This opens
 *          for having one handler be called before another, independent of in
 *          which order they were added.
 * @return {Function}
 *         A callback function to remove the added events.
 * @template T
 */
function addEvents<T>(
    el: T,
    types: Array<string>,
    fn: (Function|Highcharts.EventCallbackFunction<T>),
    options?: Highcharts.EventOptionsObject
): Function {
    var removeFuncs: Array<Function> = types.map(
        function (type: string): Function {
            return addEvent(el, type, fn, options);
        }
    );

    return function (): void {
        removeFuncs.forEach(function (fn: Function): void {
            fn();
        });
    };
}


/**
 * In mousemove events, check that we have dragged mouse further than the
 * dragSensitivity before we call mouseMove handler.
 *
 * @private
 * @function hasDraggedPastSensitivity
 *
 * @param {Highcharts.PointerEventObject} e
 *        Mouse move event to test.
 *
 * @param {Highcharts.Chart} chart
 *        Chart that has started dragging.
 *
 * @param {number} sensitivity
 *        Pixel sensitivity to test against.
 *
 * @return {boolean}
 *         True if the event is moved past sensitivity relative to the chart's
 *         drag origin.
 */
function hasDraggedPastSensitivity(
    e: Highcharts.PointerEventObject,
    chart: Highcharts.Chart,
    sensitivity: number
): boolean {
    var orig = (chart.dragDropData as any).origin,
        oldX = orig.chartX,
        oldY = orig.chartY,
        newX = e.chartX,
        newY = e.chartY,
        distance = Math.sqrt(
            (newX - oldX) * (newX - oldX) +
            (newY - oldY) * (newY - oldY)
        );

    return distance > sensitivity;
}


/**
 * Get a snapshot of points, mouse position, and guide box dimensions
 *
 * @private
 * @function getPositionSnapshot
 *
 * @param {Highcharts.PointerEventObject} e
 *        Mouse event with mouse position to snapshot.
 *
 * @param {Array<Highcharts.Point>} points
 *        Points to take snapshot of. We store the value of the data properties
 *        defined in each series' dragDropProps.
 *
 * @param {Highcharts.SVGElement} [guideBox]
 *        The guide box to take snapshot of.
 *
 * @return {object}
 *         Snapshot object. Point properties are placed in a hashmap with IDs as
 *         keys.
 */
function getPositionSnapshot(
    e: Highcharts.PointerEventObject,
    points: Array<Highcharts.Point>,
    guideBox?: Highcharts.SVGElement
): Highcharts.DragDropPositionObject {
    var res: Highcharts.DragDropPositionObject = {
        chartX: e.chartX,
        chartY: e.chartY,
        guideBox: guideBox && {
            x: guideBox.attr('x'),
            y: guideBox.attr('y'),
            width: guideBox.attr('width'),
            height: guideBox.attr('height')
        } as Highcharts.BBoxObject,
        points: {}
    };

    // Loop over the points and add their props
    points.forEach(function (point: Highcharts.Point): void {
        var pointProps: Highcharts.Dictionary<number> = {};

        // Add all of the props defined in the series' dragDropProps to the
        // snapshot
        objectEach(point.series.dragDropProps, function (
            val: (Highcharts.SeriesDragDropPropsObject|null),
            key: string
        ): void {
            var axis = (point.series as any)[(val as any).axis + 'Axis'];

            pointProps[key] = (point as any)[key];
            // Record how far cursor was from the point when drag started.
            // This later will be used to calculate new value according to the
            // current position of the cursor.
            // e.g. `high` value is translated to `highOffset`
            pointProps[key + 'Offset'] =
                // e.g. yAxis.toPixels(point.high), xAxis.toPixels(point.end)
                axis.toPixels((point as any)[key]) -
                (axis.horiz ? e.chartX : e.chartY);
        });
        (pointProps as any).point = point; // Store reference to point
        res.points[point.id] = pointProps;
    });

    return res;
}


/**
 * Get a list of points that are grouped with this point. If only one point is
 * in the group, that point is returned by itself in an array.
 *
 * @private
 * @function getGroupedPoints
 * @param {Highcharts.Point} point
 *        Point to find group from.
 * @return {Array<Highcharts.Point>}
 *         Array of points in this group.
 */
function getGroupedPoints(point: Highcharts.Point): Array<Highcharts.Point> {
    var series = point.series,
        points: Array<Highcharts.Point> = [],
        groupKey = (series.options.dragDrop as any).groupBy;

    if (series.isSeriesBoosting) { // #11156
        (series.options.data as any).forEach(function (
            pointOptions: Highcharts.PointOptionsType,
            i: number
        ): void {
            points.push(
                (new series.pointClass()).init( // eslint-disable-line new-cap
                    series,
                    pointOptions
                )
            );
            points[points.length - 1].index = i;
        });

    } else {
        points = series.points;
    }

    return (point.options as any)[groupKey] ?
        // If we have a grouping option, filter the points by that
        points.filter(function (comparePoint: Highcharts.Point): boolean {
            return (comparePoint.options as any)[groupKey] ===
                (point.options as any)[groupKey];
        }) :
        // Otherwise return the point by itself only
        [point];
}


/**
 * Resize a rect element on one side. The element is modified.
 *
 * @private
 * @function resizeRect
 * @param {Highcharts.SVGElement} rect
 *        Rect element to resize.
 * @param {string} updateSide
 *        Which side of the rect to update. Can be `left`, `right`, `top` or
 *        `bottom`.
 * @param {Highcharts.PositionObject} update
 *        Object with x and y properties, detailing how much to resize each
 *        dimension.
 * @return {void}
 */
function resizeRect(
    rect: Highcharts.SVGElement,
    updateSide: string,
    update: Highcharts.PositionObject
): void {
    var resizeAttrs;

    switch (updateSide) {
    case 'left':
        resizeAttrs = {
            x: (rect.attr('x') as any) + update.x,
            width: Math.max(1, (rect.attr('width') as any) - update.x)
        };
        break;
    case 'right':
        resizeAttrs = {
            width: Math.max(1, (rect.attr('width') as any) + update.x)
        };
        break;
    case 'top':
        resizeAttrs = {
            y: (rect.attr('y') as any) + update.y,
            height: Math.max(1, (rect.attr('height') as any) - update.y)
        };
        break;
    case 'bottom':
        resizeAttrs = {
            height: Math.max(1, (rect.attr('height') as any) + update.y)
        };
        break;
    default:
    }
    rect.attr(resizeAttrs);
}


/**
 * Prepare chart.dragDropData with origin info, and show the guide box.
 *
 * @private
 * @function initDragDrop
 * @param {Highcharts.PointerEventObject} e
 *        Mouse event with original mouse position.
 * @param {Highcharts.Point} point
 *        The point the dragging started on.
 * @return {void}
 */
function initDragDrop(
    e: Highcharts.PointerEventObject,
    point: Highcharts.Point
): void {
    var groupedPoints = getGroupedPoints(point),
        series = point.series,
        chart = series.chart,
        guideBox;

    // If liveRedraw is disabled, show the guide box with the default state
    if (!pick(
        series.options.dragDrop && series.options.dragDrop.liveRedraw,
        true
    )) {
        chart.dragGuideBox = guideBox = series.getGuideBox(groupedPoints);
        chart
            .setGuideBoxState(
                'default',
                (series.options.dragDrop as any).guideBox
            )
            .add(series.group);
    }

    // Store some data on the chart to pick up later
    chart.dragDropData = {
        origin: getPositionSnapshot(e, groupedPoints, guideBox),
        point: point,
        groupedPoints: groupedPoints,
        isDragging: true
    };
}


/**
 * Calculate new point options from points being dragged.
 *
 * @private
 * @function getNewPoints
 *
 * @param {object} dragDropData
 *        A chart's dragDropData with drag/drop origin information, and info on
 *        which points are being dragged.
 *
 * @param {Highcharts.PointerEventObject} newPos
 *        Event with the new position of the mouse (chartX/Y properties).
 *
 * @return {Highchats.Dictionary<object>}
 *         Hashmap with point.id mapped to an object with the original point
 *         reference, as well as the new data values.
 */
function getNewPoints(
    dragDropData: Highcharts.DragDropDataObject,
    newPos: Highcharts.PointerEventObject
): Highcharts.Dictionary<Highcharts.DragDropPointObject> {
    var point = dragDropData.point,
        series = point.series,
        options = merge(series.options.dragDrop, point.options.dragDrop),
        updateProps: (
            Highcharts.Dictionary<Partial<Highcharts.SeriesDragDropPropsObject>>
        ) = {},
        resizeProp = dragDropData.updateProp,
        hashmap: Highcharts.Dictionary<Highcharts.DragDropPointObject> = {};

    // Go through the data props that can be updated on this series and find out
    // which ones we want to update.
    objectEach(point.series.dragDropProps, function (
        val: Partial<Highcharts.SeriesDragDropPropsObject>,
        key: string
    ): void {
        // If we are resizing, skip if this key is not the correct one or it
        // is not resizable.
        if (
            resizeProp && (
                resizeProp !== key ||
                !val.resize ||
                val.optionName && (options as any)[val.optionName] === false
            )
        ) {
            return;
        }

        // If we are resizing, we now know it is good. If we are moving, check
        // that moving along this axis is enabled, and the prop is movable.
        // If this prop is enabled, add it to be updated.
        if (
            resizeProp || (
                val.move &&
                (
                    val.axis === 'x' && options.draggableX ||
                    val.axis === 'y' && options.draggableY
                )
            )
        ) {
            updateProps[key] = val;
        }
    });

    // Go through the points to be updated and get new options for each of them
    (
        // If resizing).forEach(only update the point we are resizing
        resizeProp ?
            [point] :
            dragDropData.groupedPoints
    ).forEach(
        function (p: Highcharts.Point): void {
            hashmap[p.id] = {
                point: p,
                newValues: p.getDropValues(
                    dragDropData.origin, newPos, updateProps as any
                )
            };
        }
    );
    return hashmap;
}


/**
 * Update the points in a chart from dragDropData.newPoints.
 *
 * @private
 * @function updatePoints
 * @param {Highcharts.Chart} chart
 *        A chart with dragDropData.newPoints.
 * @param {boolean} [animate=true]
 *        Animate updating points?
 * @return {void}
 */
function updatePoints(
    chart: Highcharts.Chart,
    animate?: (boolean|Highcharts.AnimationOptionsObject)
): void {
    var newPoints: Highcharts.Dictionary<Highcharts.DragDropPointObject> =
            (chart.dragDropData as any).newPoints,
        animOptions = animate === false ? false : merge({
            duration: 400 // 400 is the default in H.animate
        }, (chart.options.chart as any).animation);

    chart.isDragDropAnimating = true;

    // Update the points
    objectEach(newPoints, function (
        newPoint: Highcharts.DragDropPointObject
    ): void {
        newPoint.point.update(newPoint.newValues, false);
    });

    chart.redraw(animOptions);

    // Clear the isAnimating flag after animation duration is complete.
    // The complete handler for animation seems to have bugs at this time, so
    // we have to use a timeout instead.
    setTimeout(function (): void {
        delete chart.isDragDropAnimating;
        if (chart.hoverPoint && !chart.dragHandles) {
            chart.hoverPoint.showDragHandles();
        }
    }, animOptions.duration);
}


/**
 * Resize the guide box according to point options and a difference in mouse
 * positions. Handles reversed axes.
 *
 * @private
 * @function resizeGuideBox
 * @param {Highcharts.Point} point
 *        The point that is being resized.
 * @param {number} dX
 *        Difference in X position.
 * @param {number} dY
 *        Difference in Y position.
 * @return {void}
 */
function resizeGuideBox(point: Highcharts.Point, dX: number, dY: number): void {
    var series = point.series,
        chart = series.chart,
        dragDropData: Highcharts.DragDropDataObject = chart.dragDropData as any,
        resizeSide,
        newPoint,
        resizeProp =
            (series.dragDropProps as any)[dragDropData.updateProp as any];

    // dragDropProp.resizeSide holds info on which side to resize.
    newPoint = (dragDropData as any).newPoints[point.id as any].newValues;
    resizeSide = typeof resizeProp.resizeSide === 'function' ?
        resizeProp.resizeSide(newPoint, point) : resizeProp.resizeSide;

    // Call resize hook if it is defined
    if (resizeProp.beforeResize) {
        resizeProp.beforeResize(chart.dragGuideBox, newPoint, point);
    }

    // Do the resize
    resizeRect(
        chart.dragGuideBox as any,
        resizeProp.axis === 'x' && series.xAxis.reversed ||
        resizeProp.axis === 'y' && series.yAxis.reversed ?
            flipResizeSide(resizeSide) : resizeSide,
        {
            x: resizeProp.axis === 'x' ?
                dX - (dragDropData.origin.prevdX || 0) : 0,
            y: resizeProp.axis === 'y' ?
                dY - (dragDropData.origin.prevdY || 0) : 0
        }
    );
}


/**
 * Default mouse move handler while dragging. Handles updating points or guide
 * box.
 *
 * @private
 * @function dragMove
 * @param {Highcharts.PointerEventObject} e
 *        The mouse move event.
 * @param {Highcharts.Point} point
 *        The point that is dragged.
 * @return {void}
 */
function dragMove(
    e: Highcharts.PointerEventObject,
    point: Highcharts.Point
): void {
    var series = point.series,
        chart = series.chart,
        data = chart.dragDropData,
        options = merge(series.options.dragDrop, point.options.dragDrop),
        draggableX = options.draggableX,
        draggableY = options.draggableY,
        origin: Highcharts.DragDropPositionObject = (data as any).origin,
        dX = e.chartX - origin.chartX,
        dY = e.chartY - origin.chartY,
        oldDx = dX,
        updateProp: string = (data as any).updateProp;

    // Handle inverted
    if (chart.inverted) {
        dX = -dY;
        dY = -oldDx;
    }

    // If we have liveRedraw enabled, update the points immediately. Otherwise
    // update the guideBox.
    if (pick(options.liveRedraw, true)) {
        updatePoints(chart, false);

        // Update drag handles
        point.showDragHandles();

    } else {
        // No live redraw, update guide box
        if (updateProp) {
            // We are resizing, so resize the guide box
            resizeGuideBox(point, dX, dY);
        } else {
            // We are moving, so move the guide box
            (chart.dragGuideBox as any).translate(
                draggableX ? dX : 0, draggableY ? dY : 0
            );
        }
    }

    // Update stored previous dX/Y
    origin.prevdX = dX;
    origin.prevdY = dY;
}


/**
 * Set the state of the guide box.
 *
 * @private
 * @function Highcharts.Chart#setGuideBoxState
 * @param {string} state
 *        The state to set the guide box to.
 * @param {Highcharts.Dictionary<Highcharts.DragDropGuideBoxOptionsObject>} [options]
 *        Additional overall guideBox options to consider.
 * @return {Highcharts.SVGElement}
 *         The modified guide box.
 */
H.Chart.prototype.setGuideBoxState = function (
    state: string,
    options?: Highcharts.Dictionary<Highcharts.DragDropGuideBoxOptionsObject>
): Highcharts.SVGElement {
    var guideBox = this.dragGuideBox,
        guideBoxOptions = merge(defaultGuideBoxOptions, options),
        stateOptions = merge(
            guideBoxOptions['default'], // eslint-disable-line dot-notation
            guideBoxOptions[state]
        );

    return (guideBox as any)
        .attr({
            className: stateOptions.className,
            stroke: stateOptions.lineColor,
            strokeWidth: stateOptions.lineWidth,
            fill: stateOptions.color,
            cursor: stateOptions.cursor,
            zIndex: stateOptions.zIndex
        })
        // Use pointerEvents 'none' to avoid capturing the click event
        .css({ pointerEvents: 'none' });
};


/**
 * Get updated point values when dragging a point.
 *
 * @private
 * @function Highcharts.Point#getDropValues
 *
 * @param {object} origin
 *        Mouse position (chartX/Y) and point props at current data values.
 *        Point props should be organized per point.id in a hashmap.
 *
 * @param {Highcharts.PointerEventObject} newPos
 *        New mouse position (chartX/Y).
 *
 * @param {Highcharts.Dictionary<Highcharts.Dictionary<Highcharts.Dictionary<string>>>} updateProps
 *        Point props to modify. Map of prop objects where each key refers to
 *        the prop, and the value is an object with an axis property. Example:
 *        {
 *            x: {
 *                axis: 'x'
 *            },
 *            x2: {
 *                axis: 'x'
 *            }
 *        }
 *
 * @return {Highcharts.Dictionary<number>}
 *         An object with updated data values.
 */
H.Point.prototype.getDropValues = function (
    origin: Highcharts.DragDropPositionObject,
    newPos: Highcharts.PointerEventObject,
    updateProps: Highcharts.Dictionary<Highcharts.SeriesDragDropPropsObject>
): Highcharts.Dictionary<number> {
    var point = this,
        series = point.series,
        options = merge(series.options.dragDrop, point.options.dragDrop),
        result: Highcharts.Dictionary<number> = {},
        updateSingleProp: (boolean|undefined),
        pointOrigin = origin.points[point.id];

    // Find out if we only have one prop to update
    for (var key in updateProps) {
        if (Object.hasOwnProperty.call(updateProps, key)) {
            if (typeof updateSingleProp !== 'undefined') {
                updateSingleProp = false;
                break;
            }
            updateSingleProp = true;
        }
    }

    /**
     * Utility function to apply precision and limit a value within the
     * draggable range.
     * @private
     * @param {number} val
     *        Value to limit
     * @param {string} direction
     *        Axis direction
     * @return {number}
     *         Limited value
     */
    const limitToRange = function (val: number, direction: string): number {
        var defaultPrecision = (series as any)[direction.toLowerCase() + 'Axis']
                .categories ? 1 : 0,
            precision = pick<number|undefined, number>(
                (options as any)['dragPrecision' + direction], defaultPrecision
            ),
            min = pick<number|undefined, number>(
                (options as any)['dragMin' + direction] as any,
                -Infinity
            ),
            max = pick<number|undefined, number>(
                (options as any)['dragMax' + direction] as number,
                Infinity
            ),
            res = val;

        if (precision) {
            res = Math.round(res / precision) * precision;
        }
        return clamp(res, min, max);
    };

    // Assign new value to property. Adds dX/YValue to the old value, limiting
    // it within min/max ranges.
    objectEach(updateProps, function (
        val: Highcharts.SeriesDragDropPropsObject,
        key: string
    ): void {
        var oldVal = pointOrigin[key],
            axis: Highcharts.Axis = (series as any)[val.axis + 'Axis'],
            newVal = limitToRange(
                axis.toValue(
                    (axis.horiz ? newPos.chartX : newPos.chartY) +
                    (pointOrigin as any)[key + 'Offset']
                ),
                val.axis.toUpperCase()
            );

        // If we are updating a single prop, and it has a validation function
        // for the prop, run it. If it fails, don't update the value.
        if (
            !(
                updateSingleProp &&
                val.propValidate &&
                !val.propValidate(newVal, point)
            ) &&
            typeof oldVal !== 'undefined'
        ) {
            result[key] = newVal;
        }
    });

    return result;
};


/**
 * Returns an SVGElement to use as the guide box for a set of points.
 *
 * @private
 * @function Highcharts.Series#getGuideBox
 *
 * @param {Array<Highcharts.Point>} points
 *        The state to set the guide box to.
 *
 * @return {Highcharts.SVGElement}
 *         An SVG element for the guide box, not added to DOM.
 */
H.Series.prototype.getGuideBox = function (
    points: Array<Highcharts.Point>
): Highcharts.SVGElement {
    var chart = this.chart,
        minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity,
        changed: (boolean|undefined);

    // Find bounding box of all points
    points.forEach(function (point: Highcharts.Point): void {
        var bBox = point.graphic && point.graphic.getBBox() || point.shapeArgs;

        if (bBox && (bBox.width || bBox.height || bBox.x || bBox.y)) {
            changed = true;
            minX = Math.min(bBox.x, minX);
            maxX = Math.max(bBox.x + bBox.width, maxX);
            minY = Math.min(bBox.y, minY);
            maxY = Math.max(bBox.y + bBox.height, maxY);
        }
    });

    return changed ? chart.renderer.rect(
        minX,
        minY,
        maxX - minX,
        maxY - minY
    ) : chart.renderer.g();
};


/**
 * On point mouse out. Hide drag handles, depending on state.
 *
 * @private
 * @function mouseOut
 * @param {Highcharts.Point} point
 *        The point mousing out of.
 * @return {void}
 */
function mouseOut(point: Highcharts.Point): void {
    var chart = point.series && point.series.chart,
        dragDropData = chart && chart.dragDropData;

    if (
        chart &&
        chart.dragHandles &&
        !(
            dragDropData &&
            (
                dragDropData.isDragging &&
                dragDropData.draggedPastSensitivity ||
                dragDropData.isHoveringHandle === point.id
            )
        )
    ) {
        chart.hideDragHandles();
    }
}


/**
 * Mouseout on resize handle. Handle states, and possibly run mouseOut on point.
 *
 * @private
 * @function onResizeHandleMouseOut
 * @param {Highcharts.Point} point
 *        The point mousing out of.
 * @return {void}
 */
function onResizeHandleMouseOut(point: Highcharts.Point): void {
    var chart = point.series.chart;

    if (
        chart.dragDropData &&
        point.id === chart.dragDropData.isHoveringHandle
    ) {
        delete chart.dragDropData.isHoveringHandle;
    }
    if (!chart.hoverPoint) {
        mouseOut(point);
    }
}


/**
 * Mousedown on resize handle. Init a drag if the conditions are right.
 *
 * @private
 * @function onResizeHandleMouseDown
 * @param {Highcharts.PointerEventObject} e
 *        The mousedown event.
 * @param {Highcharts.Point} point
 *        The point mousing down on.
 * @param {string} updateProp
 *        The data property this resize handle is attached to for this point.
 * @return {void}
 */
function onResizeHandleMouseDown(
    e: Highcharts.PointerEventObject,
    point: Highcharts.Point,
    updateProp: string
): void {
    var chart = point.series.chart;

    // Ignore if zoom/pan key is pressed
    if (chart.zoomOrPanKeyPressed(e)) {
        return;
    }

    // Prevent zooming
    chart.mouseIsDown = false;

    // We started a drag
    initDragDrop(e, point);
    (chart.dragDropData as any).updateProp =
        (e as Highcharts.PointDragStartEventObject).updateProp = updateProp;
    point.firePointEvent('dragStart', e);

    // Prevent default to avoid point click for dragging too
    e.stopPropagation();
    e.preventDefault();
}


/**
 * Render drag handles on a point - depending on which handles are enabled - and
 * attach events to them.
 *
 * @private
 * @function Highcharts.Point#showDragHandles
 * @return {void}
 */
H.Point.prototype.showDragHandles = function (): void {
    var point = this,
        series = point.series,
        chart = series.chart,
        renderer = chart.renderer,
        options = merge(series.options.dragDrop, point.options.dragDrop);

    // Go through each updateProp and see if we are supposed to create a handle
    // for it.
    objectEach(series.dragDropProps, function (
        val: Highcharts.SeriesDragDropPropsObject,
        key: string
    ): void {
        var handleOptions: Highcharts.DragDropHandleOptionsObject = merge(
                defaultDragHandleOptions,
                val.handleOptions,
                options.dragHandle
            ),
            handleAttrs: Highcharts.SVGAttributes = {
                className: handleOptions.className,
                'stroke-width': handleOptions.lineWidth,
                fill: handleOptions.color,
                stroke: handleOptions.lineColor
            },
            pathFormatter = handleOptions.pathFormatter || val.handleFormatter,
            positioner = val.handlePositioner,
            pos,
            handle,
            handleSide,
            path,
            // Run validation function on whether or not we allow individual
            // updating of this prop.
            validate = val.validateIndividualDrag ?
                val.validateIndividualDrag(point) : true;

        if (
            val.resize &&
            validate &&
            val.resizeSide &&
            pathFormatter &&
            (
                (options as any)['draggable' + val.axis.toUpperCase()] ||
                (options as any)[val.optionName]
            ) &&
            (options as any)[val.optionName] !== false
        ) {

            // Create group if it doesn't exist
            if (!chart.dragHandles) {
                chart.dragHandles = {
                    group: renderer
                        .g('drag-drop-handles')
                        .add(series.markerGroup || series.group)
                } as any;
            }

            // Store which point this is
            (chart.dragHandles as any).point = point.id;

            // Find position and path of handle
            pos = positioner(point);
            handleAttrs.d = path = pathFormatter(point);
            handleSide = typeof val.resizeSide === 'function' ?
                val.resizeSide(point.options, point) : val.resizeSide;
            if (!path || pos.x < 0 || pos.y < 0) {
                return;
            }

            // If cursor is not set explicitly, use axis direction
            handleAttrs.cursor = handleOptions.cursor ||
                (val.axis === 'x') !== !!chart.inverted ?
                'ew-resize' : 'ns-resize';

            // Create and add the handle element if it doesn't exist
            handle = (chart.dragHandles as any)[handleSide];
            if (!handle) {
                handle = (chart.dragHandles as any)[handleSide] = renderer
                    .path()
                    .add((chart.dragHandles as any).group);
            }

            // Move and update handle
            handle.translate(pos.x, pos.y).attr(handleAttrs);

            // Add events
            addEvents(
                handle.element,
                ['touchstart', 'mousedown'],
                function (e: PointerEvent): void {
                    onResizeHandleMouseDown(
                        getNormalizedEvent(e, chart),
                        point,
                        key
                    );
                }
            );
            addEvent(
                (chart.dragHandles as any).group.element,
                'mouseover',
                function (): void {
                    chart.dragDropData = chart.dragDropData || ({} as any);
                    (chart.dragDropData as any).isHoveringHandle = point.id;
                }
            );
            addEvents(
                (chart.dragHandles as any).group.element,
                ['touchend', 'mouseout'],
                function (): void {
                    onResizeHandleMouseOut(point);
                }
            );
        }
    });
};


/**
 * Remove the chart's drag handles if they exist.
 *
 * @private
 * @function Highcharts.Chart#hideDragHandles
 * @return {void}
 */
H.Chart.prototype.hideDragHandles = function (): void {
    var chart = this;

    if (chart.dragHandles) {
        objectEach(chart.dragHandles, function (
            val: { destroy?: Function },
            key: string
        ): void {
            if (key !== 'group' && val.destroy) {
                val.destroy();
            }
        });
        if (chart.dragHandles.group && chart.dragHandles.group.destroy) {
            chart.dragHandles.group.destroy();
        }
        delete chart.dragHandles;
    }
};


/**
 * Utility function to count the number of props in an object.
 *
 * @private
 * @function countProps
 *
 * @param {object} obj
 *        The object to count.
 *
 * @return {number}
 *         Number of own properties on the object.
 */
function countProps(obj: object): number {
    var count = 0;

    for (var p in obj) {
        if (Object.hasOwnProperty.call(obj, p)) {
            count++;
        }
    }
    return count;
}


/**
 * Utility function to get the value of the first prop of an object. (Note that
 * the order of keys in an object is usually not guaranteed.)
 *
 * @private
 * @function getFirstProp
 * @param {Highcharts.Dictionary<T>} obj
 *        The object to count.
 * @return {T}
 *         Value of the first prop in the object.
 * @template T
 */
function getFirstProp<T>(obj: Highcharts.Dictionary<T>): (T|undefined) {
    for (var p in obj) {
        if (Object.hasOwnProperty.call(obj, p)) {
            return obj[p];
        }
    }
}


/**
 * Mouseover on a point. Show drag handles if the conditions are right.
 *
 * @private
 * @function mouseOver
 * @param {Highcharts.Point} point
 *        The point mousing over.
 * @return {void}
 */
function mouseOver(point: Highcharts.Point): void {
    var series = point.series,
        chart = series && series.chart,
        dragDropData = chart && chart.dragDropData;

    if (
        chart &&
        !(
            dragDropData &&
            dragDropData.isDragging && // Ignore if dragging a point
            dragDropData.draggedPastSensitivity
        ) &&
        !chart.isDragDropAnimating && // Ignore if animating
        series.options.dragDrop && // No need to compute handles without this
        !(
            chart.options &&
            chart.options.chart &&
            chart.options.chart.options3d // No 3D support
        )
    ) {
        // Hide the handles if they exist on another point already
        if (chart.dragHandles) {
            chart.hideDragHandles();
        }
        point.showDragHandles();
    }
}


/**
 * On container mouse move. Handle drag sensitivity and fire drag event.
 *
 * @private
 * @function mouseMove
 * @param {Highcharts.PointerEventObject} e
 *        The mouse move event.
 * @param {Highcharts.Chart} chart
 *        The chart we are moving across.
 * @return {void}
 */
function mouseMove(
    e: Highcharts.PointerEventObject,
    chart: Highcharts.Chart
): void {
    // Ignore if zoom/pan key is pressed
    if (chart.zoomOrPanKeyPressed(e)) {
        return;
    }

    var dragDropData = chart.dragDropData,
        point: Highcharts.Point,
        seriesDragDropOpts: Highcharts.DragDropOptionsObject,
        newPoints: Highcharts.Dictionary<Highcharts.DragDropPointObject>,
        numNewPoints = 0,
        newPoint: (Highcharts.DragDropPointObject|null|undefined);

    if (dragDropData && dragDropData.isDragging) {
        point = dragDropData.point;
        seriesDragDropOpts = point.series.options.dragDrop as any;

        // No tooltip for dragging
        e.preventDefault();

        // Update sensitivity test if not passed yet
        if (!dragDropData.draggedPastSensitivity) {
            dragDropData.draggedPastSensitivity = hasDraggedPastSensitivity(
                e, chart, pick(
                    point.options.dragDrop &&
                        point.options.dragDrop.dragSensitivity,
                    seriesDragDropOpts &&
                        seriesDragDropOpts.dragSensitivity,
                    defaultDragSensitivity
                )
            );
        }

        // If we have dragged past dragSensitivity, run the mousemove handler
        // for dragging
        if (dragDropData.draggedPastSensitivity) {
            // Find the new point values from the moving
            dragDropData.newPoints = getNewPoints(dragDropData, e);

            // If we are only dragging one point, add it to the event
            newPoints = dragDropData.newPoints;
            numNewPoints = countProps(newPoints);
            newPoint = numNewPoints === 1 ?
                getFirstProp(newPoints) :
                null;

            // Run the handler
            point.firePointEvent('drag', {
                origin: dragDropData.origin,
                newPoints: dragDropData.newPoints,
                newPoint: newPoint && newPoint.newValues,
                newPointId: newPoint && newPoint.point.id,
                numNewPoints: numNewPoints,
                chartX: e.chartX,
                chartY: e.chartY
            }, function (): void {
                dragMove(e, point);
            });
        }
    }
}


/**
 * On container mouse up. Fire drop event and reset state.
 *
 * @private
 * @function mouseUp
 * @param {Highcharts.PointerEventObject} e
 *        The mouse up event.
 * @param {Highcharts.Chart} chart
 *        The chart we were dragging in.
 * @return {void}
 */
function mouseUp(
    e: Highcharts.PointerEventObject,
    chart: Highcharts.Chart
): void {
    var dragDropData = chart.dragDropData;

    if (
        dragDropData &&
        dragDropData.isDragging &&
        dragDropData.draggedPastSensitivity
    ) {
        var point = dragDropData.point,
            newPoints: Highcharts.Dictionary<Highcharts.DragDropPointObject> =
                dragDropData.newPoints as any,
            numNewPoints = countProps(newPoints),
            newPoint = numNewPoints === 1 ?
                getFirstProp(newPoints) :
                null;

        // Hide the drag handles
        if (chart.dragHandles) {
            chart.hideDragHandles();
        }

        // Prevent default action
        e.preventDefault();
        chart.cancelClick = true;

        // Fire the event, with a default handler that updates the points

        point.firePointEvent('drop', {
            origin: dragDropData.origin,
            chartX: e.chartX,
            chartY: e.chartY,
            newPoints: newPoints,
            numNewPoints: numNewPoints,
            newPoint: newPoint && newPoint.newValues,
            newPointId: newPoint && newPoint.point.id
        } as Partial<Highcharts.PointDropEventObject>, function (): void {
            updatePoints(chart);
        });
    }

    // Reset
    delete chart.dragDropData;

    // Clean up the drag guide box if it exists. This is always added on
    // drag start, even if user is overriding events.
    if (chart.dragGuideBox) {
        chart.dragGuideBox.destroy();
        delete chart.dragGuideBox;
    }
}


/**
 * On container mouse down. Init dragdrop if conditions are right.
 *
 * @private
 * @function mouseDown
 * @param {Highcharts.PointerEventObject} e
 *        The mouse down event.
 * @param {Highcharts.Chart} chart
 *        The chart we are clicking.
 * @return {void}
 */
function mouseDown(
    e: Highcharts.PointerEventObject,
    chart: Highcharts.Chart
): void {
    var dragPoint = chart.hoverPoint,
        dragDropOptions = H.merge(
            dragPoint && dragPoint.series.options.dragDrop,
            dragPoint && dragPoint.options.dragDrop
        ),
        draggableX = dragDropOptions.draggableX || false,
        draggableY = dragDropOptions.draggableY || false;

    // Reset cancel click
    chart.cancelClick = false;

    // Ignore if:
    if (
        // Option is disabled for the point
        !(draggableX || draggableY) ||
        // Zoom/pan key is pressed
        chart.zoomOrPanKeyPressed(e) ||
        // Dragging an annotation
        chart.hasDraggedAnnotation
    ) {
        return;
    }

    // If we somehow get a mousedown event while we are dragging, cancel
    if (chart.dragDropData && chart.dragDropData.isDragging) {
        mouseUp(e, chart);
        return;
    }

    // If this point is movable, start dragging it
    if (dragPoint && isPointMovable(dragPoint)) {
        chart.mouseIsDown = false; // Prevent zooming
        initDragDrop(e, dragPoint);
        dragPoint.firePointEvent('dragStart', e);
    }
}

/* eslint-disable no-invalid-this */

// Point hover event. We use a short timeout due to issues with coordinating
// point mouseover/out events on dragHandles and points. Particularly arearange
// series are finicky since the markers are not individual points. This logic
// should preferably be improved in the future. Notice that the mouseOut event
// below must have a shorter timeout to ensure event order.
addEvent(H.Point, 'mouseOver', function (): void {
    var point = this;

    setTimeout(function (): void {
        mouseOver(point);
    }, 12);
});


// Point mouseleave event. See above function for explanation of the timeout.
addEvent(H.Point, 'mouseOut', function (): void {
    var point = this;

    setTimeout(function (): void {
        if (point.series) {
            mouseOut(point);
        }
    }, 10);
});


// Hide drag handles on a point if it is removed
addEvent(H.Point, 'remove', function (): void {
    var chart = this.series.chart,
        dragHandles = chart.dragHandles;

    if (dragHandles && dragHandles.point === this.id) {
        chart.hideDragHandles();
    }
});


/**
 * Check whether the zoomKey or panKey is pressed.
 *
 * @private
 * @function Highcharts.Chart#zoomOrPanKeyPressed
 * @param {global.Event} e
 *        A mouse event.
 * @return {boolean}
 *         True if the zoom or pan keys are pressed. False otherwise.
 */
H.Chart.prototype.zoomOrPanKeyPressed = function (e: Event): boolean {
    // Check whether the panKey and zoomKey are set in chart.userOptions
    var chartOptions = this.userOptions.chart || {},
        panKey = chartOptions.panKey && chartOptions.panKey + 'Key',
        zoomKey = chartOptions.zoomKey && chartOptions.zoomKey + 'Key';

    return ((e as any)[zoomKey as any] || (e as any)[panKey as any]);
};


/**
 * Add events to document and chart if the chart is draggable.
 *
 * @private
 * @function addDragDropEvents
 * @param {Highcharts.Chart} chart
 *        The chart to add events to.
 * @return {void}
 */
function addDragDropEvents(chart: Highcharts.Chart): void {
    var container = chart.container,
        doc = H.doc;

    // Only enable if we have a draggable chart
    if (isChartDraggable(chart)) {
        addEvents(
            container,
            ['mousedown', 'touchstart'],
            function (e: PointerEvent): void {
                mouseDown(getNormalizedEvent(e, chart), chart);
            }
        );
        addEvents(
            container,
            ['mousemove', 'touchmove'],
            function (e: PointerEvent): void {
                mouseMove(getNormalizedEvent(e, chart), chart);
            }
        );
        addEvent(
            container,
            'mouseleave',
            function (e: PointerEvent): void {
                mouseUp(getNormalizedEvent(e, chart), chart);
            }
        );
        chart.unbindDragDropMouseUp = addEvents(
            doc,
            ['mouseup', 'touchend'],
            function (e: PointerEvent): void {
                mouseUp(getNormalizedEvent(e, chart), chart);
            }
        );

        // Add flag to avoid doing this again
        chart.hasAddedDragDropEvents = true;

        // Add cleanup to make sure we don't pollute document
        addEvent(chart, 'destroy', function (): void {
            if (chart.unbindDragDropMouseUp) {
                chart.unbindDragDropMouseUp();
            }
        });
    }
}


// Add event listener to Chart.render that checks whether or not we should add
// dragdrop.
addEvent(H.Chart, 'render', function (): void {
    // If we don't have dragDrop events, see if we should add them
    if (!this.hasAddedDragDropEvents) {
        addDragDropEvents(this);
    }
});
