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

import type AreaRangePoint from '../Series/AreaRange/AreaRangePoint';
import type Axis from '../Core/Axis/Axis';
import type BBoxObject from '../Core/Renderer/BBoxObject';
import type BoxPlotPoint from '../Series/BoxPlot/BoxPlotPoint';
import type BulletPoint from '../Series/Bullet/BulletPoint';
import Chart from '../Core/Chart/Chart.js';
import type ColumnPoint from '../Series/Column/ColumnPoint';
import type ColumnRangePoint from '../Series/ColumnRange/ColumnRangePoint';
import type {
    DragDropGuideBoxOptions,
    DragDropHandleOptions,
    DragDropOptions
} from './DraggablePoints/DragDropOptions';
import type { DragDropPositionObject } from './DraggablePoints/DraggableChart';
import type GanttPoint from '../Series/Gantt/GanttPoint';
import type { MapLonLatObject } from '../Maps/GeoJSON';
import type OHLCPoint from '../Series/OHLC/OHLCPoint';
import type PointerEvent from '../Core/PointerEvent';
import type PositionObject from '../Core/Renderer/PositionObject';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import type WaterfallPoint from '../Series/Waterfall/WaterfallPoint';
import type XRangePoint from '../Series/XRange/XRangePoint';

import DDU from './DraggablePoints/DragDropUtilities.js';
const {
    addEvents,
    getNormalizedEvent
} = DDU;
import DraggableChart from './DraggablePoints/DraggableChart.js';
const {
    flipResizeSide,
    initDragDrop
} = DraggableChart;
import DragDropDefaults from './DraggablePoints/DragDropDefaults.js';
import Point from '../Core/Series/Point.js';
import Series from '../Core/Series/Series.js';
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
const {
    seriesTypes
} = SeriesRegistry;
import U from '../Core/Utilities.js';
const {
    addEvent,
    clamp,
    isNumber,
    merge,
    objectEach,
    pick,
    pushUnique
} = U;

declare module '../Core/Series/PointLike' {
    interface PointLike {
        /** @requires modules/draggable-points */
        getDropValues(
            origin: DragDropPositionObject,
            newPos: PointerEvent,
            updateProps: Record<string, SeriesDragDropPropsObject>
        ): Record<string, number>;
        /** @requires modules/draggable-points */
        showDragHandles(): void;
    }
}

declare module '../Core/Series/PointOptions' {
    interface PointOptions {
        dragDrop?: DragDropOptions;
    }
}

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        /** @requires modules/draggable-points */
        dragDropProps?: (Record<string, Partial<SeriesDragDropPropsObject>>|null);
        /** @requires modules/draggable-points */
        getGuideBox(points: Array<Point>): SVGElement;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        dragDrop?: DragDropOptions;
    }
}

export interface PointDragCallbackFunction {
    (this: Point, event: PointDragEventObject): void;
}

export interface PointDragDropObject {
    newValues: Record<string, number>;
    point: Point;
}

export interface PointDragEventObject {
    newPoint?: PointDragDropObject;
    newPointId?: string;
    newPoints: Record<string, PointDragDropObject>;
    origin: DragDropPositionObject;
    preventDefault: Function;
    target: Point;
    type: 'drag';
}

export interface PointDragStartEventObject extends MouseEvent {
    updateProp?: string;
}

export interface PointDragStartCallbackFunction {
    (this: Point, event: PointDragStartEventObject): void;
}

export interface PointDropCallbackFunction {
    (this: Point, event: PointDropEventObject): void;
}

export interface PointDropEventObject {
    newPoint?: PointDragDropObject;
    newPointId?: string;
    newPoints: Record<string, PointDragDropObject>;
    numNewPoints: number;
    origin: DragDropPositionObject;
    preventDefault: Function;
    target: Point;
    type: 'drop';
}

export interface SeriesDragDropPropsObject {
    axis: string;
    beforeResize?: Function;
    handleOptions?: DragDropHandleOptions;
    move: boolean;
    optionName: string;
    resize: boolean;
    resizeSide: (string|SeriesDragDropPropsResizeSideFunction);
    validateIndividualDrag?: Function;
    handleFormatter(point: Point): (SVGPath|null);
    handlePositioner(point: Point): PositionObject;
    propValidate(val: number, point: Point): boolean;
}

