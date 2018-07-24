/**
 * (c) 2009-2017 Øystein Moseng, Jon A. Nygård
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

/**
 * TODO: This module should be merged with draggable-points. The functionality
 *  here could be useful for more series types. Also, many edge cases are better
 *  handled in the draggable-points module (stacking, negatives, touch).
 */

/**
 * The draggable-points module allows points to be moved around or resized
 * in the chart. This module is still considered experimental.
 *
 * It requires the `modules/draggable-points.js` file to be loaded. For Gantt
 * or Xrange charts, use `modules/draggable-gantt.js`. Note that these modules
 * will potentially be merged in the future.
 *
 * @type {object}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop
 */

/**
 * Set the minimum X value the points can be moved to.
 *
 * @type {number}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.dragMinX
 */

/**
 * Set the maximum X value the points can be moved to.
 *
 * @type {number}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.dragMaxX
 */

/**
 * Set the minimum Y value the points can be moved to.
 *
 * @type {number}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.dragMinY
 */

/**
 * Set the maximum Y value the points can be moved to.
 *
 * @type {number}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.dragMaxY
 */

/**
 * The X precision value to drag to for this series.
 *
 * @type {number}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.dragPrecisionX
 */

/**
 * The Y precision value to drag to for this series.
 *
 * @type {number}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.dragPrecisionY
 */

/**
 * The amount of pixels to drag the pointer before it counts as a drag
 * operation. This prevents drag/drop to fire when just clicking or selecting
 * points.
 *
 * @type {number}
 * @default 1
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.dragSensitivity
 */

/**
 * The SVG path to use for the resize handles.
 *
 * @type {Array}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.dragHandlePath
 */

/**
 * The fill color of the resize handles.
 *
 * @type {Color}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.dragHandleFill
 */

/**
 * The line color of the resize handles.
 *
 * @type {Color}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.dragHandleLineColor
 */

/**
 * The line width for the resizing handles.
 *
 * @type {number}
 * @default 2
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.dragHandleLineWidth
 */

/**
 * The mouse cursor to use for the resizing handles.
 *
 * @type {String}
 * @default ew-resize
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.dragHandleCursor
 */

/**
 * Enable dragging in the X dimension.
 *
 * @type {boolean}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.draggableX
 */

/**
 * Enable dragging in the Y dimension.
 *
 * @type {boolean}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.draggableY
 */

/**
 * Enable resizing of the points.
 *
 * @type {boolean}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.enableResize
 */

/**
 * Group the points by a property. Points with the same property value will be
 * grouped together when moving.
 *
 * @type {String}
 * @since 6.1.2
 * @apioption plotOptions.series.dragDrop.groupBy
 */

/**
 * Set a key to hold when dragging to zoom the chart. Requires the
 * draggable-points module. This is useful to avoid zooming while moving points.
 * Should be set different than [chart.panKey](#chart.panKey).
 *
 * @type {String}
 * @validvalue ["alt", "ctrl", "meta", "shift"]
 * @since 6.1.2
 * @apioption chart.zoomKey
 */

/**
 * Callback that fires while dragging a point. Temporary point values can be
 * read from `e.newX` and `e.newY`. Original values are available in
 * `e.dragStart`.
 *
 * Requires the draggable-points module.
 *
 * @type {Function}
 * @since 6.1.2
 * @apioption plotOptions.series.point.events.drag
 */

/**
 * Callback that fires when the point is dropped. Original values are available
 * in `e.dragStart`. The Point object is the context. Return false to cancel the
 * drop.
 *
 * Requires the draggable-points module.
 *
 * @type {Function}
 * @since 6.1.2
 * @apioption plotOptions.series.point.events.drop
 */

/**
 * Point specific options for the draggable-points module. Overrides options on
 * `series.dragDrop`.
 *
 * Requires the draggable-points module.
 *
 * @extends plotOptions.series.dragDrop
 * @since 6.1.2
 * @apioption series.line.data.dragDrop
 */


