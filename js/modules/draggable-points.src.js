/**
 * (c) 2009-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var addEvent = H.addEvent,
    each = H.each,
    merge = H.merge,
    pick = H.pick,
    doc = H.doc,
    columnProto = H.seriesTypes.column.prototype,
    defaultDragDropOptions = {
        dragSensitiviy: 1
    };


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


/**
 * Check whether the zoomKey or panKey is pressed
 */
H.Chart.prototype.zoomOrPanKeyPressed = function (e) {
    // Check whether the panKey and zoomKey are set in chart.userOptions
    var chartOptions = this.userOptions.chart || {},
        panKey = chartOptions.panKey && chartOptions.panKey + 'Key',
        zoomKey = chartOptions.zoomKey && chartOptions.zoomKey + 'Key';
    return (e[zoomKey] || e[panKey]);
};


/**
 * Get the new position values based on a drag event
 */
function getNewPos(e, chart) {
    var originalEvent = e.originalEvent || e,
        pageX = originalEvent.changedTouches ?
            originalEvent.changedTouches[0].pageX : e.pageX,
        pageY = originalEvent.changedTouches ?
            originalEvent.changedTouches[0].pageY : e.pageY,
        dragStart = chart.dragStart,
        dragPoint = dragStart.point,
        series = dragStart.point.series,
        dragDropOptions = merge(
            defaultDragDropOptions, series.options.dragDrop
        ),
        draggableX = dragDropOptions.draggableX &&
            dragPoint.draggableX !== false,
        draggableY = dragDropOptions.draggableY &&
            dragPoint.draggableY !== false,
        dragSensitivity = dragDropOptions.dragSensitiviy,
        deltaX = draggableX ? dragStart.pageX - pageX : 0,
        deltaY = draggableY ? dragStart.pageY - pageY : 0,
        newPlotX = dragStart.plotX - deltaX,
        newPlotY = dragStart.plotY - deltaY,
        newX = dragStart.pageX === undefined ?
            dragPoint.x : series.xAxis.toValue(newPlotX, true),
        newY = dragStart.pageY === undefined ?
            dragPoint.y : series.yAxis.toValue(newPlotY, true),
        changeLow,
        newHigh,
        newLow;

    // Filter by max values
    newX = filterRange(newX, series, 'X');
    newY = filterRange(newY, series, 'Y');

    // Handle low/high points
    if (dragPoint.low) {
        var newPlotHigh = dragStart.plotHigh - deltaY,
            newPlotLow = dragStart.plotLow - deltaY;
        newHigh = dragStart.pageY === undefined ?
            dragPoint.high : series.yAxis.toValue(newPlotHigh, true);
        newLow = dragStart.pageY === undefined ?
            dragPoint.low : series.yAxis.toValue(newPlotLow, true);
        newHigh = filterRange(newHigh, series, 'Y');
        newLow = filterRange(newLow, series, 'Y');

        // Are we changing the high or the low value
        changeLow = (
            Math.abs(dragPoint.plotLow - (dragStart.pageY - 60)) <
            Math.abs(dragPoint.plotHigh - (dragStart.pageY - 60))
        ) ? true : false;
    }

    // Return new position
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
 * Handler for mousedown
 */
function mouseDownHandler(e, chart) {
    // Check that the panKey or zoomKey isn't pressed
    if (!chart.zoomOrPanKeyPressed(e)) {
        var options,
            originalEvent = e.originalEvent || e,
            hoverPoint,
            dragStart = {},
            series,
            bottom;

        // Find hover point
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

        // Store information on chart.dragStart about the drag
        if (hoverPoint) {
            options = hoverPoint.series.options.dragDrop || {};
            if (options.draggableX && hoverPoint.draggableX !== false) {
                dragStart.point = hoverPoint;
                dragStart.pageX = originalEvent.changedTouches ?
                    originalEvent.changedTouches[0].pageX : e.pageX;
                dragStart.plotX = hoverPoint.plotX;
                dragStart.x = hoverPoint.x;
                dragStart.x2 = hoverPoint.x2;
            }

            if (options.draggableY && hoverPoint.draggableY !== false) {
                dragStart.point = hoverPoint;
                // Added support for normal stacking (#78)
                bottom = pick(series.translatedThreshold, chart.plotHeight);

                dragStart.pageY = originalEvent.changedTouches ?
                    originalEvent.changedTouches[0].pageY : e.pageY;
                dragStart.plotY = hoverPoint.plotY +
                    (bottom - (hoverPoint.yBottom || bottom));
                dragStart.y = hoverPoint.y;
                if (hoverPoint.plotHigh) {
                    dragStart.plotHigh = hoverPoint.plotHigh;
                    dragStart.plotLow = hoverPoint.plotLow;
                }
            }

            // Disable zooming when dragging
            if (dragStart.point) {
                chart.mouseIsDown = false;
            }

            chart.dragStart = dragStart;
        }
    }
}


/**
 * Handler for mouseup
 */
function mouseUpHandler(e, chart) {
    var dragStart = chart.dragStart,
        newPos = dragStart && dragStart.point && e && getNewPos(e, chart);

    function reset() {
        delete chart.dragStart;
    }

    if (newPos) {
        dragStart.point.firePointEvent('drop', newPos, function () {
            dragStart.point.update(newPos);

            // Update k-d-tree immediately to prevent tooltip jump (#43)
            dragStart.point.series.options.kdNow = true;
            dragStart.point.series.buildKDTree();

            reset();
        });
    } else {
        reset();
    }
}


/**
 * Handler for mousemove. If the mouse button is pressed, drag the element.
 */
function mouseMoveHandler(e, chart) {
    var dragStart = chart.dragStart;

    // Check whether the zoomKey or panKey isn't pressed
    if (dragStart && dragStart.point && !chart.zoomOrPanKeyPressed(e)) {
        e.preventDefault();

        var evtArgs = getNewPos(e, chart), // Gets x and y
            proceed;

        // Fire the 'drag' event with a default action to move the point.
        if (evtArgs) {
            dragStart.point.firePointEvent(
                'drag',
                evtArgs,
                function () {
                    var kdTree,
                        series = dragStart.point.series;

                    proceed = true;

                    dragStart.point.update(evtArgs, false);

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
                mouseUpHandler(e, chart);
            }
        }
    }
}


/**
 * Add events after chart has been created
 */
H.Chart.prototype.callbacks.push(function (chart) {
    var container = chart.container,
        mouseDown = function (e) {
            return mouseDownHandler(e, chart);
        },
        mouseUp = function (e) {
            return mouseUpHandler(e, chart);
        },
        mouseMove = function (e) {
            return mouseMoveHandler(e, chart);
        };

    // Check if chart is using the module, if not we don't do anything.
    if (!chart.isDraggable()) {
        return;
    }

    // Kill animation on first drag when chart.animation is set to false.
    chart.redraw();

    // Add event handlers
    addEvent(container, 'mousemove', mouseMove);
    addEvent(container, 'touchmove', mouseMove);
    addEvent(container, 'mousedown', mouseDown);
    addEvent(container, 'touchstart', mouseDown);
    addEvent(container, 'mouseleave', mouseUp);
    chart.unbindDragDropMouseUp = addEvent(doc, 'mouseup', mouseUp);
    chart.unbindDragDropTouchEnd = addEvent(doc, 'touchend', mouseUp);

    // Add cleanup to make sure we don't pollute document
    addEvent(chart, 'destroy', function () {
        if (chart.unbindDragDropMouseUp) {
            chart.unbindDragDropMouseUp();
        }
        if (chart.unbindDragDropTouchEnd) {
            chart.unbindDragDropTouchEnd();
        }
    });
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
        strokeW = series.dragHandleLineWidth || series.borderWidth || 0;

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
                            series.dragHandleFill ||
                            'rgba(0,0,0,0.5)',
                        'class': 'highcharts-handle',
                        'stroke-width': strokeW,
                        'stroke': dragDropOptions.dragHandleLineColor ||
                            series.dragHandleLineColor ||
                            series.options.borderColor ||
                            1
                    })
                    .css({
                        cursor: series.dragCursor || 'ns-resize'
                    })
                    .add(series.group);

                point.handle.element.point = point;
            } else {
                point.handle.attr({ d: path });
            }
        });
    }
});
