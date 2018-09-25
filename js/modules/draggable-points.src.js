/**
 * (c) 2009-2018 Highsoft AS
 * Authors: Øystein Moseng, Torstein Hønsi, Jon A. Nygård
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var addEvent = H.addEvent,
    wrap = H.wrap,
    each = H.each,
    objectEach = H.objectEach,
    pick = H.pick,
    filter = H.grep,
    map = H.map,
    find = H.find,
    merge = H.merge,
    defaultDragSensitivity = 2,
    defaultGuideBoxOptions = {
        default: {
            className: 'highcharts-drag-box-default',
            lineWidth: 1,
            lineColor: '#888',
            color: 'rgba(0, 0, 0, 0.1)',
            cursor: 'move',
            zIndex: 900
        },
        error: {
            className: 'highcharts-drag-box-error',
            color: 'rgba(255, 0, 0, 0.2)'
        }
    },
    defaultDragHandleOptions = {
        // path: null,
        // cursor: null,
        className: 'highcharts-drag-handle',
        color: '#fff',
        lineColor: 'rgba(0, 0, 0, 0.6)',
        lineWidth: 1
    };


/*
    Add drag/drop support to specific data props for series.

    The dragDrop.draggableX/Y options on series enable/disable all of these per
    direction unless they are specifically set in options using
    dragDrop.{optionName}. If the prop does not specify an optionName here, it
    can only be enabled/disabled by the user with draggableX/Y.

    Supported options for each prop:
        optionName: Option in series.dragDrop that enables/disables updating
            this prop.
        axis: Whether this prop is linked to x or y axis.
        move: Whether or not this prop should be updated when moving points.
        resize: Whether or not to draw a drag handle and allow only this prop to
            update.
        resizeSide: Which side of the guide box to resize when dragging the
            handle. Can be "left", "right", "top", "bottom".
        handlePositioner: For resize props, return 0,0 in SVG coords of where to
            place the dragHandle. Gets point as argument. Should return object
            with x and y properties.
        handleFormatter: For resize props, return the path of the drag handle.
*/

// Column series - only draggableX/Y
H.seriesTypes.column.prototype.dragDropProps = {
    x: {
        axis: 'x',
        move: true
    },
    y: {
        axis: 'y',
        move: false,
        resize: true,
        resizeSide: 'top',
        handlePositioner: function (point) {
            var bBox = point.graphic.getBBox();
            return {
                x: bBox.x,
                y: bBox.y
            };
        },
        handleFormatter: function (point) {
            var shapeArgs = point.shapeArgs,
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
        }
    }
};

