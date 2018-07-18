/**
 * (c) 2009-2017 Torstein Honsi
 *
 * License: www.H.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var addEvent = H.addEvent,
    each = H.each,
    merge = H.merge,
    pick = H.pick,
    doc = H.doc,
    columnProto = H.seriesTypes.column.prototype;


/**
 * Filter by dragMin and dragMax
 */
function filterRange(newY, series, XOrY) {
    var options = series.options.dragDrop || {},
        dragMin = pick(options['dragMin' + XOrY], undefined),
        dragMax = pick(options['dragMax' + XOrY], undefined),
        precision = pick(options['dragPrecision' + XOrY], undefined);

    if (!isNaN(precision)) {
        newY = Math.round(newY / precision) * precision;
    }

    if (newY < dragMin) {
        newY = dragMin;
    } else if (newY > dragMax) {
        newY = dragMax;
    }
    return newY;
}


/**
 * Check if the chart has any draggable series
 */
H.Chart.prototype.isDraggable = function () {
    var i = this.series.length;
    while (i--) {
        if (
            this.series[i].options.dragDrop &&
            (
                this.series[i].options.dragDrop.draggableX ||
                this.series[i].options.dragDrop.draggableY
            )
        ) {
            return true;
        }
    }
};


H.Chart.prototype.callbacks.push(function (chart) {
    var container = chart.container,
        chartOptions = chart.userOptions.chart || {},
        dragPoint,
        dragStart,
        dragX,
        dragY,
        dragPlotX,
        dragPlotY,
        dragPlotHigh,
        dragPlotLow,
        changeLow,
        newHigh,
        newLow,
        defaultDragDropOptions = {
            dragSensitiviy: 1
        },
        // Check whether the panKey and zoomKey are set in chart.userOptions
        panKey = chartOptions.panKey && chartOptions.panKey + 'Key',
        zoomKey = chartOptions.zoomKey && chartOptions.zoomKey + 'Key';

    // Check if chart is using the module, if not we don't do anything.
    if (!chart.isDraggable()) {
        return;
    }

    /**
     * Check whether the zoomKey or panKey is pressed
     **/
    function zoomOrPanKeyPressed(e) {
        return (e[zoomKey] || e[panKey]);
    }

    /**
     * Get the new values based on the drag event
     */
    function getNewPos(e) {
        var originalEvent = e.originalEvent || e,
            pageX = originalEvent.changedTouches ?
                originalEvent.changedTouches[0].pageX : e.pageX,
            pageY = originalEvent.changedTouches ?
                originalEvent.changedTouches[0].pageY : e.pageY,
            series = dragPoint.series,
            dragDropOptions = merge(
                defaultDragDropOptions, series.options.dragDrop
            ),
            draggableX = dragDropOptions.draggableX &&
                dragPoint.draggableX !== false,
            draggableY = dragDropOptions.draggableY &&
                dragPoint.draggableY !== false,
            dragSensitivity = dragDropOptions.dragSensitiviy,
            deltaX = draggableX ? dragX - pageX : 0,
            deltaY = draggableY ? dragY - pageY : 0,
            newPlotX = dragPlotX - deltaX,
            newPlotY = dragPlotY - deltaY,
            newX = dragX === undefined ?
                dragPoint.x : series.xAxis.toValue(newPlotX, true),
            newY = dragY === undefined ?
                dragPoint.y : series.yAxis.toValue(newPlotY, true);

        newX = filterRange(newX, series, 'X');
        newY = filterRange(newY, series, 'Y');

        if (dragPoint.low) {
            var newPlotHigh = dragPlotHigh - deltaY,
                newPlotLow = dragPlotLow - deltaY;
            newHigh = dragY === undefined ?
                dragPoint.high : series.yAxis.toValue(newPlotHigh, true);
            newLow = dragY === undefined ?
                dragPoint.low : series.yAxis.toValue(newPlotLow, true);
            newHigh = filterRange(newHigh, series, 'Y');
            newLow = filterRange(newLow, series, 'Y');
        }

        if (
            Math.sqrt(
                Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
            ) > dragSensitivity
        ) {
            return {
                x: draggableX ? newX : dragPoint.x,
                y: draggableY ? newY : dragPoint.y,
                high: (draggableY && !changeLow) ? newHigh : dragPoint.high,
                low: (draggableY && changeLow) ? newLow : dragPoint.low,
                dragStart: dragStart,
                originalEvent: e
            };
        }
        return null;
    }

    /**
     * Handler for mouseup
     */
    function drop(e) {
        var newPos = dragPoint && e && getNewPos(e);

        function reset() {
            dragPoint = dragX = dragY = undefined;
        }

        if (newPos) {
            dragPoint.firePointEvent('drop', newPos, function () {
                dragPoint.update(newPos);

                // Update k-d-tree immediately to prevent tooltip jump (#43)
                dragPoint.series.options.kdNow = true;
                dragPoint.series.buildKDTree();

                reset();
            });
        } else {
            reset();
        }
    }

    /**
     * Handler for mousedown
     */
    function mouseDown(e) {

        // Check whether the panKey or zoomKey isn't pressed
        if (!zoomOrPanKeyPressed(e)) {

            var options,
                originalEvent = e.originalEvent || e,
                hoverPoint,
                series,
                bottom;

            if (
                (originalEvent.target.getAttribute('class') || '')
                    .indexOf('highcharts-handle') !== -1
            ) {
                hoverPoint = originalEvent.target.point;
            }

            series = chart.hoverPoint && chart.hoverPoint.series;
            if (
                !hoverPoint &&
                chart.hoverPoint &&
                (!series.useDragHandle || !series.useDragHandle())
            ) {
                hoverPoint = chart.hoverPoint;
            }

            if (hoverPoint) {
                options = hoverPoint.series.options.dragDrop || {};
                dragStart = {};
                if (options.draggableX && hoverPoint.draggableX !== false) {
                    dragPoint = hoverPoint;
                    dragX = originalEvent.changedTouches ?
                        originalEvent.changedTouches[0].pageX : e.pageX;
                    dragPlotX = dragPoint.plotX;
                    dragStart.x = dragPoint.x;
                }

                if (options.draggableY && hoverPoint.draggableY !== false) {
                    dragPoint = hoverPoint;
                    // Added support for normal stacking (#78)
                    bottom = pick(series.translatedThreshold, chart.plotHeight);

                    dragY = originalEvent.changedTouches ?
                        originalEvent.changedTouches[0].pageY : e.pageY;
                    dragPlotY = dragPoint.plotY +
                        (bottom - (dragPoint.yBottom || bottom));
                    dragStart.y = dragPoint.y;
                    if (dragPoint.plotHigh) {
                        dragPlotHigh = dragPoint.plotHigh;
                        dragPlotLow = dragPoint.plotLow;
                        changeLow = (
                            Math.abs(dragPlotLow - (dragY - 60)) <
                            Math.abs(dragPlotHigh - (dragY - 60))
                        ) ? true : false;
                    }
                }

                // Disable zooming when dragging
                if (dragPoint) {
                    chart.mouseIsDown = false;
                }
            }
        }
    }

    /**
     * Handler for mousemove. If the mouse button is pressed, drag the element.
     */
    function mouseMove(e) {

        // Check whether the zoomKey or panKey isn't pressed
        if (dragPoint && !zoomOrPanKeyPressed(e)) {

            e.preventDefault();

            var evtArgs = getNewPos(e), // Gets x and y
                proceed;

            // Fire the 'drag' event with a default action to move the point.
            if (evtArgs) {
                dragPoint.firePointEvent(
                    'drag',
                    evtArgs,
                    function () {

                        var kdTree,
                            series = dragPoint.series;

                        proceed = true;

                        dragPoint.update(evtArgs, false);

                        // Hide halo while dragging (#14)
                        if (series.halo) {
                            series.halo = series.halo.destroy();
                        }

                        // Let the tooltip follow and reflect the drag point
                        chart.pointer.reset(true);


                        // Stacking requires full redraw
                        if (series.stackKey) {
                            chart.redraw();
                        } else {
                            // Do a series redraw only. Let the k-d-tree survive
                            // the redraw in order to prevent tooltip flickering
                            // (#43).
                            kdTree = series.kdTree;
                            series.redraw();
                            series.kdTree = kdTree;
                        }
                    }
                );

                // The default handler has not run because of prevented default
                if (!proceed) {
                    drop();
                }
            }
        }
    }

    // Kill animation on first drag when chart.animation is set to false.
    chart.redraw();

    // Add'em
    addEvent(container, 'mousemove', mouseMove);
    addEvent(container, 'touchmove', mouseMove);
    addEvent(container, 'mousedown', mouseDown);
    addEvent(container, 'touchstart', mouseDown);
    addEvent(doc, 'mouseup', drop);
    addEvent(doc, 'touchend', drop);
    addEvent(container, 'mouseleave', drop);
});