interface SeriesDragDropPropsResizeSideFunction {
    (...args: Array<any>): string;
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
const horizHandleFormatter = function (
    point: Point
): SVGPath {
    const shapeArgs = point.shapeArgs || (point.graphic as any).getBBox(),
        top = shapeArgs.r || 0, // Rounding of bar corners
        bottom = shapeArgs.height - top,
        centerY = shapeArgs.height / 2;

    return [
        // Top wick
        ['M', 0, top],
        ['L', 0, centerY - 5],
        // Circle
        ['A', 1, 1, 0, 0, 0, 0, centerY + 5],
        ['A', 1, 1, 0, 0, 0, 0, centerY - 5],
        // Bottom wick
        ['M', 0, centerY + 5],
        ['L', 0, bottom]
    ];
};

// Line series - only draggableX/Y, no drag handles
const lineDragDropProps = Series.prototype.dragDropProps = {
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
const columnDragDropProps = seriesTypes.column.prototype.dragDropProps = {
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
            guideBox: SVGElement,
            pointVals: Record<string, number>,
            point: ColumnPoint
        ): void {
            // We need to ensure that guideBox always starts at threshold.
            // We flip whether or not we update the top or bottom of the guide
            // box at threshold, but if we drag the mouse fast, the top has not
            // reached threshold before we cross over and update the bottom.
            const plotThreshold = pick(
                    point.yBottom, // Added support for stacked series. (#18741)
                    point.series.translatedThreshold
                ),
                plotY = guideBox.attr('y') as number,
                threshold = isNumber(point.stackY) ? (
                    point.stackY - (point.y || 0)
                ) : point.series.options.threshold || 0,
                y = threshold + pointVals.y;

            let height,
                diff;

            if (point.series.yAxis.reversed ? y < threshold : y >= threshold) {
                // Above threshold - always set height to hit the threshold
                height = guideBox.attr('height') as number;
                diff = plotThreshold ? plotThreshold - plotY - height : 0;
                guideBox.attr({
                    height: Math.max(0, Math.round(height + diff))
                });
            } else {
                // Below - always set y to start at threshold
                guideBox.attr({
                    y: Math.round(plotY + (
                        plotThreshold ? plotThreshold - plotY : 0
                    ))
                });
            }
        },
        // Flip the side of the resize handle if column is below threshold.
        // Make sure we remove the handle on the other side.
        resizeSide: function (
            pointVals: Record<string, number>,
            point: ColumnPoint
        ): string {
            const chart = point.series.chart,
                dragHandles = chart.dragHandles,
                side = pointVals.y >= (point.series.options.threshold || 0) ?
                    'top' : 'bottom',
                flipSide = flipResizeSide(side);

            // Force remove handle on other side
            if (dragHandles && (dragHandles as any)[flipSide]) {
                (dragHandles as any)[flipSide].destroy();
                delete (dragHandles as any)[flipSide];
            }
            return side;
        },
        // Position handle at bottom if column is below threshold
        handlePositioner: function (point: ColumnPoint): PositionObject {
            const bBox = (
                    point.shapeArgs ||
                    (point.graphic && point.graphic.getBBox()) ||
                    {}
                ),
                reversed = point.series.yAxis.reversed,
                threshold = point.series.options.threshold || 0,
                y = point.y || 0,
                bottom =
                    (!reversed && y >= threshold) ||
                    (reversed && y < threshold);

            return {
                x: bBox.x || 0,
                y: bottom ? (bBox.y || 0) : (bBox.y || 0) + (bBox.height || 0)
            };
        },
        // Horizontal handle
        handleFormatter: function (point: ColumnPoint): SVGPath {
            const shapeArgs = point.shapeArgs || {},
                radius: number = shapeArgs.r || 0, // Rounding of bar corners
                width: number = shapeArgs.width || 0,
                centerX = width / 2;

            return [
                // Left wick
                ['M', radius, 0],
                ['L', centerX - 5, 0],
                // Circle
                ['A', 1, 1, 0, 0, 0, centerX + 5, 0],
                ['A', 1, 1, 0, 0, 0, centerX - 5, 0],
                // Right wick
                ['M', centerX + 5, 0],
                ['L', width - radius, 0]
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
                point: BulletPoint
            ): PositionObject {
                const bBox: BBoxObject =
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
                point: ColumnRangePoint
            ): PositionObject {
                const bBox = (
                    point.shapeArgs || (point.graphic as any).getBBox()
                );

                return {
                    x: bBox.x || 0,
                    y: (bBox.y || 0) + (bBox.height || 0)
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: ColumnRangePoint
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
                point: ColumnRangePoint
            ): PositionObject {
                const bBox = (
                    point.shapeArgs || (point.graphic as any).getBBox()
                );

                return {
                    x: bBox.x || 0,
                    y: bBox.y || 0
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: ColumnRangePoint
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
                point: BoxPlotPoint
            ): PositionObject {
                return {
                    x: point.shapeArgs.x || 0,
                    y: point.lowPlot
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: BoxPlotPoint
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
                point: BoxPlotPoint
            ): PositionObject {
                return {
                    x: point.shapeArgs.x || 0,
                    y: point.q1Plot
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: BoxPlotPoint
            ): boolean {
                return val <= point.median && val >= point.low;
            }
        },
        median: {
            // Median cannot be dragged individually, just move the whole
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
                point: BoxPlotPoint
            ): PositionObject {
                return {
                    x: point.shapeArgs.x || 0,
                    y: point.q3Plot
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: BoxPlotPoint
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
                point: BoxPlotPoint
            ): PositionObject {
                return {
                    x: point.shapeArgs.x || 0,
                    y: point.highPlot
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: BoxPlotPoint
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
                point: OHLCPoint
            ): PositionObject {
                return {
                    x: (point.shapeArgs as any).x,
                    y: point.plotLow as any
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: OHLCPoint
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
                point: OHLCPoint
            ): PositionObject {
                return {
                    x: (point.shapeArgs as any).x,
                    y: point.plotHigh as any
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: OHLCPoint
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
            resizeSide: function (point: OHLCPoint): string {
                return point.open >= point.close ? 'top' : 'bottom';
            },
            handlePositioner: function (
                point: OHLCPoint
            ): PositionObject {
                return {
                    x: (point.shapeArgs as any).x,
                    y: point.plotOpen
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: OHLCPoint
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
            resizeSide: function (point: OHLCPoint): string {
                return point.open >= point.close ? 'bottom' : 'top';
            },
            handlePositioner: function (
                point: OHLCPoint
            ): PositionObject {
                return {
                    x: (point.shapeArgs as any).x,
                    y: point.plotClose
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter,
            propValidate: function (
                val: number,
                point: OHLCPoint
            ): boolean {
                return val <= point.high && val >= point.low;
            }
        }
    };
}

// Arearange series - move x, resize or move low/high
if (seriesTypes.arearange) {
    const columnrangeDragDropProps =
            seriesTypes.columnrange.prototype.dragDropProps,
        // Use a circle covering the marker as drag handle
        arearangeHandleFormatter = function (
            point: AreaRangePoint
        ): SVGPath {
            const radius = point.graphic ?
                point.graphic.getBBox().width / 2 + 1 :
                4;

            return [
                ['M', 0 - radius, 0],
                ['a', radius, radius, 0, 1, 0, radius * 2, 0],
                ['a', radius, radius, 0, 1, 0, radius * -2, 0]
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
                point: AreaRangePoint
            ): PositionObject {
                const bBox = (
                    point.graphics &&
                    point.graphics[0] &&
                    point.graphics[0].getBBox()
                );

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
                point: AreaRangePoint
            ): PositionObject {
                const bBox = (
                    point.graphics &&
                    point.graphics[1] &&
                    point.graphics[1].getBBox()
                );

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
                point: WaterfallPoint
            ): (SVGPath|null) {
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
    const xrangeHandlePositioner = function (
            point: XRangePoint,
            xProp: string
        ): PositionObject {
            const series = point.series,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                inverted = series.chart.inverted,
                offsetY = series.columnMetrics ? series.columnMetrics.offset :
                    -(point.shapeArgs as any).height / 2;
            // Using toPixels handles axis.reversed, but doesn't take
            // chart.inverted into account.
            let newX = xAxis.toPixels((point as any)[xProp], true),
                newY = yAxis.toPixels(point.y as any, true);

            // Handle chart inverted
            if (inverted) {
                newX = xAxis.len - newX;
                newY = yAxis.len - newY;
            }

            newY += offsetY; // (#12872)

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
                    point: XRangePoint
                ): PositionObject {
                    return xrangeHandlePositioner(point, 'x');
                },
                handleFormatter: horizHandleFormatter,
                propValidate: function (
                    val: number,
                    point: XRangePoint
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
                    point: XRangePoint
                ): PositionObject {
                    return xrangeHandlePositioner(point, 'x2');
                },
                handleFormatter: horizHandleFormatter,
                propValidate: function (
                    val: number,
                    point: XRangePoint
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
                    point: GanttPoint
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
                    point: GanttPoint
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
     */
    function (type: string): void {
        if (seriesTypes[type]) {
            seriesTypes[type].prototype.dragDropProps = null;
        }
    }
);

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
Chart.prototype.setGuideBoxState = function (
    state: string,
    options?: Record<string, DragDropGuideBoxOptions>
): SVGElement {
    const guideBox = this.dragGuideBox,
        guideBoxOptions = merge(DragDropDefaults.guideBox, options),
        stateOptions = merge(
            guideBoxOptions['default'], // eslint-disable-line dot-notation
            guideBoxOptions[state]
        );

    return (guideBox as any)
        .attr({
            'class': stateOptions.className,
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
 * @param {Object} origin
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
Point.prototype.getDropValues = function (
    origin: DragDropPositionObject,
    newPos: PointerEvent,
    updateProps: Record<string, SeriesDragDropPropsObject>
): Record<string, number> {
    const point = this,
        series = point.series,
        chart = series.chart,
        mapView = chart.mapView,
        options = merge(series.options.dragDrop, point.options.dragDrop),
        result: Record<string, number> = {},
        pointOrigin = origin.points[point.id];
    let updateSingleProp: (boolean|undefined);

    // Find out if we only have one prop to update
    for (const key in updateProps) {
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
        const defaultPrecision =
            (series as any)[direction.toLowerCase() + 'Axis']
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
            );
        let res = val;

        if (precision) {
            res = Math.round(res / precision) * precision;
        }
        return clamp(res, min, max);
    };

    /**
     * Utility function to apply precision and limit a value within the
     * draggable range used only for Highcharts Maps.
     * @private
     * @param {PointerEvent} newPos
     *        PointerEvent, which is used to get the value
     * @param {string} direction
     *        Axis direction
     * @param {string} key
     *        Key for choosing between longitude and latitude
     * @return {number | undefined}
     *         Limited value
     */
    const limitToMapRange = function (
        newPos: PointerEvent,
        direction: string,
        key: string
    ): number | undefined {
        if (mapView) {
            const precision = pick<number|undefined, number>(
                    (options as any)['dragPrecision' + direction],
                    0
                ),
                lonLatMin = mapView.pixelsToLonLat({
                    x: 0,
                    y: 0
                }),
                lonLatMax = mapView.pixelsToLonLat({
                    x: chart.plotBox.width,
                    y: chart.plotBox.height
                });
            let min = pick(
                    (options as any)['dragMin' + direction] as any,
                    lonLatMin &&
                        lonLatMin[key as keyof MapLonLatObject],
                    -Infinity
                ),
                max = pick(
                    (options as any)['dragMax' + direction] as number,
                    lonLatMax &&
                        lonLatMax[key as keyof MapLonLatObject],
                    Infinity
                ),
                res = newPos[key as keyof typeof newPos] as number;

            if (mapView.projection.options.name === 'Orthographic') {
                return res;
            }

            if (key === 'lat') {
                // if map is bigger than possible projection range
                if (isNaN(min) || min > mapView.projection.maxLatitude) {
                    min = mapView.projection.maxLatitude;
                }

                if (isNaN(max) || max < -1 * mapView.projection.maxLatitude) {
                    max = -1 * mapView.projection.maxLatitude;
                }

                // swap for latitude
                const temp = max;
                max = min;
                min = temp;
            }

            if (!mapView.projection.hasCoordinates) {
                // establish y value
                const lonLatRes = mapView.pixelsToLonLat({
                    x: newPos.chartX - chart.plotLeft,
                    y: chart.plotHeight - newPos.chartY + chart.plotTop
                });
                if (lonLatRes) {
                    res = (lonLatRes as any)[key];
                }
            }

            if (precision) {
                res = Math.round(res / precision) * precision;
            }

            return clamp(res, min, max);
        }
    };

    // Assign new value to property. Adds dX/YValue to the old value, limiting
    // it within min/max ranges.
    objectEach(updateProps, function (
        val: SeriesDragDropPropsObject,
        key: string
    ): void {
        const oldVal = (pointOrigin.point as any)[key],
            axis: Axis = (series as any)[val.axis + 'Axis'],
            newVal = mapView ?
                limitToMapRange(newPos, val.axis.toUpperCase(), key) :
                limitToRange(
                    axis.toValue(
                        (axis.horiz ? newPos.chartX : newPos.chartY) +
                        (pointOrigin as any)[key + 'Offset']
                    ),
                    val.axis.toUpperCase()
                );

        // If we are updating a single prop, and it has a validation function
        // for the prop, run it. If it fails, don't update the value.
        if (
            isNumber(newVal) &&
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
Series.prototype.getGuideBox = function (
    points: Array<Point>
): SVGElement {
    const chart = this.chart;
    let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity,
        changed: (boolean|undefined);

    // Find bounding box of all points
    points.forEach(function (point: Point): void {
        const bBox = (
            point.graphic && point.graphic.getBBox() || point.shapeArgs
        );

        if (bBox) {
            let plotX2;
            const x2 = (point as XRangePoint).x2;
            if (isNumber(x2)) {
                plotX2 = point.series.xAxis.translate(
                    x2,
                    false,
                    false,
                    false,
                    true
                );
            }

            // Avoid a 0 min when some of the points being dragged are
            // completely outside the plot
            const skipBBox = !(bBox.width || bBox.height || bBox.x || bBox.y);

            changed = true;
            minX = Math.min(
                point.plotX || 0,
                plotX2 || 0,
                skipBBox ? Infinity : bBox.x || 0,
                minX
            );
            maxX = Math.max(
                point.plotX || 0,
                plotX2 || 0,
                (bBox.x || 0) + (bBox.width || 0),
                maxX
            );
            minY = Math.min(
                point.plotY || 0,
                skipBBox ? Infinity : bBox.y || 0,
                minY
            );
            maxY = Math.max(
                (bBox.y || 0) + (bBox.height || 0),
                maxY
            );
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
 */
function mouseOut(point: Point): void {
    const chart = point.series && point.series.chart,
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
 */
function onResizeHandleMouseOut(point: Point): void {
    const chart = point.series.chart;

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
 */
function onResizeHandleMouseDown(
    e: PointerEvent,
    point: Point,
    updateProp: string
): void {
    const chart = point.series.chart;

    // Ignore if zoom/pan key is pressed
    if (chart.zoomOrPanKeyPressed(e)) {
        return;
    }

    // Prevent zooming
    chart.mouseIsDown = false;

    // We started a drag
    initDragDrop(e, point);
    (chart.dragDropData as any).updateProp =
        (e as PointDragStartEventObject).updateProp = updateProp;
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
Point.prototype.showDragHandles = function (): void {
    const point = this,
        series = point.series,
        chart = series.chart,
        { inverted, renderer } = chart,
        options = merge(series.options.dragDrop, point.options.dragDrop);

    // Go through each updateProp and see if we are supposed to create a handle
    // for it.
    objectEach(series.dragDropProps, function (
        val: SeriesDragDropPropsObject,
        key: string
    ): void {
        const handleOptions: DragDropHandleOptions = merge(
                DragDropDefaults.dragHandle,
                val.handleOptions,
                options.dragHandle
            ),
            handleAttrs: SVGAttributes = {
                'class': handleOptions.className,
                'stroke-width': handleOptions.lineWidth,
                fill: handleOptions.color,
                stroke: handleOptions.lineColor
            },
            pathFormatter = handleOptions.pathFormatter || val.handleFormatter,
            handlePositioner = val.handlePositioner,
            // Run validation function on whether or not we allow individual
            // updating of this prop.
            validate = val.validateIndividualDrag ?
                val.validateIndividualDrag(point) : true;
        let pos,
            handle,
            path;

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
            pos = handlePositioner(point);
            handleAttrs.d = path = pathFormatter(point);
            // Correct left edge value depending on the xAxis' type, #16596
            const minEdge = point.series.xAxis.categories ? -0.5 : 0;
            if (!path || pos.x < minEdge || pos.y < 0) {
                return;
            }

            // If cursor is not set explicitly, use axis direction
            handleAttrs.cursor = handleOptions.cursor ||
                ((val.axis === 'x') !== !!inverted ?
                    'ew-resize' : 'ns-resize');

            // Create and add the handle element if it doesn't exist
            handle = (chart.dragHandles as any)[val.optionName];
            if (!handle) {
                handle = (chart.dragHandles as any)[val.optionName] = renderer
                    .path()
                    .add((chart.dragHandles as any).group);
            }

            // Move and update handle
            handleAttrs.translateX = inverted ?
                series.yAxis.len - pos.y :
                pos.x;
            handleAttrs.translateY = inverted ?
                series.xAxis.len - pos.x :
                pos.y;
            if (inverted) {
                handleAttrs.rotation = -90;
            }
            handle.attr(handleAttrs);

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
                },
                { passive: false }
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
Chart.prototype.hideDragHandles = function (): void {
    const chart = this;

    if (chart.dragHandles) {
        objectEach(chart.dragHandles, function (val, key): void {
            if (key !== 'group' && (val as SVGElement).destroy) {
                (val as SVGElement).destroy();
            }
        });
        if (chart.dragHandles.group && chart.dragHandles.group.destroy) {
            chart.dragHandles.group.destroy();
        }
        delete chart.dragHandles;
    }
};

/**
 * Mouseover on a point. Show drag handles if the conditions are right.
 *
 * @private
 * @function mouseOver
 * @param {Highcharts.Point} point
 *        The point mousing over.
 */
function mouseOver(point: Point): void {
    const series = point.series,
        chart = series && series.chart,
        dragDropData = chart && chart.dragDropData,
        is3d = chart && chart.is3d && chart.is3d();

    if (
        chart &&
        !(
            dragDropData &&
            dragDropData.isDragging && // Ignore if dragging a point
            dragDropData.draggedPastSensitivity
        ) &&
        !chart.isDragDropAnimating && // Ignore if animating
        series.options.dragDrop && // No need to compute handles without this
        !is3d // No 3D support
    ) {
        // Hide the handles if they exist on another point already
        if (chart.dragHandles) {
            chart.hideDragHandles();
        }
        point.showDragHandles();
    }
}

/* eslint-disable no-invalid-this */

// Point hover event. We use a short timeout due to issues with coordinating
// point mouseover/out events on dragHandles and points. Particularly arearange
// series are finicky since the markers are not individual points. This logic
// should preferably be improved in the future. Notice that the mouseOut event
// below must have a shorter timeout to ensure event order.
addEvent(Point, 'mouseOver', function (): void {
    const point = this;

    setTimeout(function (): void {
        mouseOver(point);
    }, 12);
});


// Point mouseleave event. See above function for explanation of the timeout.
addEvent(Point, 'mouseOut', function (): void {
    const point = this;

    setTimeout(function (): void {
        if (point.series) {
            mouseOut(point);
        }
    }, 10);
});


// Hide drag handles on a point if it is removed
addEvent(Point, 'remove', function (): void {
    const chart = this.series.chart,
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
Chart.prototype.zoomOrPanKeyPressed = function (e: Event): boolean {
    // Check whether the panKey and zoomKey are set in chart.userOptions
    const chartOptions = this.options.chart || {},
        panKey = chartOptions.panKey && chartOptions.panKey + 'Key',
        zoomKey = this.zooming.key && this.zooming.key + 'Key';

    return ((e as any)[zoomKey as any] || (e as any)[panKey as any]);
};

/* *
 *
 *  Composition
 *
 * */

namespace DraggablePoints {

    /* *
     *
     *  Constants
     *
     * */

    const composedMembers: Array<unknown> = [];

    /* *
     *
     *  Functions
     *
     * */

    /** @private */
    export function compose(
        ChartClass: typeof Chart
    ): void {
        DraggableChart.compose(ChartClass);
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default DraggablePoints;

/* *
 *
 *  API Declarations
 *
 * */

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

''; // detaches doclets above