// Xrange - resize/move x/x2, and move y
if (H.seriesTypes.xrange) {
    var columnDragDropProps = H.seriesTypes.column.prototype.dragDropProps;
    H.seriesTypes.xrange.prototype.dragDropProps = {
        y: {
            axis: 'y',
            move: true
        },
        x: {
            optionName: 'draggableX1',
            axis: 'x',
            move: true,
            resize: true,
            resizeSide: 'left',
            handlePositioner: function (point) {
                var bBox = point.graphic.getBBox();
                return {
                    x: bBox.x,
                    y: bBox.y
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter
        },
        x2: {
            optionName: 'draggableX2',
            axis: 'x',
            move: true,
            resize: true,
            resizeSide: 'right',
            handlePositioner: function (point) {
                var bBox = point.graphic.getBBox();
                return {
                    x: bBox.x + bBox.width,
                    y: bBox.y
                };
            },
            handleFormatter: columnDragDropProps.y.handleFormatter
        }
    };
}

// Gantt - xrange with aliases
if (H.seriesTypes.gantt) {
    var xrangeDragDropProps = H.seriesTypes.xrange.prototype.dragDropProps;
    H.seriesTypes.gantt.prototype.dragDropProps = {
        y: xrangeDragDropProps.y,
        start: merge(xrangeDragDropProps.x, {
            optionName: 'draggableStart'
        }),
        end: merge(xrangeDragDropProps.x2, {
            optionName: 'draggableEnd'
        })
    };
}


/**
 * The draggable-points module allows points to be moved around or modified
 * in the chart.
 *
 * It requires the `modules/draggable-points.js` file to be loaded.
 *
 * @type {object}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop
 */

/**
 * Style options for the guide box. The guide box has two possible states,
 * default and error. The error state is displayed when a collision is
 * detected between the guide box and other points in the chart.
 *
 * @type {object}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.guideBox
 */

/**
 * Style options for the guide box default state.
 *
 * @type {object}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.guideBox.default
 */

/**
 * CSS class name of the guide box in this state.
 *
 * @type {String}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.guideBox.default.className
 */

/**
 * Color of the border around the guide box.
 *
 * @type {Color}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.guideBox.default.lineColor
 */

/**
 * Width of the line around the guide box.
 *
 * @type {number}
 * @default 1
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.guideBox.default.lineWidth
 */

/**
 * Guide box fill color.
 *
 * @type {Color}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.guideBox.default.color
 */

/**
 * Guide box cursor.
 *
 * @type {string}
 * @default move
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.guideBox.default.cursor
 */

/**
 * Guide box zIndex.
 *
 * @type {number}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.guideBox.default.zIndex
 */

/**
 * Style options for the guide box invalid state.
 *
 * @type {object}
 * @extends plotOptions.series.dragDrop.guideBox.default
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.guideBox.error
 */

/**
 * Set the minimum X value the points can be moved to.
 *
 * @type {number}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragMinX
 */

/**
 * Set the maximum X value the points can be moved to.
 *
 * @type {number}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragMaxX
 */

/**
 * Set the minimum Y value the points can be moved to.
 *
 * @type {number}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragMinY
 */

/**
 * Set the maximum Y value the points can be moved to.
 *
 * @type {number}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragMaxY
 */

/**
 * The X precision value to drag to for this series. Set to 0 to disable.
 *
 * @type {number}
 * @default 1
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragPrecisionX
 */

/**
 * The Y precision value to drag to for this series. Set to 0 to disable.
 *
 * @type {number}
 * @default 1
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragPrecisionY
 */

/**
 * The amount of pixels to drag the pointer before it counts as a drag
 * operation. This prevents drag/drop to fire when just clicking or selecting
 * points.
 *
 * @type {number}
 * @default 2
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragSensitivity
 */

/**
 * Options for the drag handles.
 *
 * @type {Object}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragHandle
 */

/**
 * Function to define the SVG path to use for the drag handles. Takes the
 * point as argument. Should return an SVG path in array format. The SVG path is
 * automatically positioned on the point.
 *
 * @type {Function}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragHandle.pathFormatter
 */

/**
 * The fill color of the drag handles.
 *
 * @type {Color}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragHandle.color
 */

/**
 * The line color of the drag handles.
 *
 * @type {Color}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragHandle.lineColor
 */

/**
 * The line width for the drag handles.
 *
 * @type {number}
 * @default 2
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragHandle.lineWidth
 */

/**
 * The mouse cursor to use for the drag handles. By default this is
 * intelligently switching between ew-resize and ns-resize depending on the
 * direction the point is being dragged.
 *
 * @type {String}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.dragHandle.cursor
 */

/**
 * Enable dragging in the X dimension.
 *
 * @type {boolean}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.draggableX
 */

/**
 * Enable dragging in the Y dimension. Note that this is not supported for
 * TreeGrid axes (the default axis type in Gantt charts).
 *
 * @type {boolean}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.draggableY
 */

/**
 * Group the points by a property. Points with the same property value will be
 * grouped together when moving.
 *
 * @type {String}
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.groupBy
 */

/**
 * Enable real time collision detection while moving points. Disable this for
 * better drag/drop performance in larger datasets.
 *
 * @type {boolean}
 * @default true
 * @since 6.2.0
 * @apioption plotOptions.series.dragDrop.realTimeCollisionDetection
 */

/**
 * Set a key to hold when dragging to zoom the chart. Requires the
 * draggable-points module. This is useful to avoid zooming while moving points.
 * Should be set different than [chart.panKey](#chart.panKey).
 *
 * @type {String}
 * @validvalue ["alt", "ctrl", "meta", "shift"]
 * @since 6.2.0
 * @apioption chart.zoomKey
 */

/**
 * Callback that fires when starting to drag a point. The mouse event object is
 * passed in as an argument.
 *
 * Requires the draggable-points module.
 *
 * @type {Function}
 * @since 6.2.0
 * @apioption plotOptions.series.point.events.dragStart
 */

/**
 * Callback that fires while dragging a point. The mouse event is passed in as
 * parameter. The original data can be accessed from `e.origin`.
 *
 * Requires the draggable-points module.
 *
 * @type {Function}
 * @since 6.2.0
 * @apioption plotOptions.series.point.events.drag
 */

/**
 * Callback that fires when the point is dropped. The mouse event is passed in
 * as parameter. The original data can be accessed from e.origin, and the new
 * point values can be accessed from e.newPoints.
 *
 * Requires the draggable-points module.
 *
 * @type {Function}
 * @since 6.2.0
 * @apioption plotOptions.series.point.events.drop
 */

/**
 * Point specific options for the draggable-points module. Overrides options on
 * `series.dragDrop`.
 *
 * Requires the draggable-points module.
 *
 * @extends plotOptions.series.dragDrop
 * @since 6.2.0
 * @apioption series.line.data.dragDrop
 */


// Test if a series is using drag/drop
function isSeriesDraggable(series) {
    var props = ['draggableX', 'draggableY'],
        i;

    // Add optionNames from dragDropProps to the array of props to check for
    objectEach(series.dragDropProps, function (val) {
        if (val.optionName) {
            props.push(val.optionName);
        }
    });

    // Loop over all options we have that could enable dragDrop for this
    // series. If any of them are truthy, this series is draggable.
    i = props.length;
    while (i--) {
        if (series.options.dragDrop[props[i]]) {
            return true;
        }
    }
}


// Test if a chart is using drag/drop
function isChartDraggable(chart) {
    var i = chart.series.length;
    if (chart.hasCartesianSeries) {
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


// Test if a point is movable
function isPointMovable(point) {
    var series = point.series,
        seriesDragDropOptions = series.options.dragDrop,
        pointDragDropOptions = point.options && point.options.dragDrop;

    // We can only move the point if draggableX/Y is set, even if all the
    // individual prop options are set. If this turns out to be an issue, let's
    // revisit the logic.
    return (
            seriesDragDropOptions.draggableX ||
            seriesDragDropOptions.draggableY
        ) &&
        !(
            pointDragDropOptions &&
            pointDragDropOptions.draggableX === false &&
            pointDragDropOptions.draggableY === false
        ) &&
        series.yAxis &&
        series.xAxis;
}


// In mousemove events, check that we have dragged mouse further than the
// dragSensitiviy before we call mouseMove handler.
function hasDraggedPastSensitivity(e, chart, sensitivity) {
    var orig = chart.dragDropData.origin,
        oldX = orig.pageX,
        oldY = orig.pageY,
        newX = e.pageX,
        newY = e.pageY,
        distance = Math.sqrt(
            (newX - oldX) * (newX - oldX) +
            (newY - oldY) * (newY - oldY)
        );
    return distance > sensitivity;
}


// Get a snapshot of point and mouse position
function getPositionSnapshot(e, point) {
    var res = {
        pageX: e.pageX,
        pageY: e.pageY
    };

    // Add all of the props defined in the series' dragDropProps to the snapshot
    objectEach(point.series.dragDropProps, function (val, key) {
        res[key] = point[key];
    });

    return res;
}


// Get a list of points that are grouped with this point
function getGroupedPoints(point) {
    var series = point.series,
        groupKey = series.options.dragDrop.groupBy;
    return point.options[groupKey] ?
        // If we have a grouping option, filter the points by that
        filter(series.points, function (comparePoint) {
            return comparePoint.options[groupKey] === point.options[groupKey];
        }) :
        // Otherwise return the point by itself only
        [point];
}


// Resize a rect element on one side. Takes the element, which side to update,
// and the amount to update (x and y directions) as arguments.
function resizeRect(rect, updateSide, dX, dY) {
    var resizeAttrs;
    switch (updateSide) {
        case 'left':
            resizeAttrs = {
                x: rect.attr('x') + dX,
                width: rect.attr('width') - dX
            };
            break;
        case 'right':
            resizeAttrs = {
                width: rect.attr('width') + dX
            };
            break;
        case 'top':
            resizeAttrs = {
                height: rect.attr('height') + dY
            };
            break;
        case 'bottom':
            resizeAttrs = {
                y: rect.attr('y') + dY,
                height: rect.attr('height') - dY
            };
            break;
        default:
    }
    rect.attr(resizeAttrs);
}


// Check if a list of new points is colliding with other points in the chart
function newPointsColliding(points) {
    find(points, function () {
        // Find out if this point collides with any other existing points that
        // are not in this group.
        return false;
    });
}


// Prepare chart.dragDrop data with origin info, and show the guide box
function initDragDrop(e, point) {
    var groupedPoints = getGroupedPoints(point),
        series = point.series,
        chart = series.chart;

    // Store some data on the chart to pick up later
    chart.dragDropData = {
        origin: getPositionSnapshot(e, point),
        point: point,
        groupedPoints: groupedPoints
    };

    // Show the drag box with the default state
    chart.dragGuideBox = series.getGuideBox(groupedPoints);
    chart.setGuideBoxState('default', series.options.dragDrop.guideBox)
        .add(series.group);

    // Set drag state
    chart.isDragging = true;
}


// Get new point options from points being dragged
function getNewPoints(dragDropData, newPos) {
    var point = dragDropData.point,
        series = point.series,
        options = merge(series.options.dragDrop, point.options.dragDrop),
        updateProps = {},
        resizeProp = dragDropData.updateProp;

    // Go through the data props that can be updated on this series
    objectEach(point.series.dragDropProps, function (val, key) {
        // Respect draggable options, allowing specific overrides and otherwise
        // using draggableX/Y.
        var enabled = pick(
                val.optionName && options[val.optionName],
                val.axis === 'x' ?
                    options.draggableX : options.draggableY
            );

        // If we are resizing and this is not the prop we are resizing, ignore
        if (resizeProp && resizeProp !== key) {
            return;
        }

        // If this prop is enabled, add it to be updated
        if (enabled && (resizeProp ? val.resize : val.move)) {
            updateProps[key] = val;
        }
    });

    return map(dragDropData.groupedPoints, function (p) {
        return {
            point: p,
            newValues: p.getDropValues(dragDropData.origin, newPos, updateProps)
        };
    });
}


// Default mouse move handler while dragging
function dragMove(e, point) {
    var chart = point.series.chart,
        data = chart.dragDropData,
        options = merge(point.series.options.dragDrop, point.options.dragDrop),
        draggableX = options.draggableX,
        draggableY = options.draggableY,
        origin = data.origin,
        dX = draggableX ? e.pageX - origin.pageX : 0,
        dY = draggableY ? e.pageY - origin.pageY : 0,
        oldDx = dX,
        updateProp = data.updateProp;

    // Handle inverted
    if (chart.inverted) {
        dX = -dY;
        dY = -oldDx;
    }

    if (updateProp) {
        // We are resizing, so resize the guide box
        // updateProp.resizeSide holds info on which side to resize.
        resizeRect(chart.dragGuideBox, updateProp.resizeSide, dX, dY);
    } else {
        // We are moving, so just move the guide box
        chart.dragGuideBox.translate(dX, dY);
    }

    if (options.realTimeCollisionDetection !== false) {
        // If collision detection during move is enabled, find the new point
        // values from the moving.
        chart.dragDropData.newPoints = getNewPoints(data, e);

        // Update collision status
        if (newPointsColliding(chart.dragDropData.newPoints)) {
            chart.setGuideBoxState('error', options.guideBox);
        } else {
            chart.setGuideBoxState('default', options.guideBox);
        }
    }
}


// Default mouse up handler while dragging
function dragEnd(point) {
    var series = point.series,
        chart = series.chart,
        newPoints = chart.dragDropData.newPoints;

    // Update the points
    each(newPoints, function (newPoint) {
        newPoint.point.update(newPoint.newValues, true);
    });

    series.redraw();
}


// Set the state of the guide box. Pass in the state to set it to as string, as
// well as additional overall guideBox options to merge in.
H.Chart.prototype.setGuideBoxState = function (state, options) {
    var guideBox = this.dragGuideBox,
        guideBoxOptions = merge(defaultGuideBoxOptions, options),
        stateOptions = merge(guideBoxOptions.default, guideBoxOptions[state]);
    return guideBox.attr({
        className: stateOptions.className,
        stroke: stateOptions.lineColor,
        strokeWidth: stateOptions.lineWidth,
        fill: stateOptions.color,
        cursor: stateOptions.cursor,
        zIndex: stateOptions.zIndex
    });
};


/**
 * Get updated point values when dragging a point.
 *
 * @param {object} oldPos Mouse position (pageX/Y) and point props at current
 *  data values.
 * @param {object} newPos New mouse position (pageX/Y).
 * @param {object} updateProps Point props to modify. Map of prop objects where
 *  each key refers to the prop, and the value is an object with an axis
 *  property. Example:
 *  {
 *      x: {
 *          axis: 'x'
 *      },
 *      x2: {
 *          axis: 'x'
 *      }
 *  }
 * @returns {object} An object with updated data values.
 */
H.Point.prototype.getDropValues = function (oldPos, newPos, updateProps) {
    var point = this,
        series = point.series,
        options = merge(series.options.dragDrop, point.options.dragDrop),
        yAxis = series.yAxis,
        xAxis = series.xAxis,
        dX = newPos.pageX - oldPos.pageX,
        dY = newPos.pageY - oldPos.pageY,
        dXValue = xAxis.toValue(
            xAxis.toPixels(point.x, true) +
            (xAxis.horiz ? dX : dY),
            true
        ) - point.x,
        dYValue = yAxis.toValue(
            yAxis.toPixels(point.y, true) +
            (yAxis.horiz ? dX : dY),
            true
        ) - point.y,
        result = {};

    // Utility function to apply precision and limit a value within the
    // draggable range
    function limitToRange(val, direction) {
        var precision = pick(options['dragPrecision' + direction], 1),
            min = options['dragMin' + direction] || -Infinity,
            max = options['dragMax' + direction] || Infinity,
            res = val;
        if (precision) {
            res = Math.round(res / precision) * precision;
        }
        return Math.max(min, Math.min(max, res));
    }

    // Assign new value to property. Adds dX/YValue to the old value, limiting
    // it within min/max ranges.
    objectEach(updateProps, function (val, key) {
        var newVal = val.axis === 'x' ? dXValue : dYValue,
            oldVal = point.options[key];
        result[key] = limitToRange(oldVal + newVal, val.axis.toUpperCase());
    });

    return result;
};


// Returns an SVGElement to use as the guide box for these points.
H.Series.prototype.getGuideBox = function (points) {
    var chart = this.chart,
        minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;

    // Find bounding box of all points
    each(points, function (point) {
        var bBox = point.graphic.getBBox();
        minX = Math.min(bBox.x, minX);
        maxX = Math.max(bBox.x + bBox.width, maxX);
        minY = Math.min(bBox.y, minY);
        maxY = Math.max(bBox.y + bBox.height, maxY);
    });
    return chart.renderer.rect(
        minX,
        minY,
        maxX - minX,
        maxY - minY
    );
};


// Mousedown on resize handle
function onResizeHandleMouseDown(e, point, updateProp) {
    var chart = point.series.chart;

    // Ignore if zoom/pan key is pressed
    if (chart.zoomOrPanKeyPressed(e)) {
        return;
    }

    initDragDrop(e, point);
    chart.dragDropData.isDragging = true;
    chart.dragDropData.updateProp = e.updateProp = updateProp;
    point.firePointEvent('dragStart', e);

    // Prevent default to avoid point click for dragging too
    e.stopPropagation();
    e.preventDefault();
}


// Render drag handles on a point, and attach events to them
H.Point.prototype.showDragHandles = function () {
    var point = this,
        series = point.series,
        chart = series.chart,
        renderer = chart.renderer,
        options = merge(
            defaultDragHandleOptions,
            series.options.dragDrop && series.options.dragDrop.dragHandle || {},
            point.options.dragDrop && point.options.dragDrop.dragHandle
        ),
        handleAttrs = {
            className: options.className,
            'stroke-width': options.lineWidth,
            fill: options.color,
            stroke: options.lineColor
        };

    // Go through each updateProp and see if we are supposed to create a handle
    // for it.
    objectEach(series.dragDropProps, function (val, key) {
        var pathFormatter = options.pathFormatter || val.handleFormatter,
            positioner = val.handlePositioner,
            pos,
            handle;
        if (val.resize && val.resizeSide) {

            // Create group if it doesn't exist
            if (!chart.dragHandles) {
                chart.dragHandles = {
                    group: renderer.g('drag-drop-handles').add(series.group)
                };
            }

            // Find position of handle
            pos = positioner(point);

            // If cursor is not set explicitly, use axis direction
            handleAttrs.cursor = options.cursor ||
                (val.axis === 'x') !== !!chart.inverted ?
                    'ew-resize' : 'ns-resize';

            // Create and add the handle element
            chart.dragHandles[val.resizeSide] = handle = renderer
                .path(pathFormatter(point))
                .translate(pos.x, pos.y)
                .attr(handleAttrs)
                .add(chart.dragHandles.group);

            // Add click event
            addEvent(handle.element, 'mousedown', function (e) {
                onResizeHandleMouseDown(e, point, key);
            });
        }
    });
};


// Remove the chart's drag handles
H.Chart.prototype.hideDragHandles = function () {
    var chart = this;
    if (chart.dragHandles) {
        objectEach(chart.dragHandles, function (val, key) {
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


// On point mouse over
function mouseOver(point) {
    var series = point.series,
        chart = series.chart;
    if (
        !(chart.dragDropData && chart.dragDropData.isDragging) &&
        series.options.dragDrop &&
        !(
            chart.options.chart &&
            chart.options.chart.options3d
        )
    ) {
        // Hide the handles if they exist on another point already
        if (chart.dragHandles) {
            chart.hideDragHandles();
        }
        point.showDragHandles();
    }
}


// On point mouse out
function mouseOut(point) {
    var chart = point.series.chart;
    if (
        !(chart.dragDropData && chart.dragDropData.isDragging) &&
        chart.dragHandles
    ) {
        chart.hideDragHandles();
    }
}


// On container mouse move
function mouseMove(e, chart) {
    // Ignore if zoom/pan key is pressed
    if (chart.zoomOrPanKeyPressed(e)) {
        return;
    }

    var dragDropData = chart.dragDropData;
    if (dragDropData && dragDropData.isDragging) {
        var point = dragDropData.point,
            seriesDragDropOpts = point.series.options.dragDrop;

        // No tooltip for dragging
        e.preventDefault();

        // Update sensitivity test if not passed yet
        if (!dragDropData.draggedPastSensitivity) {
            dragDropData.draggedPastSensitivity = hasDraggedPastSensitivity(
                e, chart, pick(
                    point.options.dragDrop &&
                        point.options.dragDrop.dragSensitiviy,
                    seriesDragDropOpts &&
                        seriesDragDropOpts.dragSensitiviy,
                    defaultDragSensitivity
                )
            );
        }

        // If we have dragged past dragSensitiviy, run the mousemove handler
        // for dragging
        if (dragDropData.draggedPastSensitivity) {
            // Run the handler
            point.firePointEvent('drag', {
                origin: dragDropData.origin,
                pageX: e.pageX,
                pageY: e.pageY
            }, function () {
                dragMove(e, point);
            });
        }
    }
}


// On container mouse up
function mouseUp(e, chart) {
    var dragDropData = chart.dragDropData;
    if (
        dragDropData &&
        dragDropData.isDragging &&
        dragDropData.draggedPastSensitivity
    ) {
        var point = dragDropData.point;

        // If real time collision detection is off, we don't calculate new point
        // values during drag, so do it now instead.
        if (!dragDropData.newPoints) {
            chart.dragDropData.newPoints = getNewPoints(dragDropData, e);
        }

        // Fire the event, with a default handler that updates the point
        point.firePointEvent('drop', {
            origin: dragDropData.origin,
            pageX: e.pageX,
            pageY: e.pageY,
            newPoints: dragDropData.newPoints
        }, function () {
            dragEnd(point);
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


// On container mouse down
function mouseDown(e, chart) {
    var dragPoint = chart.hoverPoint;

    // Ignore if zoom/pan key is pressed
    if (chart.zoomOrPanKeyPressed(e)) {
        return;
    }

    // If we somehow get a mousedown event while we are dragging, cancel
    if (chart.dragDropData && chart.dragDropData.isDragging) {
        mouseUp(e, chart);
        return;
    }

    // If this point is movable, start dragging it
    if (dragPoint && isPointMovable(dragPoint)) {
        initDragDrop(e, dragPoint);
        chart.dragDropData.isDragging = true;
        dragPoint.firePointEvent('dragStart', e);
    }
}


// Point hover event
wrap(H.Point.prototype, 'onMouseOver', function (proceed) {
    var point = this,
        ret = proceed.apply(point, Array.prototype.slice.call(arguments, 1));
    mouseOver(point);
    return ret;
});


// Point mouseleave event
wrap(H.Point.prototype, 'onMouseOut', function (proceed) {
    var point = this,
        ret = proceed.apply(point, Array.prototype.slice.call(arguments, 1));
    mouseOut(point);
    return ret;
});


// Check whether the zoomKey or panKey is pressed
H.Chart.prototype.zoomOrPanKeyPressed = function (e) {
    // Check whether the panKey and zoomKey are set in chart.userOptions
    var chartOptions = this.userOptions.chart || {},
        panKey = chartOptions.panKey && chartOptions.panKey + 'Key',
        zoomKey = chartOptions.zoomKey && chartOptions.zoomKey + 'Key';
    return (e[zoomKey] || e[panKey]);
};


// Add events to document and chart after chart has been created
H.Chart.prototype.callbacks.push(function (chart) {
    var container = chart.container,
        doc = H.doc;

    // Only enable if we have a draggable chart
    if (isChartDraggable(chart)) {
        addEvent(container, 'mousemove', function (e) {
            mouseMove(e, chart);
        });
        addEvent(container, 'touchmove', function (e) {
            mouseMove(e, chart);
        });
        addEvent(container, 'mousedown', function (e) {
            mouseDown(e, chart);
        });
        addEvent(container, 'touchstart', function (e) {
            mouseDown(e, chart);
        });
        addEvent(container, 'mouseleave', function (e) {
            mouseUp(e, chart);
        });
        chart.unbindDragDropMouseUp = addEvent(doc, 'mouseup', function (e) {
            mouseUp(e, chart);
        });
        chart.unbindDragDropTouchEnd = addEvent(doc, 'touchend', function (e) {
            mouseUp(e, chart);
        });

        // Add cleanup to make sure we don't pollute document
        addEvent(chart, 'destroy', function () {
            if (chart.unbindDragDropMouseUp) {
                chart.unbindDragDropMouseUp();
            }
            if (chart.unbindDragDropTouchEnd) {
                chart.unbindDragDropTouchEnd();
            }
        });
    }
});
