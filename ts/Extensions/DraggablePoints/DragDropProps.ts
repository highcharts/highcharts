/* *
 *
 *  (c) 2009-2025 Highsoft AS
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
import type DragDropOptions from './DragDropOptions';
import type { SeriesDragDropPropsObject } from './DraggablePoints';
import type ErrorBarPoint from '../../Series/ErrorBar/ErrorBarPoint';
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
 *  Declarations
 *
 * */

// TODO: Consider making the below interfaces generic as long as
// the API docs are built correctly.

export interface BoxPlotSeriesDragDropOptions extends DragDropOptions {
    /**
     * Allow high value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.boxplot.dragDrop.draggableHigh
     */
    draggableHigh?: boolean;

    /**
     * Allow low value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.boxplot.dragDrop.draggableLow
     */
    draggableLow?: boolean;

    /**
     * Allow Q1 value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.boxplot.dragDrop.draggableQ1
     */
    draggableQ1?: boolean;

    /**
     * Allow Q3 value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.boxplot.dragDrop.draggableQ3
     */
    draggableQ3?: boolean;
}

declare module '../../Series/BoxPlot/BoxPlotSeriesOptions' {
    interface BoxPlotSeriesOptions {
        /**
         * The draggable-points module allows points to be moved around or
         * modified in the chart. In addition to the options mentioned under
         * the `dragDrop` API structure, the module fires three events,
         * [point.dragStart](plotOptions.series.point.events.dragStart),
         * [point.drag](plotOptions.series.point.events.drag) and
         * [point.drop](plotOptions.series.point.events.drop).
         *
         * The `boxplot` series additionally supports: `draggableHigh`,
         * `draggableLow`, `draggableQ1` and `draggableQ3` options.
         *
         * @since        6.2.0
         * @requires     modules/draggable-points
         */
        dragDrop?: BoxPlotSeriesDragDropOptions
    }
}

export interface ErrorBarSeriesDragDropOptions extends BoxPlotSeriesDragDropOptions {
    draggableQ1?: undefined;
    draggableQ3?: undefined;
}

declare module '../../Series/ErrorBar/ErrorBarSeriesOptions' {
    interface ErrorBarSeriesOptions {
        /**
         * The draggable-points module allows points to be moved around or
         * modified in the chart. In addition to the options mentioned under
         * the `dragDrop` API structure, the module fires three events,
         * [point.dragStart](plotOptions.series.point.events.dragStart),
         * [point.drag](plotOptions.series.point.events.drag) and
         * [point.drop](plotOptions.series.point.events.drop).
         *
         * The `errorbar` series additionally supports: `draggableHigh` and
         * `draggableLow` options.
         *
         * @since        6.2.0
         * @requires     modules/draggable-points
         */
        dragDrop?: ErrorBarSeriesDragDropOptions
    }
}

export interface BulletSeriesDragDropOptions extends DragDropOptions {
    /**
     * Allow target value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.bullet.dragDrop.draggableTarget
     */
    draggableTarget?: boolean;
}

declare module '../../Series/Bullet/BulletSeriesOptions' {
    interface BulletSeriesOptions {
        /**
         * The draggable-points module allows points to be moved around or
         * modified in the chart. In addition to the options mentioned under
         * the `dragDrop` API structure, the module fires three events,
         * [point.dragStart](plotOptions.series.point.events.dragStart),
         * [point.drag](plotOptions.series.point.events.drag) and
         * [point.drop](plotOptions.series.point.events.drop).
         *
         * The `bullet` series additionally supports: `draggableTarget` option.
         *
         * @since        6.2.0
         * @requires     modules/draggable-points
         */
        dragDrop?: BulletSeriesDragDropOptions
    }
}

export interface OHLCSeriesDragDropOptions extends DragDropOptions {
    /**
     * Allow close value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.ohlc.dragDrop.draggableClose
     */
    draggableClose?: boolean;

