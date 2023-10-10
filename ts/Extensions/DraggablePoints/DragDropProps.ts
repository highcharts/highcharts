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

import type AreaRangePoint from '../../Series/AreaRange/AreaRangePoint';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type BoxPlotPoint from '../../Series/BoxPlot/BoxPlotPoint';
import type BulletPoint from '../../Series/Bullet/BulletPoint';
import type ColumnPoint from '../../Series/Column/ColumnPoint';
import type ColumnRangePoint from '../../Series/ColumnRange/ColumnRangePoint';
import type GanttPoint from '../../Series/Gantt/GanttPoint';
import type OHLCPoint from '../../Series/OHLC/OHLCPoint';
import type Point from '../../Core/Series/Point';
import type PositionObject from '../../Core/Renderer/PositionObject';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type WaterfallPoint from '../../Series/Waterfall/WaterfallPoint';
import type XRangePoint from '../../Series/XRange/XRangePoint';

import DraggableChart from './DraggableChart.js';
const { flipResizeSide } = DraggableChart;
import U from '../../Core/Utilities.js';
const {
    isNumber,
    merge,
    pick
} = U;

/* *
 *
 *  Constants
 *
 * */

// Line series - only draggableX/Y, no drag handles
const line = {
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
const flags = line;

// Column series - x can be moved, y can only be resized. Note extra
// functionality for handling upside down columns (below threshold).
const column = {
    x: {
        axis: 'x',
        move: true
    },
    y: {
        axis: 'y',
        move: false,
        resize: true,
        // Force guideBox start coordinates
        beforeResize: (
            guideBox: SVGElement,
            pointVals: Record<string, number>,
            point: ColumnPoint
        ): void => {
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
        resizeSide: (
            pointVals: Record<string, number>,
            point: ColumnPoint
        ): string => {
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
        handlePositioner: (
            point: ColumnPoint
        ): PositionObject => {
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
        handleFormatter: (
            point: ColumnPoint
        ): SVGPath => {
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

// Boxplot series - move x, resize or move low/q1/q3/high
const boxplot = {
    x: column.x,
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
        handlePositioner: (
            point: BoxPlotPoint
        ): PositionObject => ({
            x: point.shapeArgs.x || 0,
            y: point.lowPlot
        }),
        handleFormatter: column.y.handleFormatter,
        propValidate: (
            val: number,
            point: BoxPlotPoint
        ): boolean => (
            val <= point.q1
        )
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
        handlePositioner: (
            point: BoxPlotPoint
        ): PositionObject => ({
            x: point.shapeArgs.x || 0,
            y: point.q1Plot
        }),
        handleFormatter: column.y.handleFormatter,
        propValidate: (
            val: number,
            point: BoxPlotPoint
        ): boolean => (
            val <= point.median && val >= point.low
        )
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
        handlePositioner: (
            point: BoxPlotPoint
        ): PositionObject => ({
            x: point.shapeArgs.x || 0,
            y: point.q3Plot
        }),
        handleFormatter: column.y.handleFormatter,
        propValidate: (
            val: number,
            point: BoxPlotPoint
        ): boolean => (
            val <= point.high && val >= point.median
        )
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
        handlePositioner: (
            point: BoxPlotPoint
        ): PositionObject => ({
            x: point.shapeArgs.x || 0,
            y: point.highPlot
        }),
        handleFormatter: column.y.handleFormatter,
        propValidate: (
            val: number,
            point: BoxPlotPoint
        ): boolean => (
            val >= point.q3
        )
    }
};

// Bullet graph, x/y same as column, but also allow target to be dragged.
const bullet = {
    x: column.x,
    y: column.y,
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
        handlePositioner: (
            point: BulletPoint
        ): PositionObject => {
            const bBox: BBoxObject =
                (point.targetGraphic as any).getBBox();

            return {
                x: point.barX,
                y: bBox.y + bBox.height / 2
            };
        },
        handleFormatter: column.y.handleFormatter
    }
};

// OHLC series - move x, resize or move open/high/low/close
const ohlc = {
    x: column.x,
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
        handlePositioner: (
            point: OHLCPoint
        ): PositionObject => ({
            x: (point.shapeArgs as any).x,
            y: point.plotLow as any
        }),
        handleFormatter: column.y.handleFormatter,
        propValidate: (
            val: number,
            point: OHLCPoint
        ): boolean => (
            val <= point.open && val <= point.close
        )
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
        handlePositioner: (
            point: OHLCPoint
        ): PositionObject => ({
            x: (point.shapeArgs as any).x,
            y: point.plotHigh as any
        }),
        handleFormatter: column.y.handleFormatter,
        propValidate: (
            val: number,
            point: OHLCPoint
        ): boolean => (
            val >= point.open && val >= point.close
        )
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
        resizeSide: (
            point: OHLCPoint
        ): string => (
            point.open >= point.close ? 'top' : 'bottom'
        ),
        handlePositioner: (
            point: OHLCPoint
        ): PositionObject => ({
            x: (point.shapeArgs as any).x,
            y: point.plotOpen
        }),
        handleFormatter: column.y.handleFormatter,
        propValidate: (
            val: number,
            point: OHLCPoint
        ): boolean => (
            val <= point.high && val >= point.low
        )
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
        resizeSide: (
            point: OHLCPoint
        ): string => (
            point.open >= point.close ? 'bottom' : 'top'
        ),
        handlePositioner: (
            point: OHLCPoint
        ): PositionObject => ({
            x: (point.shapeArgs as any).x,
            y: point.plotClose
        }),
        handleFormatter: column.y.handleFormatter,
        propValidate: (
            val: number,
            point: OHLCPoint
        ): boolean => (
            val <= point.high && val >= point.low
        )
    }
};

// Waterfall - mostly as column, but don't show drag handles for sum points
const waterfall = {
    x: column.x,
    y: merge(column.y, {
        handleFormatter: (
            point: WaterfallPoint
        ): (SVGPath|null) => (
            point.isSum || point.isIntermediateSum ?
                null :
                column.y.handleFormatter(point)
        )
    })
};

// Columnrange series - move x, resize or move low/high
const columnrange = {
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
        handlePositioner: (
            point: ColumnRangePoint
        ): PositionObject => {
            const bBox = (
                point.shapeArgs || (point.graphic as any).getBBox()
            );

            return {
                x: bBox.x || 0,
                y: (bBox.y || 0) + (bBox.height || 0)
            };
        },
        handleFormatter: column.y.handleFormatter,
        propValidate: (
            val: number,
            point: ColumnRangePoint
        ): boolean => (
            val <= point.high
        )
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
        handlePositioner: (
            point: ColumnRangePoint
        ): PositionObject => {
            const bBox = (
                point.shapeArgs || (point.graphic as any).getBBox()
            );

            return {
                x: bBox.x || 0,
                y: bBox.y || 0
            };
        },
        handleFormatter: column.y.handleFormatter,
        propValidate: (
            val: number,
            point: ColumnRangePoint
        ): boolean => (
            val >= point.low
        )
    }
};

// Arearange series - move x, resize or move low/high
const arearange = {
    x: columnrange.x,
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
        handlePositioner: (
            point: AreaRangePoint
        ): PositionObject => {
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
        propValidate: columnrange.low.propValidate
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
        handlePositioner: (
            point: AreaRangePoint
        ): PositionObject => {
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
        propValidate: columnrange.high.propValidate
    }
};

// Xrange - resize/move x/x2, and move y
const xrange = {
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
        handlePositioner: (
            point: XRangePoint
        ): PositionObject => (
            xrangeHandlePositioner(point, 'x')
        ),
        handleFormatter: horizHandleFormatter,
        propValidate: (
            val: number,
            point: XRangePoint
        ): boolean => (
            val <= (point.x2 as any)
        )
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
        handlePositioner: (
            point: XRangePoint
        ): PositionObject => (
            xrangeHandlePositioner(point, 'x2')
        ),
        handleFormatter: horizHandleFormatter,
        propValidate: (
            val: number,
            point: XRangePoint
        ): boolean => (
            val >= (point.x as any)
        )
    }
};

// Gantt - same as xrange, but with aliases
const gantt = {
    y: xrange.y,
    /**
     * Allow start value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.gantt.dragDrop.draggableStart
     */
    start: merge(xrange.x, {
        optionName: 'draggableStart',
        // Do not allow individual drag handles for milestones
        validateIndividualDrag: (
            point: GanttPoint
        ): boolean => (
            !point.milestone
        )
    }),
    /**
     * Allow end value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.gantt.dragDrop.draggableEnd
     */
    end: merge(xrange.x2, {
        optionName: 'draggableEnd',
        // Do not allow individual drag handles for milestones
        validateIndividualDrag: (
            point: GanttPoint
        ): boolean => (
            !point.milestone
        )
    })
};

/* *
 *
 *  Functions
 *
 * */

/**
 * Use a circle covering the marker as drag handle.
 * @private
 */
function arearangeHandleFormatter(
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
}

/**
 * 90deg rotated column handle path, used in multiple series types.
 * @private
 */
function horizHandleFormatter(
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
}

/**
 * Handle positioner logic is the same for x and x2 apart from the x value.
 * shapeArgs does not take yAxis reversed etc into account, so we use
 * axis.toPixels to handle positioning.
 * @private
 */
function xrangeHandlePositioner(
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
}

/* *
 *
 *  Default Export
 *
 * */

const DragDropProps = {
    arearange,
    boxplot,
    bullet,
    column,
    columnrange,
    flags,
    gantt,
    line,
    ohlc,
    waterfall,
    xrange
};

export default DragDropProps;
