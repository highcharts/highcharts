/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2021 Paweł Fus
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Point from '../../Core/Series/Point';
import type PointerEvent from '../../Core/PointerEvent';
import type Series from '../../Core/Series/Series';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
const { addEvent } = U;


/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface DragNodesMixin {
            onMouseDown(
                this: DragNodesSeries,
                point: Point,
                event: Event
            ): void;
            onMouseMove(
                this: DragNodesSeries,
                point: DragNodesPoint,
                event: PointerEvent
            ): void;
            onMouseUp(
                this: DragNodesSeries,
                point: DragNodesPoint,
                event?: PointerEvent
            ): void;
            redrawHalo(point: DragNodesPoint): void;
        }
        interface DragNodesChart extends Chart {
            graphLayoutsLookup: Array<NetworkgraphLayout>;
            hoverPoint: DragNodesPoint;
        }
        interface DragNodesPoint extends Point {
            fixedPosition?: Record<string, number>;
            hasDragged?: boolean;
            inDragMode?: boolean;
            series: DragNodesSeries;
        }
        interface DragNodesSeries extends Series {
            chart: DragNodesChart;
            data: Array<DragNodesPoint>;
            hasDraggableNodes?: boolean;
            layout: NetworkgraphLayout;
            onMouseDown: DragNodesMixin['onMouseDown'];
            onMouseMove: DragNodesMixin['onMouseMove'];
            onMouseUp: DragNodesMixin['onMouseUp'];
            options: DragNodesSeriesOptions;
            points: Array<DragNodesPoint>;
            redrawHalo: DragNodesMixin['redrawHalo'];
        }
        interface DragNodesSeriesOptions extends SeriesOptions {
            draggable?: boolean;
            fixedDraggable?: boolean;
        }
        let dragNodesMixin: DragNodesMixin;
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

H.dragNodesMixin = {
    /**
     * Mouse down action, initializing drag&drop mode.
     *
     * @private
     * @param {Highcharts.Point} point The point that event occured.
     * @param {Highcharts.PointerEventObject} event Browser event, before normalization.
     * @return {void}
     */
    onMouseDown: function (
        this: Highcharts.DragNodesSeries,
        point: Highcharts.DragNodesPoint,
        event: PointerEvent
    ): void {
        var normalizedEvent = this.chart.pointer.normalize(event);

        point.fixedPosition = {
            chartX: normalizedEvent.chartX,
            chartY: normalizedEvent.chartY,
            plotX: point.plotX,
            plotY: point.plotY
        } as Record<string, number>;

        point.inDragMode = true;
    },
    /**
     * Mouse move action during drag&drop.
     *
     * @private
     *
     * @param {global.Event} event Browser event, before normalization.
     * @param {Highcharts.Point} point The point that event occured.
     *
     * @return {void}
     */
    onMouseMove: function (
        this: Highcharts.DragNodesSeries,
        point: Highcharts.DragNodesPoint,
        event: PointerEvent
    ): void {
        if (point.fixedPosition && point.inDragMode) {
            var series = this,
                chart = series.chart,
                normalizedEvent = chart.pointer.normalize(event),
                diffX = point.fixedPosition.chartX - normalizedEvent.chartX,
                diffY = point.fixedPosition.chartY - normalizedEvent.chartY,
                newPlotX,
                newPlotY,
                graphLayoutsLookup = chart.graphLayoutsLookup;

            // At least 5px to apply change (avoids simple click):
            if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
                newPlotX = point.fixedPosition.plotX - diffX;
                newPlotY = point.fixedPosition.plotY - diffY;

                if (chart.isInsidePlot(newPlotX, newPlotY)) {
                    point.plotX = newPlotX;
                    point.plotY = newPlotY;
                    point.hasDragged = true;

                    this.redrawHalo(point);

                    graphLayoutsLookup.forEach((layout): void => {
                        layout.restartSimulation();
                    });
                }
            }
        }
    },
    /**
     * Mouse up action, finalizing drag&drop.
     *
     * @private
     * @param {Highcharts.Point} point The point that event occured.
     * @return {void}
     */
    onMouseUp: function (
        this: Highcharts.DragNodesSeries,
        point: Highcharts.DragNodesPoint,
        event?: PointerEvent
    ): void {
        if (point.fixedPosition) {
            if (point.hasDragged) {
                if (this.layout.enableSimulation) {
                    this.layout.start();
                } else {
                    this.chart.redraw();
                }
            }
            point.inDragMode = point.hasDragged = false;
            if (!this.options.fixedDraggable) {
                delete point.fixedPosition;
            }
        }
    },
    // Draggable mode:
    /**
     * Redraw halo on mousemove during the drag&drop action.
     *
     * @private
     * @param {Highcharts.Point} point The point that should show halo.
     * @return {void}
     */
    redrawHalo: function (
        this: Highcharts.DragNodesSeries,
        point: Highcharts.DragNodesPoint
    ): void {
        if (point && this.halo) {
            this.halo.attr({
                d: point.haloPath(
                    (this.options.states as any).hover.halo.size
                ) as any
            });
        }
    }
};

/*
 * Draggable mode:
 */
addEvent(
    Chart as any,
    'load',
    function (this: Highcharts.DragNodesChart): void {
        var chart = this,
            mousedownUnbinder: Function,
            mousemoveUnbinder: Function,
            mouseupUnbinder: Function;

        if (chart.container) {
            mousedownUnbinder = addEvent(
                chart.container,
                'mousedown',
                function (event: PointerEvent): void {
                    var point = chart.hoverPoint;
                    if (
                        point &&
                        point.series &&
                        point.series.hasDraggableNodes &&
                        point.series.options.draggable
                    ) {
                        point.series.onMouseDown(point, event);
                        mousemoveUnbinder = addEvent(
                            chart.container,
                            'mousemove',
                            function (e: PointerEvent): void {
                                return point &&
                                    point.series &&
                                    point.series.onMouseMove(point, e);
                            }
                        );
                        mouseupUnbinder = addEvent(
                            chart.container.ownerDocument,
                            'mouseup',
                            function (e: PointerEvent): void {
                                mousemoveUnbinder();
                                mouseupUnbinder();
                                return point &&
                                    point.series &&
                                    point.series.onMouseUp(point, e);
                            }
                        );
                    }
                }
            );
        }

        addEvent(chart, 'destroy', function (): void {
            mousedownUnbinder();
        });
    }
);