var doc = H.doc,
    addEvent = H.addEvent,
    find = H.find,
    each = H.each,
    objectEach = H.objectEach,
    extend = H.extend,
    defined = H.defined,
    merge = H.merge,
    pick = H.pick,
    wrap = H.wrap,
    dragGuideBox = {
        default: {
            'stroke-width': 1,
            'stroke-dasharray': '5, 5',
            stroke: '#888',
            fill: 'rgba(0, 0, 0, 0.1)',
            zIndex: 900
        },
        error: {
            fill: 'rgba(255, 0, 0, 0.2)'
        }
    };

/**
 * NB! Copied from modules/wordcloud.src.js
 * isRectanglesIntersecting - Detects if there is a collision between two
 *     rectangles.
 *
 * @param  {object} r1 First rectangle.
 * @param  {object} r2 Second rectangle.
 * @return {boolean} Returns true if the rectangles overlap.
 */
var isRectanglesIntersecting = function isRectanglesIntersecting(r1, r2) {
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
};


/**
 * Collision detection.
 * @param {Object} point The positions of the new point.
 * @param {Object} chart The chart to check if there is a collision.
 * @returns {Boolean} Returns true if the point is colliding.
 */
var isColliding = function (point, chart) {
    var r1 = {
            left: point.x,
            right: point.x2,
            top: point.y,
            bottom: point.y
        },
        r2,
        i = chart.series.length,
        j,
        p,
        series,
        groupBy;

    while (i--) {
        series = chart.series[i];
        j = series.points.length;
        groupBy = series.options.dragDrop && series.options.dragDrop.groupBy;
        while (j--) {
            p = series.points[j];
            r2 = {
                left: p.x,
                right: p.x2,
                top: p.y,
                bottom: p.y
            };

            if (
                // Not intersecting with the dragged point itself
                p !== chart.dragPoint &&
                // If the points are in a group they are not intersecting
                !(
                    groupBy && p.options && point.options &&
                    defined(point.options[groupBy]) &&
                    p.options[groupBy] === point.options[groupBy]
                ) &&
                // Check if they intersect
                isRectanglesIntersecting(r1, r2)
            ) {
                return true;
            }
        }
    }
    return false;
};