/**
 * Extend the column chart tracker by visualizing the tracker object for
 * small points
 */
columnProto.useDragHandle = function () {
    var is3d = this.chart.is3d && this.chart.is3d();
    return !is3d;
};

columnProto.dragHandlePath = function (shapeArgs, strokeW, isNegative) {
    var h = 6,
        h1 = h / 3,
        h2 = h1 * 2,
        x1 = shapeArgs.x,
        y = (isNegative ? shapeArgs.height - h : 0) + shapeArgs.y,
        x2 = shapeArgs.x + shapeArgs.width;

    return [
        'M', x1, y + h * strokeW,
        'L', x1, y,
        'L', x2, y,
        'L', x2, y + h1 * strokeW,
        'L', x1, y + h1 * strokeW,
        'L', x2, y + h1 * strokeW,
        'L', x2, y + h2 * strokeW,
        'L', x1, y + h2 * strokeW,
        'L', x2, y + h2 * strokeW,
        'L', x2, y + h * strokeW
    ];
};

H.wrap(columnProto, 'drawTracker', function (proceed) {
    var series = this,
        dragDropOptions = series.options.dragDrop || {},
        strokeW = series.borderWidth || 0;

    proceed.apply(series);

    if (
        this.useDragHandle() &&
        (dragDropOptions.draggableX || dragDropOptions.draggableY)
    ) {

        each(series.points, function (point) {
            var path = (
                    dragDropOptions.dragHandlePath ||
                    series.dragHandlePath
                )(point.shapeArgs, strokeW, point.negative);

            if (!point.handle) {
                point.handle = series.chart.renderer.path(path)
                    .attr({
                        fill: dragDropOptions.dragHandleFill ||
                            'rgba(0,0,0,0.5)',
                        'class': 'highcharts-handle',
                        'stroke-width': strokeW,
                        'stroke': dragDropOptions.dragHandleStroke ||
                            series.options.borderColor ||
                            1
                    })
                    .css({
                        cursor: 'ns-resize'
                    })
                    .add(series.group);

                point.handle.element.point = point;
            } else {
                point.handle.attr({ d: path });
            }
        });
    }
});
