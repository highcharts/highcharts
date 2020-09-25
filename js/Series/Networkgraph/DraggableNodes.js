/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2020 Paweł Fus
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import Chart from '../../Core/Chart/Chart.js';
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent;
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
    onMouseDown: function (point, event) {
        var normalizedEvent = this.chart.pointer.normalize(event);
        point.fixedPosition = {
            chartX: normalizedEvent.chartX,
            chartY: normalizedEvent.chartY,
            plotX: point.plotX,
            plotY: point.plotY
        };
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
    onMouseMove: function (point, event) {
        if (point.fixedPosition && point.inDragMode) {
            var series = this, chart = series.chart, normalizedEvent = chart.pointer.normalize(event), diffX = point.fixedPosition.chartX - normalizedEvent.chartX, diffY = point.fixedPosition.chartY - normalizedEvent.chartY, newPlotX, newPlotY, graphLayoutsLookup = chart.graphLayoutsLookup;
            // At least 5px to apply change (avoids simple click):
            if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
                newPlotX = point.fixedPosition.plotX - diffX;
                newPlotY = point.fixedPosition.plotY - diffY;
                if (chart.isInsidePlot(newPlotX, newPlotY)) {
                    point.plotX = newPlotX;
                    point.plotY = newPlotY;
                    point.hasDragged = true;
                    this.redrawHalo(point);
                    graphLayoutsLookup.forEach(function (layout) {
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
    onMouseUp: function (point, event) {
        if (point.fixedPosition) {
            if (point.hasDragged) {
                if (this.layout.enableSimulation) {
                    this.layout.start();
                }
                else {
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
    redrawHalo: function (point) {
        if (point && this.halo) {
            this.halo.attr({
                d: point.haloPath(this.options.states.hover.halo.size)
            });
        }
    }
};
/*
 * Draggable mode:
 */
addEvent(Chart, 'load', function () {
    var chart = this, mousedownUnbinder, mousemoveUnbinder, mouseupUnbinder;
    if (chart.container) {
        mousedownUnbinder = addEvent(chart.container, 'mousedown', function (event) {
            var point = chart.hoverPoint;
            if (point &&
                point.series &&
                point.series.hasDraggableNodes &&
                point.series.options.draggable) {
                point.series.onMouseDown(point, event);
                mousemoveUnbinder = addEvent(chart.container, 'mousemove', function (e) {
                    return point &&
                        point.series &&
                        point.series.onMouseMove(point, e);
                });
                mouseupUnbinder = addEvent(chart.container.ownerDocument, 'mouseup', function (e) {
                    mousemoveUnbinder();
                    mouseupUnbinder();
                    return point &&
                        point.series &&
                        point.series.onMouseUp(point, e);
                });
            }
        });
    }
    addEvent(chart, 'destroy', function () {
        mousedownUnbinder();
    });
});