// Draw resize handles for a point
var showResizeHandles = function (point) {
    var renderer = point.series.chart.renderer,
        series = point.series,
        groupBy = series.options.dragDrop && series.options.dragDrop.groupBy,
        chart = series.chart,
        xAxis = series.xAxis,
        options = merge(series.options.dragDrop || {}, point.options.dragDrop),
        handleAttrs = {
            strokeWidth: pick(options.dragHandleLineWidth, 2),
            fill: pick(options.dragHandleFill, '#fff')
        },
        handleCss = {
            stroke: pick(options.dragHandleLineColor, 'rgba(0, 0, 0, 0.6)'),
            cursor: pick(options.dragHandleCursor, 'ew-resize')
        },
        resizeCollides = function (point, newX, margin) {
            var points = point.series.points,
                bBox = point.graphic.getBBox(),
                bBoxCmp,
                i = points.length,
                // Find points in same group
                adjoinedPointLeft = find(points, function (p) {
                    return p !== point &&
                        groupBy &&
                        defined(point.options[groupBy]) &&
                        p.options[groupBy] === point.options[groupBy] &&
                        p.x2 === point.x;
                }),
                adjoinedPointRight = find(points, function (p) {
                    return p !== point &&
                        groupBy &&
                        defined(point.options[groupBy]) &&
                        p.options[groupBy] === point.options[groupBy] &&
                        p.x === point.x2;
                });
            while (i--) {
                bBoxCmp = points[i].graphic.getBBox();
                if (
                    points[i] !== point &&
                    points[i] !== adjoinedPointLeft &&
                    points[i] !== adjoinedPointRight &&
                    isRectanglesIntersecting({
                        left: newX,
                        right: newX,
                        top: bBox.y,
                        bottom: bBox.y + bBox.height
                    }, {
                        left: points[i].x - margin,
                        right: points[i].x2 + margin,
                        top: bBoxCmp.y,
                        bottom: bBoxCmp.y + bBoxCmp.height
                    })
                ) {
                    return true;
                }
            }
            return false;
        };

    if (
        !chart.resizeHandles && // Don't show again if we already resizing
        !point.isAnimating && // Don't show if we are animating the point
        !point.overResizeHandle // Don't show again if we are hovering handle
    ) {
        if (!point.dragResizeHandles) {
            // Create handles if they don't exist
            point.dragResizeHandles = renderer.g()
                .add(point.graphic.parentGroup);
            point.rightResizeHandle = renderer.path(point.getDragHandlePath())
                .attr(handleAttrs).css(handleCss).add(point.dragResizeHandles);
            point.leftResizeHandle = renderer
                .path(point.getDragHandlePath(true))
                .attr(handleAttrs).css(handleCss).add(point.dragResizeHandles);

            // Add event handlers
            each([point.rightResizeHandle, point.leftResizeHandle],
                function (handle, i) {
                    addEvent(handle.element, 'mouseover', function () {
                        point.overResizeHandle = true;
                    });
                    addEvent(handle.element, 'mouseout', function () {
                        delete point.overResizeHandle;
                    });
                    addEvent(handle.element, 'mousedown', function (e) {
                        var groupBy = series.options.dragDrop &&
                                series.options.dragDrop.groupBy,
                            linkedPoints = series.points.filter(function (p) {
                                return groupBy && p.options &&
                                    defined(p.options[groupBy]) && (
                                    i ?
                                    // Left handle - look for earlier points
                                    p.options[groupBy] ===
                                        point.options[groupBy] &&
                                        p.x2 <= point.x :
                                    // Right handle - look for later points
                                    p.options[groupBy] ===
                                        point.options[groupBy] &&
                                        p.x >= point.x2
                                );
                            });
                        point.resizeStart = {
                            pageX: e.pageX,
                            plotX: Math.round(xAxis.toPixels(
                                i ? point.x : point.x2,
                                true
                            )),
                            handle: i ? 'left' : 'right',
                            translateX: handle.attr('translateX'),
                            linkedPoints: linkedPoints
                        };
                        point.dragResizeHandles.hide(); // Hide while dragging
                        chart.isDragResizing = true;
                        e.preventDefault();
                        e.stopPropagation();
                    });
                });

            addEvent(series.chart.container, 'mousemove', function (e) {
                var resizeData = point.resizeStart;
                if (resizeData) {
                    var newPoint = extend({}, point.options),
                        linkedPoints = resizeData.linkedPoints,
                        newLinkedPoint,
                        deltaPageX = e.pageX - resizeData.pageX,
                        newX = Math.round(xAxis.toValue(
                            resizeData.plotX + deltaPageX, true
                        )),
                        left = resizeData.handle === 'left',
                        deltaX = newX - (left ? point.x : point.x2),
                        handle = point[
                            left ? 'leftResizeHandle' : 'rightResizeHandle'
                        ],

                        // Margins for collision detection
                        collisionMargin = 0.2, // Percent of axis size
                        collisionPxMargin = (xAxis.max - xAxis.min) *
                            collisionMargin / 100,

                        // Point in group with most extreme x/x2
                        collidePoint = linkedPoints && linkedPoints.reduce(
                            function (acc, cur) {
                                return (left ?
                                    cur.x < acc.x : // This point lower
                                    cur.x2 > acc.x2 // This point higher
                                ) ? cur : acc;
                            }, point
                        ) || point,

                        // New x/x2 for collidePoint
                        collideX = collidePoint[left ? 'x' : 'x2'] + deltaX;


                    // Don't allow if we collide, or are resizing max to be
                    // smaller than min or vice versa.
                    if (
                        (newX <= point.x + collisionPxMargin && !left) ||
                        (newX >= point.x2 - collisionPxMargin && left) ||
                        resizeCollides(
                            collidePoint, collideX, collisionPxMargin
                        )
                    ) {
                        return;
                    }

                    newPoint[left ? 'x' : 'x2'] =
                        newPoint[left ? 'start' : 'end'] =
                        newX;

                    point.update(newPoint, true, false);

                    if (resizeData.linkedPoints) {
                        each(resizeData.linkedPoints, function (linkedPoint) {
                            newLinkedPoint = extend({}, linkedPoint.options);
                            newLinkedPoint.x = newLinkedPoint.start =
                                newLinkedPoint.x + deltaX;
                            newLinkedPoint.x2 = newLinkedPoint.end =
                                newLinkedPoint.x2 + deltaX;
                            linkedPoint.update(
                                newLinkedPoint, true, false
                            );
                        });
                    }

                    handle.translate(resizeData.translateX + deltaPageX, 0);
                }
            });
            addEvent(doc, 'mouseup', function () {
                // Show the handles again on mouseup
                if (chart.isDragResizing) {
                    chart.resizeHandles.show();
                }
                delete chart.isDragResizing;

                // Reset resize
                delete point.resizeStart;
            });
        } else {
            // Update handle location if already exists
            point.rightResizeHandle.attr({
                d: point.getDragHandlePath()
            }).translate(0, 0);
            point.leftResizeHandle.attr({
                d: point.getDragHandlePath(true)
            }).translate(0, 0);
        }
        point.dragResizeHandles.show();
        chart.resizeHandles = point.dragResizeHandles;
    }
};