    /**
     * Allow high value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.ohlc.dragDrop.draggableHigh
     */
    draggableHigh?: boolean;

    /**
     * Allow low value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.ohlc.dragDrop.draggableLow
     */
    draggableLow?: boolean;

    /**
     * Allow open value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.ohlc.dragDrop.draggableOpen
     */
    draggableOpen?: boolean;
}

declare module '../../Series/OHLC/OHLCSeriesOptions' {
    interface OHLCSeriesOptions {
        /**
         * The draggable-points module allows points to be moved around or
         * modified in the chart. In addition to the options mentioned under
         * the `dragDrop` API structure, the module fires three events,
         * [point.dragStart](plotOptions.series.point.events.dragStart),
         * [point.drag](plotOptions.series.point.events.drag) and
         * [point.drop](plotOptions.series.point.events.drop).
         *
         * The `ohlc` series additionally supports: `draggableOpen`,
         * `draggableHigh`, `draggableLow` and `draggableClose` options.
         *
         * @since        6.2.0
         * @requires     modules/draggable-points
         */
        dragDrop?: OHLCSeriesDragDropOptions
    }
}

export interface ColumnRangeSeriesDragDropOptions extends DragDropOptions {
    /**
     * Allow high value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.columnrange.dragDrop.draggableHigh
     */
    draggableHigh?: boolean;

    /**
     * Allow low value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.columnrange.dragDrop.draggableLow
     */
    draggableLow?: boolean;
}

declare module '../../Series/ColumnRange/ColumnRangeSeriesOptions' {
    interface ColumnRangeSeriesOptions {
        /**
         * The draggable-points module allows points to be moved around or
         * modified in the chart. In addition to the options mentioned under
         * the `dragDrop` API structure, the module fires three events,
         * [point.dragStart](plotOptions.series.point.events.dragStart),
         * [point.drag](plotOptions.series.point.events.drag) and
         * [point.drop](plotOptions.series.point.events.drop).
         *
         * The `columnrange` series additionally supports: `draggableHigh` and
         * `draggableLow` options.
         *
         * @since        6.2.0
         * @requires     modules/draggable-points
         */
        dragDrop?: ColumnRangeSeriesDragDropOptions
    }
}

export interface AreaRangeSeriesDragDropOptions extends DragDropOptions {
    /**
     * Allow high value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.arearange.dragDrop.draggableHigh
     */
    draggableHigh?: boolean;

    /**
     * Allow low value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.arearange.dragDrop.draggableLow
     */
    draggableLow?: boolean;
}

declare module '../../Series/AreaRange/AreaRangeSeriesOptions' {
    interface AreaRangeSeriesOptions {
        /**
         * The draggable-points module allows points to be moved around or
         * modified in the chart. In addition to the options mentioned under
         * the `dragDrop` API structure, the module fires three events,
         * [point.dragStart](plotOptions.series.point.events.dragStart),
         * [point.drag](plotOptions.series.point.events.drag) and
         * [point.drop](plotOptions.series.point.events.drop).
         *
         * The `arearange` series additionally supports: `draggableHigh` and
         * `draggableLow` options.
         *
         * @since        6.2.0
         * @requires     modules/draggable-points
         */
        dragDrop?: AreaRangeSeriesDragDropOptions
    }
}

export interface XrangeSeriesDragDropOptions extends DragDropOptions {
    /**
     * Allow x value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.xrange.dragDrop.draggableX1
     */
    draggableX1?: boolean;

    /**
     * Allow x2 value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.xrange.dragDrop.draggableX2
     */
    draggableX2?: boolean;
}

declare module '../../Series/XRange/XRangeSeriesOptions' {
    interface XRangeSeriesOptions {
        /**
         * The draggable-points module allows points to be moved around or
         * modified in the chart. In addition to the options mentioned under
         * the `dragDrop` API structure, the module fires three events,
         * [point.dragStart](plotOptions.series.point.events.dragStart),
         * [point.drag](plotOptions.series.point.events.drag) and
         * [point.drop](plotOptions.series.point.events.drop).
         *
         * The `xrange` series additionally supports: `draggableX1` and
         * `draggableX2` options.
         *
         * @since        6.2.0
         * @requires     modules/draggable-points
         */
        dragDrop?: XrangeSeriesDragDropOptions
    }
}