// Get path of resize handles
H.Point.prototype.getDragHandlePath = function (left) {
    var bBox = this.graphic.getBBox(),
        shapeArgs = this.shapeArgs,
        radius = shapeArgs && shapeArgs.r || 0, // Rounding of bar corners
        x = shapeArgs.x || bBox.x,
        w = shapeArgs.width || bBox.width,
        centerX = Math.round(left ? x : x + w),
        top = bBox.y + radius,
        bottom = bBox.y + bBox.height - radius,
        centerY = bBox.y + (bBox.height / 2);
    return [
        // Top wick
        'M', centerX, top,
        'L', centerX, centerY - 5,
        // Box
        'A', 1, 1, 0, 0, 0, centerX, centerY + 5,
        'A', 1, 1, 0, 0, 0, centerX, centerY - 5,
        // Bottom wick
        'M', centerX, centerY + 5,
        'L', centerX, bottom
    ];
};

var hideResizeHandles = function (point) {
    var chart = point.series.chart;
    if (!chart.isDragResizing && chart.resizeHandles) {
        chart.resizeHandles.hide();
        delete chart.resizeHandles;
    }
};

// Add point hover events
wrap(H.Point.prototype, 'onMouseOver', function (proceed) {
    var point = this,
        ret = proceed.apply(point, Array.prototype.slice.call(arguments, 1));
    if (
        point.series.options.dragDrop &&
        point.series.options.dragDrop.enableResize &&
        point.options.enableResize !== false
    ) {
        showResizeHandles(point);
    }
    return ret;
});
wrap(H.Point.prototype, 'onMouseOut', function (proceed) {
    var point = this,
        ret = proceed.apply(point, Array.prototype.slice.call(arguments, 1));
    if (point.series.chart.resizeHandles) {
        hideResizeHandles(point);
    }
    return ret;
});


H.Chart.prototype.callbacks.push(function (chart) {
    var container = chart.container;

    function mouseDown() {
        var guideWidth,
            guideX,
            group = {
                start: Number.MAX_VALUE,
                end: Number.MIN_VALUE,
                y: 0
            },
            bBox,
            groupBy,
            dragPoint,
            dragDropOptions;

        if (chart.hoverPoint) {
            // Support draggableX/Y/Min/Max
            dragDropOptions = merge(
                chart.hoverPoint.series.options.dragDrop || {},
                chart.hoverPoint.options.dragDrop
            );
            if (!dragDropOptions.draggableX && !dragDropOptions.draggableY) {
                return;
            }
            group.draggableX = dragDropOptions.draggableX;
            group.draggableY = dragDropOptions.draggableY;
            group.dragMinX = pick(dragDropOptions.dragMinX, -Infinity);
            group.dragMinY = pick(dragDropOptions.dragMinY, -Infinity);
            group.dragMaxX = pick(dragDropOptions.dragMaxX, Infinity);
            group.dragMaxY = pick(dragDropOptions.dragMaxY, Infinity);

            // Store point to move
            dragPoint = chart.dragPoint = chart.hoverPoint;
            group.groupBy = groupBy = dragPoint.series.options.dragDrop &&
                dragPoint.series.options.dragDrop.groupBy;
            group.y = dragPoint.y;
            group.series = dragPoint.series;

            // Draw guide box
            bBox = dragPoint.graphic.getBBox();
            if (groupBy && defined(dragPoint.options[groupBy])) {
                guideX = bBox.x;
                guideWidth = dragPoint.series.points.reduce(
                    function (acc, cur) {
                        var bb;
                        if (
                            cur.options[groupBy] === dragPoint.options[groupBy]
                        ) {
                            bb = cur.graphic.getBBox();
                            guideX = Math.min(guideX, bb.x);
                            acc += bb.width;
                            // Collect start and end of group.
                            group.start = Math.min(cur.x, group.start);
                            group.end = Math.max(cur.x2, group.end);
                        }
                        return acc;
                    }, 0
                );
            } else {
                guideWidth = bBox.width;
                guideX = bBox.x;
                group.start = dragPoint.x;
                group.end = dragPoint.x2;
                group.y = dragPoint.y;
            }
            chart.dragPoint.group = group;

            chart.dragGuideBox = chart.renderer.rect(
                chart.plotLeft + guideX,
                chart.plotTop + bBox.y,
                guideWidth,
                bBox.height
            ).attr(dragGuideBox.default).add();
        }
    }

    function mouseMove(e) {
        var dragPoint = chart.dragPoint,
            group = dragPoint && dragPoint.group,
            xAxis,
            yAxis,
            xDelta,
            deltaX,
            deltaY,
            fakePoint;
        if (dragPoint) {
            xAxis = dragPoint.series.xAxis;
            yAxis = dragPoint.series.yAxis;
            // No tooltip while dragging
            e.preventDefault();

            // Update new positions
            dragPoint.dragPageX = dragPoint.dragPageX || e.pageX;
            dragPoint.dragPageY = dragPoint.dragPageY || e.pageY;
            deltaX = e.pageX - dragPoint.dragPageX;
            deltaY = e.pageY - dragPoint.dragPageY;

            dragPoint.newX = group.draggableX ?
                Math.max(
                    Math.min(
                        Math.round(xAxis.toValue(
                            dragPoint.plotX + deltaX, true
                        )),
                        group.dragMaxX
                    ),
                    group.dragMinX
                ) :
                dragPoint.x;

            dragPoint.newY = group.draggableY ?
                Math.max(
                    Math.min(
                        Math.round(yAxis.toValue(
                            dragPoint.plotY + deltaY, true
                        )),
                        group.dragMaxY
                    ),
                    group.dragMinY
                ) :
                dragPoint.y;

            xDelta = dragPoint.newX - dragPoint.x;

            // Check if the new position of the dragged point is colliding.
            fakePoint = {
                x: group.start + xDelta,
                x2: group.end + xDelta,
                y: dragPoint.newY
            };
            if (
                group &&
                group.groupBy &&
                defined(dragPoint.options[group.groupBy])
            ) {
                fakePoint.options = {};
                fakePoint.options[group.groupBy] =
                    dragPoint.options[group.groupBy];
            }
            dragPoint.isColliding = isColliding(fakePoint, chart);

            // Move guide box
            chart.dragGuideBox
                .translate(
                    group.draggableX ? deltaX : 0,
                    group.draggableY ? deltaY : 0
                )
                .attr(
                    dragPoint.isColliding ?
                    dragGuideBox.error :
                    dragGuideBox.default
                );

            // Fire drag event
            dragPoint.firePointEvent('drag', {
                newX: dragPoint.newX,
                newY: dragPoint.newY,
                x: dragPoint.newX,
                y: dragPoint.newY,
                dragStart: {
                    x: dragPoint.x,
                    x2: dragPoint.x2,
                    y: dragPoint.y
                }
            });
        }
    }

    function drop() {
        var newSeries,
            newPoints,
            deltaX,
            dragPoint = chart.dragPoint,
            oldSeries = dragPoint && dragPoint.group && dragPoint.group.series,
            groupBy = dragPoint && dragPoint.group && dragPoint.group.groupBy,
            groupByVal,
            reset = function () {
                // Remove guide box
                if (chart.dragGuideBox) {
                    chart.dragGuideBox.destroy();
                    delete chart.dragGuideBox;
                }
                // Remove stored dragging references on point in case we update
                // instead of replacing.
                if (dragPoint) {
                    delete dragPoint.dragPageX;
                    delete dragPoint.dragPageY;
                    delete dragPoint.newX;
                    delete dragPoint.newY;
                }
                // Remove chart reference to current dragging point
                delete chart.dragPoint;
            };

        if (
            dragPoint &&
            dragPoint.newX !== undefined &&
            dragPoint.newY !== undefined &&
            !dragPoint.isColliding
        ) {
            groupByVal = groupBy && dragPoint.options[groupBy];

            // Find series the points should belong to. This might have been
            // altered by setting point.series in the drop event.
            newSeries = dragPoint.series;
            if (!newSeries) {
                reset();
                return;
            }

            // Define options for the the new points
            deltaX = dragPoint.newX - dragPoint.x;
            newPoints = oldSeries.points.reduce(function (acc, cur) {
                // Only add points from the same series with the same group opt
                if (
                    groupBy && defined(groupByVal) ?
                        cur.options[groupBy] === groupByVal :
                        cur === dragPoint
                ) {
                    var point = {};
                    // Copy over data from old point
                    objectEach(cur.options, function (val, key) {
                        point[key] = val;
                    });
                    // Add in new data and push it
                    merge(true, point, {
                        x: cur.x + deltaX,
                        start: cur.x + deltaX,
                        x2: cur.x2 + deltaX,
                        end: cur.x2 + deltaX,
                        y: dragPoint.newY
                    });
                    point.oldPoint = cur;
                    acc.push(point);
                }
                return acc;
            }, []);

            // Hide resize lines if on
            hideResizeHandles(chart.dragPoint);

            // Update the point
            if (newSeries !== oldSeries) {
                each(newPoints, function (newPoint) {
                    var oldPoint = newPoint.oldPoint;

                    if (oldPoint.heatIndicator) {
                        oldPoint.heatIndicator =
                            oldPoint.heatIndicator.destroy();
                    }
                    if (oldPoint.indicatorObj) {
                        oldPoint.indicatorObj =
                            oldPoint.indicatorObj.destroy();
                    }

                    oldPoint.series = oldSeries;
                    newPoint.oldPoint = oldPoint = oldPoint.remove(false);
                    delete newPoint.oldPoint;
                    newSeries.addPoint(newPoint, false);
                });

                // Workaround to add new points to series.points, as this is not
                // done automatically by addPoint.
                newSeries.generatePoints();
            } else {
                // Use point.update if series is the same.
                // Make sure we don't allow resize handles on hover while
                // animating, so add a flag for that.
                each(newPoints, function (newPoint) {
                    var old = newPoint.oldPoint;
                    delete newPoint.oldPoint;
                    old.isAnimating = true;
                    old.update(newPoint, true, {
                        duration: 300
                    });
                    // Complete runs too fast (bug?), so set a timeout instead
                    setTimeout(function () {
                        delete old.isAnimating;
                    }, 310);
                });
            }

            // Call chart redraw to update the visual positions of the points
            // and indicators
            newSeries.chart.redraw();
            setTimeout(function () {
                if (chart.hoverPoint) {
                    chart.hoverPoint.firePointEvent('mouseOver');
                }
            }, 310);
        }

        // Always reset on mouseup
        reset();
    }

    // Fire drop event with drop() as the default handler
    function dropHandler() {
        var point = chart.dragPoint;
        if (point) {
            point.firePointEvent('drop', {
                newX: point.newX,
                newY: point.newY,
                x: point.newX,
                y: point.newY,
                dragStart: {
                    x: point.x,
                    x2: point.x2,
                    y: point.y
                }
            }, drop);
        }
    }

    // Add events
    addEvent(container, 'mousedown', mouseDown);
    addEvent(container, 'mousemove', mouseMove);
    addEvent(doc, 'mouseup', dropHandler);
    addEvent(container, 'mouseleave', dropHandler);
});