export interface GanttSeriesDragDropOptions extends DragDropOptions {
    /**
     * Allow end value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.gantt.dragDrop.draggableEnd
     */
    draggableEnd?: boolean;

    /**
     * Allow start value to be dragged individually.
     *
     * @type      {boolean}
     * @default   true
     * @requires  modules/draggable-points
     * @apioption plotOptions.gantt.dragDrop.draggableStart
     */
    draggableStart?: boolean;
}

declare module '../../Series/Gantt/GanttSeriesOptions' {
    interface GanttSeriesOptions {
        /**
         * The draggable-points module allows points to be moved around or
         * modified in the chart. In addition to the options mentioned under
         * the `dragDrop` API structure, the module fires three events,
         * [point.dragStart](plotOptions.series.point.events.dragStart),
         * [point.drag](plotOptions.series.point.events.drag) and
         * [point.drop](plotOptions.series.point.events.drop).
         *
         * The `gantt` series additionally supports: `draggableEnd` and
         * `draggableStart` options.
         *
         * @since        6.2.0
         * @requires     modules/draggable-points
         */
        dragDrop?: GanttSeriesDragDropOptions
    }
}

/* *
 *
 *  Constants
 *
 * */

// Line series - only draggableX/Y, no drag handles
const line: Record<string, Partial<SeriesDragDropPropsObject>> = {
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
const flags: Record<string, Partial<SeriesDragDropPropsObject>> = line;

// Column series - x can be moved, y can only be resized. Note extra
// functionality for handling upside down columns (below threshold).
const column: Record<string, Partial<SeriesDragDropPropsObject>> = {
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
const boxplot: Record<string, Partial<SeriesDragDropPropsObject>> = {
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

// Errorbar series - move x, resize or move low/high
const errorbar: Record<string, Partial<SeriesDragDropPropsObject>> = {
    x: column.x,
    low: {
        ...boxplot.low,
        propValidate: (
            val: number,
            point: ErrorBarPoint
        ): boolean => (
            val <= point.high
        )
    },
    high: {
        ...boxplot.high,
        propValidate: (
            val: number,
            point: ErrorBarPoint
        ): boolean => (
            val >= point.low
        )
    }
};

/**
 * @exclude      draggableQ1, draggableQ3
 * @optionparent plotOptions.errorbar.dragDrop
 */

// Bullet graph, x/y same as column, but also allow target to be dragged.
const bullet: Record<string, Partial<SeriesDragDropPropsObject>> = {
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
const ohlc: Record<string, Partial<SeriesDragDropPropsObject>> = {
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
const waterfall: Record<string, Partial<SeriesDragDropPropsObject>> = {
    x: column.x,
    y: merge(column.y, {
        handleFormatter: (
            point: WaterfallPoint
        ): (SVGPath|null) => (
            point.isSum || point.isIntermediateSum ?
                null :
                column?.y?.handleFormatter?.(point) || null
        )
    })
};

// Columnrange series - move x, resize or move low/high
const columnrange: Record<string, Partial<SeriesDragDropPropsObject>> = {
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
const arearange: Record<string, Partial<SeriesDragDropPropsObject>> = {
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
const xrange: Record<string, Partial<SeriesDragDropPropsObject>> = {
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
const gantt: Record<string, Partial<SeriesDragDropPropsObject>> = {
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
 * @internal
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
 * @internal
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
 * @internal
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

/** @internal */
const DragDropProps = {
    arearange,
    boxplot,
    bullet,
    column,
    columnrange,
    errorbar,
    flags,
    gantt,
    line,
    ohlc,
    waterfall,
    xrange
};

/** @internal */
export default DragDropProps;
